const express = require('express');
const router = express.Router();
const {
  getItems,
  reorderItems,
  selectItems,
  getState
} = require('../controllers/itemsController');
const {
  validatePagination,
  validateReorder,
  validateSelect
} = require('../middleware/validation');

// GET /api/items - Получение элементов с пагинацией и поиском
router.get('/', validatePagination, getItems);

// POST /api/items/reorder - Изменение порядка элементов
router.post('/reorder', validateReorder, reorderItems);

// POST /api/items/select - Выбор/отмена выбора элементов
router.post('/select', validateSelect, selectItems);

// GET /api/items/state - Получение текущего состояния
router.get('/state', getState);

module.exports = router; 