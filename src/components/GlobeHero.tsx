import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { getImageUrl } from '../utils/getImageUrl';
import { 
  PerspectiveCamera, 
  Float, 
  Stars, 
  useTexture, 
  Points,
  Line
} from '@react-three/drei';
import * as THREE from 'three';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Constants ---
const GLOBE_RADIUS = 2.5;
const PARTICLE_COUNT = 25000;
const SRI_LANKA_LAT = 7.8731;
const SRI_LANKA_LON = 80.7718;

// Simplified Sri Lanka outline coordinates (lat, lon)
const SRI_LANKA_OUTLINE = [
  [9.8, 80.2], [9.5, 80.5], [9.2, 80.8], [8.8, 81.2], [8.2, 81.8], 
  [7.5, 81.8], [6.8, 81.8], [6.3, 81.5], [5.9, 80.5], [6.0, 80.0], 
  [6.5, 79.8], [7.2, 79.8], [8.0, 79.8], [8.8, 80.0], [9.5, 80.1], [9.8, 80.2]
];

// --- Helper: Lat/Lon to Vector3 ---
function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// --- Shader for Shimmering Gradient Particles ---
const vertexShader = `
  varying vec3 vPosition;
  varying float vOpacity;
  uniform float uTime;
  
  void main() {
    vPosition = position;
    
    // Shimmer effect based on time and position
    float shimmer = sin(uTime * 1.5 + position.x * 5.0 + position.y * 3.0 + position.z * 4.0) * 0.5 + 0.5;
    vOpacity = 0.2 + shimmer * 0.8;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 3.0 * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vPosition;
  varying float vOpacity;
  
  void main() {
    // Circle shape for points
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    
    // Gradient: Left (Magenta) to Right (Cyan)
    // Map x position (-GLOBE_RADIUS to GLOBE_RADIUS) to 0.0 - 1.0
    float t = (vPosition.x + 2.5) / 5.0;
    
    vec3 colorA = vec3(1.0, 0.0, 0.6); // Magenta
    vec3 colorB = vec3(0.0, 1.0, 1.0); // Cyan
    vec3 finalColor = mix(colorA, colorB, t);
    
    gl_FragColor = vec4(finalColor, vOpacity * 0.7);
  }
`;

const GlobeParticles = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [points, setPoints] = useState<Float32Array>(new Float32Array(0));
  
  const texture = useTexture('https://raw.githubusercontent.com/vasturiano/three-globe/master/example/img/earth-topology.png');

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = texture.image as HTMLImageElement;
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const positions = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT);
      const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi;

      const x = GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta);
      const y = GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta);
      const z = GLOBE_RADIUS * Math.cos(phi);

      const u = 1 - (Math.atan2(x, z) + Math.PI) / (2 * Math.PI);
      const v = Math.acos(y / GLOBE_RADIUS) / Math.PI;

      const px = Math.floor(u * canvas.width);
      const py = Math.floor(v * canvas.height);
      const index = (py * canvas.width + px) * 4;

      if (data[index] > 128) {
        positions.push(x, y, z);
      }
    }
    setPoints(new Float32Array(positions));
  }, [texture]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <Points ref={pointsRef} positions={points} stride={3}>
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 }
        }}
      />
    </Points>
  );
};

const NetworkMesh = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  const { lines, nodes } = useMemo(() => {
    const l = [];
    const n = [];
    const nodeCount = 80;
    
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const r = GLOBE_RADIUS + 0.08 + Math.random() * 0.15;
      
      n.push(new THREE.Vector3(
        r * Math.sin(theta) * Math.cos(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(theta)
      ));
    }

    for (let i = 0; i < n.length; i++) {
      // Find nearest neighbors to create a triangular mesh look
      const neighbors = n
        .map((other, idx) => ({ idx, dist: n[i].distanceTo(other) }))
        .filter(item => item.idx !== i && item.dist < 1.4)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 3);
      
      neighbors.forEach(neighbor => {
        l.push({ start: n[i], end: n[neighbor.idx] });
      });
    }
    return { lines: l, nodes: n };
  }, []);

  return (
    <group ref={groupRef}>
      {lines.map((line, i) => (
        <Line
          key={i}
          points={[line.start, line.end]}
          color="#ffffff"
          lineWidth={0.3}
          transparent
          opacity={0.1}
        />
      ))}
      {nodes.map((node, i) => (
        <mesh key={`node-${i}`} position={node}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
};

const SriLankaHighlight = () => {
  const lineRef = useRef<THREE.Line>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  
  const points = useMemo(() => {
    return SRI_LANKA_OUTLINE.map(([lat, lon]) => latLonToVector3(lat, lon, GLOBE_RADIUS + 0.02));
  }, []);

  const centerPos = useMemo(() => latLonToVector3(SRI_LANKA_LAT, SRI_LANKA_LON, GLOBE_RADIUS + 0.05), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (haloRef.current) {
      const haloScale = 1.2 + Math.sin(t * 2) * 0.3;
      haloRef.current.scale.set(haloScale, haloScale, haloScale);
      (haloRef.current.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(t * 2) * 0.15;
    }
  });

  return (
    <group>
      {/* Glowing Outline */}
      <Line
        points={points}
        color="#00ffff"
        lineWidth={2}
        transparent
        opacity={0.8}
      />
      
      {/* Central Glow */}
      <mesh position={centerPos} ref={haloRef}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.4} />
      </mesh>

      {/* Inner Glow Point */}
      <mesh position={centerPos}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

const GlobeScene = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    if (groupRef.current) {
      // Slow continuous rotation
      groupRef.current.rotation.y += 0.0008;
      
      // Micro-parallax camera shift on mouse move
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, -1.0 + mouse.x * 0.4, 0.05);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0.2 + mouse.y * 0.3, 0.05);
    }
  });

  return (
    <group ref={groupRef} position={[-1.5, 0, 0]}>
      <GlobeParticles />
      <NetworkMesh />
      <SriLankaHighlight />
    </group>
  );
};

