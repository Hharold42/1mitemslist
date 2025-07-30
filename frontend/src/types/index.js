/**
 * @typedef {Object} Item
 * @property {number} id - ID элемента
 * @property {number} value - Значение элемента
 * @property {string} label - Отображаемое название
 * @property {boolean} selected - Выбран ли элемент
 */

/**
 * @typedef {Object} ItemsResponse
 * @property {Item[]} items - Массив элементов
 * @property {number} total - Общее количество элементов
 * @property {number} page - Текущая страница
 * @property {number} limit - Количество элементов на странице
 * @property {boolean} hasMore - Есть ли еще элементы
 * @property {string} searchQuery - Поисковый запрос
 */

/**
 * @typedef {Object} StateResponse
 * @property {number[]} selectedItems - Массив выбранных ID
 * @property {number[]} sortOrder - Порядок сортировки
 * @property {string} searchQuery - Поисковый запрос
 * @property {number} totalItems - Общее количество элементов
 */

/**
 * @typedef {Object} ReorderRequest
 * @property {number[]} itemIds - Новый порядок ID элементов
 */

/**
 * @typedef {Object} SelectRequest
 * @property {number[]} itemIds - ID элементов для выбора/отмены
 * @property {'select' | 'deselect'} action - Действие
 */ 