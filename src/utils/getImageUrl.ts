export const getImageUrl = (url?: string | null): string => {
  if (!url) return ''; // We can let the onError handle it or provide a default string

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  if (url.startsWith('/uploads')) {
    return `${baseUrl}${url}`;
  }

  // Handle bare filenames (assuming they are in root or just missing the slash)
  // But if it's some other relative path, prefix it with a slash just in case
  if (!url.startsWith('/')) {
    return `${baseUrl}/${url}`;
  }

  return `${baseUrl}${url}`;
};
