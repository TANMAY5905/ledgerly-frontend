import api from './axios';

export const loginAPI = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

export const registerAPI = async (username, name, email, password) => {
  const response = await api.post('/auth/register', { username, name, email, password });
  return response.data;
};

export const forgotPasswordAPI = async (email) => {
  const response = await api.post('/auth/forgot-password', null, { params: { email } });
  return response.data;
};

export const resetPasswordAPI = async (token, newPassword) => {
  const response = await api.post('/auth/reset-password', null, { params: { token, newPassword } });
  return response.data;
};

export const getMeAPI = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
