import React from 'react';
import { 
  Server, 
  Code, 
  Smartphone, 
  Radio, 
  GraduationCap, 
  Cpu, 
  Briefcase 
} from 'lucide-react';

import { LucideIcon } from 'lucide-react';

export interface Chapter {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  tags: string[];
  icon: LucideIcon;
  focusAreas: string[];
  activities: string[];
}

export const chaptersData: Chapter[] = [
  {
    name: "Infrastructure Chapter",
    slug: "infrastructure",
    description: "Driving the foundation of Sri Lanka's digital connectivity and data center growth.",
    longDescription: "The Infrastructure Chapter of FITIS is dedicated to building and maintaining the robust digital backbone required for a thriving digital economy. We focus on enhancing connectivity, promoting data center investments, and ensuring sustainable infrastructure development across the nation.",
    tags: ["Cloud", "Data Centers", "Connectivity"],
    icon: Server,
    focusAreas: [
      "Broadband Expansion & Quality",
      "Data Center & Cloud Policy",
      "Cybersecurity Infrastructure",
      "Green Energy for ICT"
    ],
    activities: [
      "Quarterly Infrastructure Summits",
      "Policy Advocacy with Regulatory Bodies",
      "Technical Workshops on Cloud Migration",
      "Industry Standards Development"
    ]
  },
  {
    name: "Software Chapter",
    slug: "software",
    description: "Empowering the software development ecosystem and promoting local innovation.",
    longDescription: "The Software Chapter represents the vibrant community of software developers, SaaS providers, and tech innovators in Sri Lanka. Our mission is to foster a globally competitive software industry by promoting best practices, innovation, and international market access.",
    tags: ["SaaS", "DevOps", "AI/ML"],
    icon: Code,
    focusAreas: [
      "Local Software Product Development",
      "Export Market Expansion",
      "Emerging Technologies (AI, Blockchain)",
      "Intellectual Property Protection"
    ],
    activities: [
      "Software Excellence Awards",
      "Global Market Access Programs",
      "Hackathons & Innovation Challenges",
      "SaaS Founder Meetups"
    ]
  },
  {
    name: "Digital Services Chapter",
    slug: "digital-services",
    description: "Accelerating the adoption of digital platforms and e-commerce solutions.",
    longDescription: "The Digital Services Chapter is at the forefront of Sri Lanka's digital transformation, focusing on e-commerce, digital payments, and online service platforms. We work to create a seamless digital experience for businesses and consumers alike.",
    tags: ["E-commerce", "FinTech", "Digital Payments"],
    icon: Smartphone,
    focusAreas: [
      "E-commerce Growth & Trust",
      "Digital Payment Adoption",
      "Consumer Protection in Digital Space",
      "Logistics & Fulfillment Optimization"
    ],
    activities: [
      "Digital Services Expo",
      "FinTech Collaboration Forums",
      "E-commerce Best Practices Workshops",
      "Digital Literacy Campaigns"
    ]
  },
  {
    name: "Telecommunications Chapter",
    slug: "telecommunications",
    description: "Shaping policies and standards for advanced telecommunication networks.",
    longDescription: "The Telecommunications Chapter brings together major telcos and network providers to drive the next generation of connectivity in Sri Lanka. We focus on spectrum management, 5G deployment, and ensuring affordable, high-speed access for all.",
    tags: ["5G", "Broadband", "Spectrum"],
    icon: Radio,
    focusAreas: [
      "5G Roadmap & Deployment",
      "Spectrum Policy Advocacy",
      "Rural Connectivity Initiatives",
      "Network Security & Resilience"
    ],
    activities: [
      "Telco Leadership Roundtables",
      "Regulatory Compliance Workshops",
      "Connectivity Impact Assessments",
      "Public-Private Partnership Forums"
    ]
  },
  {
    name: "ICT Education & Training Chapter",
    slug: "education-training",
    description: "Bridging the skills gap by fostering world-class ICT education and professional development.",
    longDescription: "The ICT Education & Training Chapter is committed to developing a future-ready workforce for Sri Lanka's tech industry. We collaborate with educational institutions and industry partners to align curricula with market needs and promote lifelong learning.",
    tags: ["Skills", "Certifications", "STEM"],
    icon: GraduationCap,
    focusAreas: [
      "Curriculum Alignment with Industry",
      "Professional Certification Standards",
      "STEM Education Promotion",
      "Internship & Placement Programs"
    ],
    activities: [
      "ICT Education Summits",
      "Career Guidance Workshops",
      "Industry-Academia Partnerships",
      "Skill Gap Analysis Reports"
    ]
  },
  {
    name: "Hardware Chapter",
    slug: "hardware",
    description: "Representing the interests of hardware vendors, distributors, and manufacturers.",
    longDescription: "The Hardware Chapter supports the ecosystem of hardware vendors, distributors, and manufacturers in Sri Lanka. We focus on supply chain efficiency, device standards, and promoting the adoption of modern hardware technologies across all sectors.",
    tags: ["Devices", "IoT", "Supply Chain"],
    icon: Cpu,
    focusAreas: [
      "Hardware Import & Tax Policies",
      "IoT Device Standards",
      "E-waste Management",
      "Supply Chain Resilience"
    ],
    activities: [
      "Hardware Tech Expos",
      "Vendor Networking Events",
      "Policy Briefings on Trade Regulations",
      "IoT Innovation Showcases"
    ]
  },
  {
    name: "Professional Consultants Chapter",
    slug: "consultants",
    description: "A network of expert consultants driving strategic digital transformation projects.",
    longDescription: "The Professional Consultants Chapter provides a platform for ICT consultants and advisory firms to collaborate and drive high-impact digital transformation projects. We focus on maintaining high professional standards and promoting strategic ICT governance.",
    tags: ["Strategy", "Governance", "Advisory"],
    icon: Briefcase,
    focusAreas: [
      "Digital Strategy Frameworks",
      "ICT Governance & Compliance",
      "Project Management Excellence",
      "Change Management Strategies"
    ],
    activities: [
      "Consultant Certification Programs",
      "Strategic Advisory Forums",
      "Digital Transformation Case Studies",
      "Ethics & Standards Workshops"
    ]
  }
];
