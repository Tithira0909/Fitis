export const isAuthenticated = (): boolean => {
  return localStorage.getItem('adminAuthenticated') === 'true';
};

export const login = () => {
  localStorage.setItem('adminAuthenticated', 'true');
};

export const logout = () => {
  localStorage.removeItem('adminAuthenticated');
};