let hasSiteLoaded = false;
window.addEventListener('site-visible', () => { hasSiteLoaded = true; });

const HeroOverlay = () => {
  const [startAnim, setStartAnim] = useState(hasSiteLoaded);

  useEffect(() => {
    if (hasSiteLoaded) {
      setStartAnim(true);
      return;
    }
    const handle = () => {
      hasSiteLoaded = true;
      setStartAnim(true);
    };
    window.addEventListener('site-visible', handle);
    const fallback = setTimeout(() => handle(), 3000);
    return () => {
      window.removeEventListener('site-visible', handle);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-end pointer-events-none">
      <div className="max-w-7xl w-full px-6 md:px-12 flex flex-col items-center md:items-end text-center md:text-right">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={startAnim ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-3xl pointer-events-auto"
        >
          <h1 className="text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[1.1] mb-6 tracking-tight text-white">
            Federation of <br />
            IT Industry, <br />
            Sri Lanka
          </h1>
          
          <div className="flex flex-wrap gap-4 justify-center md:justify-end mt-12">
            <Link to="/Home/become-a-member" className="bg-fitis-blue text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-fitis-blue-light transition-all shadow-xl shadow-fitis-blue/20 active:scale-95 inline-block border-2 border-transparent">
              Apply Membership
            </Link>
            <Link to="/Home/member-benefits" className="bg-white/5 text-white border border-white/10 px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all active:scale-95 inline-block text-center border-2 border-transparent">
              Explore Impact
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={startAnim ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: startAnim ? 1 : 0, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-bold">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="text-white/40" size={28} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export const GlobeHero = () => {
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);
  const [settings, setSettings] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleSiteVisible = () => {
      if (videoRef.current) {
        videoRef.current.play().catch(e => console.error('Video play blocked:', e));
      }
    };
    window.addEventListener('site-visible', handleSiteVisible);
    
    const safetyTimer = setTimeout(() => {
      handleSiteVisible();
    }, 4000);

    return () => {
      window.removeEventListener('site-visible', handleSiteVisible);
      clearTimeout(safetyTimer);
    };
  }, []);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const support = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      setIsWebGLSupported(support);
    } catch (e) {
      setIsWebGLSupported(false);
    }

    // Fetch site settings
    const fetchSettings = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';
        const res = await fetch(`${baseUrl}/api/site-settings?t=${new Date().getTime()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error('Failed to load site settings for hero', err);
      }
    };
    fetchSettings();
  }, []);

  // Use custom media if configured
  if (settings?.hero_url) {
    const mediaUrl = getImageUrl(settings.hero_url, settings.updated_at ? new Date(settings.updated_at).getTime() : undefined);

    return (
      <section className="relative h-screen w-full bg-[#000d1a] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#001a33] via-[#000d1a] to-[#001a33] opacity-20 z-10 pointer-events-none" />
        {settings.hero_type === 'video' ? (
           <video
             ref={videoRef}
             src={mediaUrl}
             muted
             loop
             playsInline
             className="absolute inset-0 w-full h-full object-cover z-0"
             onError={(e) => {
               // Fallback to static background color/image if video fails to load
               e.currentTarget.style.display = 'none';
               const parent = e.currentTarget.parentElement;
               if (parent) {
                 parent.style.backgroundImage = "url('https://picsum.photos/seed/tech/1920/1080?blur=10')";
                 parent.style.backgroundSize = "cover";
                 parent.style.backgroundPosition = "center";
               }
             }}
           />
        ) : (
           <div
             className="absolute inset-0 bg-cover bg-center z-0"
             style={{ backgroundImage: `url(${mediaUrl})` }}
           />
        )}
        <HeroOverlay />
      </section>
    );
  }

  // Fallback to WebGL Globe or Static image
  if (!isWebGLSupported) {
    return (
      <section className="relative h-screen w-full bg-[#000d1a] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#001a33] via-[#000d1a] to-[#001a33] opacity-90" />
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/tech/1920/1080?blur=10')] bg-cover bg-center opacity-20" />
        <HeroOverlay />
      </section>
    );
  }

  return (
    <section className="relative h-screen w-full bg-[#00040a] overflow-hidden">
      {/* Deep Navy Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#001529_0%,#00040a_100%)]" />
      
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas dpr={[1, 2]} gl={{ antialias: false, alpha: true }}>
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={38} />
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <pointLight position={[-10, -10, -10]} color="#004a99" intensity={0.8} />
            
            <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.3}>
              <GlobeScene />
            </Float>
            
            <Stars radius={150} depth={60} count={6000} factor={5} saturation={0} fade speed={0.5} />
            
            <EffectComposer>
              <Bloom 
                luminanceThreshold={0.15} 
                luminanceSmoothing={0.9} 
                height={400} 
                intensity={1.2}
                radius={0.4}
              />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>

      {/* Overlay */}
      <HeroOverlay />
    </section>
  );
};

