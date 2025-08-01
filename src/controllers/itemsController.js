const logger = require('../utils/logger');
const getRequestInfo = require('../middleware/requestInfo');

const items = new Map();
const selectedItems = new Set();
let sortOrder = [];
let sortOrderMap = new Map();
let searchIndex = new Map();

const updateSortOrderFromArray = (newOrder) => {
  sortOrder = newOrder;
  sortOrderMap.clear();
  sortOrder.forEach((id, index) => {
    sortOrderMap.set(id, index);
  });
};

const buildSearchIndex = () => {
  for (let i = 1; i <= 1000000; i++) {
    const digits = i.toString();
    for (let j = 0; j < digits.length; j++) {
      for (let k = j + 1; k <= digits.length; k++) {
        const substring = digits.substring(j, k);
        if (!searchIndex.has(substring)) {
          searchIndex.set(substring, new Set());
        }
        searchIndex.get(substring).add(i);
      }
    }
  }
};

const initializeItems = () => {
  for (let i = 1; i <= 1000000; i++) {
    items.set(i, {
      id: i,
      value: i,
      label: `Item #${i}`
    });
  }
  sortOrder = Array.from({ length: 1000000 }, (_, i) => i + 1);
  updateSortOrderFromArray(sortOrder);
  buildSearchIndex();
};

const getItems = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search || '';

  const requestInfo = getRequestInfo(req);

  try {
    const result = await logger.measurePerformance('getItems', async () => {
      let filteredItems = [];

      if (search) {
        const searchNum = parseInt(search);
        if (!isNaN(searchNum)) {
          const searchStr = searchNum.toString();
                  if (searchIndex.has(searchStr)) {
          const searchSet = searchIndex.get(searchStr);
          filteredItems = sortOrder.filter(id => searchSet.has(id));
        }
        } else if (search.toLowerCase().includes('item')) {
          const match = search.match(/item\s*#?\s*(\d+)/i);
          if (match) {
            const num = parseInt(match[1]);
            if (num >= 1 && num <= 1000000) {
              filteredItems = [num];
            }
          }
        }
      } else {
        filteredItems = sortOrder;
      }

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedItems = filteredItems.slice(startIndex, endIndex);

      const result = paginatedItems.map(id => ({
        ...items.get(id),
        selected: selectedItems.has(id)
      }));

      const hasMore = endIndex < filteredItems.length;

      return {
        items: result,
        total: filteredItems.length,
        page,
        limit,
        hasMore,
        searchQuery: search
      };
    }, { page, limit, search, ...requestInfo });

    logger.logAction('getItems', { 
      page, 
      limit, 
      search, 
      totalItems: result.total,
      hasMore: result.hasMore,
      ...requestInfo 
    });

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const reorderItems = async (req, res) => {
  const { movedId, targetId, searchQuery: search } = req.body;
  const requestInfo = getRequestInfo(req);

  try {
    const result = await logger.measurePerformance('reorderItems', async () => {

      const movedIdNum = parseInt(movedId);
      const targetIdNum = parseInt(targetId);

      if (!items.has(movedIdNum) || !items.has(targetIdNum)) {
        throw new Error('Invalid item IDs');
      }

      const movedPos = sortOrderMap.get(movedIdNum);
      const targetPos = sortOrderMap.get(targetIdNum);

      if (movedPos === undefined || targetPos === undefined) {
        throw new Error('Items not found in sort order');
      }

      const newSortOrder = [...sortOrder];

      newSortOrder.splice(movedPos, 1);

      const insertPos = targetPos;
      newSortOrder.splice(insertPos, 0, movedIdNum);

      updateSortOrderFromArray(newSortOrder);

      return {
        status: 'ok',
        message: 'Item moved successfully',
        movedId: movedIdNum,
        targetId: targetIdNum
      };
    }, { movedId, targetId, search, ...requestInfo });

    logger.logAction('reorderItems', { 
      movedId, 
      targetId, 
      search,
      ...requestInfo 
    });

    res.json(result);

  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      error: 'Internal server error',
      message: error.message || 'Failed to reorder item'
    });
  }
};

const selectItems = async (req, res) => {
  const { itemIds, action } = req.body;
  const requestInfo = getRequestInfo(req);

  try {
    const result = await logger.measurePerformance('selectItems', async () => {
      if (!Array.isArray(itemIds)) {
        throw new Error('itemIds must be an array');
      }

      if (!['select', 'deselect'].includes(action)) {
        throw new Error('action must be "select" or "deselect"');
      }

      const validIds = itemIds.filter(id => items.has(id));

      if (action === 'select') {
        validIds.forEach(id => selectedItems.add(id));
      } else {
        validIds.forEach(id => selectedItems.delete(id));
      }

      return {
        status: 'ok',
        message: `Items ${action}ed successfully`,
        selectedCount: selectedItems.size,
        affectedIds: validIds
      };
    }, { itemIds, action, ...requestInfo });

    logger.logAction('selectItems', { 
      itemIds, 
      action, 
      selectedCount: result.selectedCount,
      affectedCount: result.affectedIds.length,
      ...requestInfo 
    });

    res.json(result);

  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      error: 'Internal server error',
      message: error.message || 'Failed to select items'
    });
  }
};

const getState = async (req, res) => {
  const requestInfo = getRequestInfo(req);

  try {
    const result = await logger.measurePerformance('getState', async () => {
      const selectedItemsArray = Array.from(selectedItems);
      const sortOrderArray = [...sortOrder];

      return {
        selectedItems: selectedItemsArray,
        sortOrder: sortOrderArray,
        totalItems: items.size
      };
    }, { ...requestInfo });

    logger.logAction('getState', { 
      selectedCount: result.selectedItems.length,
      totalItems: result.totalItems,
      ...requestInfo 
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

initializeItems();

module.exports = {
  getItems,
  reorderItems,
  selectItems,
  getState
}; 