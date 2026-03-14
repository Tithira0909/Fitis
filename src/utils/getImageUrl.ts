export const getImageUrl = (url?: string | null, cacheBuster?: string | number): string => {
  if (!url) return ''; // We can let the onError handle it or provide a default string

  let finalUrl = url;

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    // Ensure relative paths always have a leading slash
    const formattedUrl = url.startsWith('/') ? url : `/${url}`;
    finalUrl = `${baseUrl}${formattedUrl}`;
  }

  if (cacheBuster) {
    const separator = finalUrl.includes('?') ? '&' : '?';
    return `${finalUrl}${separator}v=${cacheBuster}`;
  }

  return finalUrl;
};
