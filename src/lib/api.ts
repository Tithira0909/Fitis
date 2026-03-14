export const fetchApi = async (url: string, options: RequestInit = {}) => {
  if (url.includes('undefined')) {
    console.error(`Attempted to fetch invalid URL: ${url}`);
    throw new Error('Missing table name or invalid API endpoint');
  }

  const token = localStorage.getItem('adminToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const response = await fetch(`${baseUrl}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      // Token might be expired or invalid
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${response.status}`);
  }

  // Handle empty responses (like from DELETE)
  if (response.status === 204 || response.headers.get('content-length') === '0') {
      return null;
  }

  return response.json();
};
