export const getImageUrl = (url: string | undefined | null) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${apiUrl}${url.startsWith('/') ? url : `/${url}`}`;
};
