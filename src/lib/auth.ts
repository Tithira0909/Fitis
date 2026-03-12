export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('adminToken');
};

export const login = (token: string) => {
  localStorage.setItem('adminToken', token);
};

export const logout = () => {
  localStorage.removeItem('adminToken');
};
