export const getImageUrl = (url: string | undefined | null, timestamp?: number) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const fullUrl = `${apiUrl}${url.startsWith('/') ? url : `/${url}`}`;
  return timestamp ? `${fullUrl}?t=${timestamp}` : fullUrl;
};
