import api from './axios';

export const createTag = async (name, description = '') => {
  const response = await api.post('/tags/create', { name, description });
  return response.data;
};

export const getAllTags = async () => {
  const response = await api.get('/tags/all');
  return response.data;
};
