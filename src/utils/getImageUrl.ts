export const getImageUrl = (url?: string | null): string => {
  if (!url) return ''; // We can let the onError handle it or provide a default string

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  if (url.startsWith('/uploads')) {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${baseUrl}${url}`;
  }

  return url;
};
