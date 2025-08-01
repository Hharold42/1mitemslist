import axios from 'axios';

const API_BASE_URL = '/api/items';

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Получение элементов с пагинацией и поиском
 * @param {Object} params - Параметры запроса
 * @param {number} params.page - Номер страницы
 * @param {number} params.limit - Количество элементов
 * @param {string} params.search - Поисковый запрос
 * @returns {Promise<ItemsResponse>}
 */
export const getItems = async ({ page = 1, limit = 20, search = '' } = {}) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page);
  if (limit) params.append('limit', limit);
  if (search) params.append('search', search);

  const response = await api.get(`/?${params.toString()}`);
  return response.data;
};

/**
 * Изменение порядка элементов
 * @param {ReorderRequest} data - Данные для изменения порядка
 * @returns {Promise<Object>}
 */
export const reorderItems = async (data) => {
  console.log(data);
  const response = await api.post('/reorder', data);
  return response.data;
};

/**
 * Выбор/отмена выбора элементов
 * @param {SelectRequest} data - Данные для выбора
 * @returns {Promise<Object>}
 */
export const selectItems = async (data) => {
  const response = await api.post('/select', data);
  return response.data;
};

/**
 * Получение текущего состояния
 * @returns {Promise<StateResponse>}
 */
export const getState = async () => {
  const response = await api.get('/state');
  return response.data;
};

export default api; 