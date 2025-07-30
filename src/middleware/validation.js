// Валидация параметров пагинации
const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  if (page && (page < 1 || isNaN(page))) {
    return res.status(400).json({ error: 'Page must be a positive integer' });
  }

  if (limit && (limit < 1 || limit > 100 || isNaN(limit))) {
    return res.status(400).json({ error: 'Limit must be between 1 and 100' });
  }

  next();
};

// Валидация тела запроса для reorder
const validateReorder = (req, res, next) => {
  console.log(req.body);

  const { movedId, targetId } = req.body;

  if (!movedId || !targetId) {
    return res.status(400).json({ error: 'movedId and targetId are required' });
  }

  const movedIdNum = parseInt(movedId);
  const targetIdNum = parseInt(targetId);

  if (isNaN(movedIdNum) || isNaN(targetIdNum)) {
    return res.status(400).json({ error: 'movedId and targetId must be valid numbers' });
  }

  if (movedIdNum < 1 || movedIdNum > 1000000 || targetIdNum < 0 || targetIdNum > 1000000) {
    return res.status(400).json({ error: 'movedId must be between 1 and 1000000, targetId must be between 0 and 1000000' });
  }

  next();
};

// Валидация тела запроса для select
const validateSelect = (req, res, next) => {
  const { itemIds, action } = req.body;

  if (!itemIds) {
    return res.status(400).json({ error: 'itemIds is required' });
  }

  if (!Array.isArray(itemIds)) {
    return res.status(400).json({ error: 'itemIds must be an array' });
  }

  if (!action || !['select', 'deselect'].includes(action)) {
    return res.status(400).json({ error: 'action must be "select" or "deselect"' });
  }

  if (itemIds.some(id => !Number.isInteger(id) || id < 1 || id > 1000000)) {
    return res.status(400).json({ error: 'All itemIds must be integers between 1 and 1000000' });
  }

  next();
};

module.exports = {
  validatePagination,
  validateReorder,
  validateSelect
}; 