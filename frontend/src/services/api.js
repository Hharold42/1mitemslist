import axios from 'axios';

const API_BASE_URL = '/api/items';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getItems = async ({ page = 1, limit = 20, search = '' } = {}) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page);
  if (limit) params.append('limit', limit);
  if (search) params.append('search', search);

  const response = await api.get(`/?${params.toString()}`);
  return response.data;
};

export const reorderItems = async (data) => {
  console.log(data);
  const response = await api.post('/reorder', data);
  return response.data;
};

export const selectItems = async (data) => {
  const response = await api.post('/select', data);
  return response.data;
};

export const getState = async () => {
  const response = await api.get('/state');
  return response.data;
};

export default api; 