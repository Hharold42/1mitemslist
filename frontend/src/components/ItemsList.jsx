import { useCallback, useState } from 'react';
import SearchBar from './SearchBar';
import ControlPanel from './ControlPanel';
import DraggableList from './DraggableList';
import LogsViewer from './LogsViewer';
import { useItems } from '../hooks/useItems';
import { Settings, BarChart3 } from 'lucide-react';

const ItemsList = () => {
  const [showLogs, setShowLogs] = useState(false);

  const {
    items,
    total,
    hasMore,
    selectedItems,
    isLoading,
    error,
    searchQuery,
    handleSearch,
    loadMore,
    handleReorder,
    handleSelectItem,
    handleSelectAll,
    refetch,
  } = useItems();

  const handleSelectAllItems = useCallback(() => {
    handleSelectAll(true);
  }, [handleSelectAll]);

  const handleDeselectAllItems = useCallback(() => {
    handleSelectAll(false);
  }, [handleSelectAll]);

  const handleItemSelect = useCallback((itemId, isSelected) => {
    handleSelectItem(itemId, isSelected);
  }, [handleSelectItem]);

  const handleItemsReorder = useCallback((itemIds) => {
    handleReorder(itemIds);
  }, [handleReorder]);

  const handleLoadMore = useCallback(() => {
    loadMore();
  }, [loadMore]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">
            Ошибка загрузки данных
          </div>
          <div className="text-gray-600 mb-4">
            {error.message || 'Произошла ошибка при загрузке элементов'}
          </div>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (showLogs) {
    return <LogsViewer />;
  }

  return (
    <div className="min-h-screen bg-gray-50 mx-12 px-8">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Список элементов
            </h1>
            <p className="text-gray-600">
              Управление списком из 1 000 000 элементов с поиском, сортировкой и выбором
            </p>
          </div>
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            {showLogs ? 'Скрыть логи' : 'Показать логи'}
          </button>
        </div>

        <div className="mb-6">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Поиск по номеру элемента (например: 123 или Item #456)..."
          />
        </div>

        <ControlPanel
          total={total}
          selectedCount={selectedItems.length}
          onSelectAll={handleSelectAllItems}
          onDeselectAll={handleDeselectAllItems}
          onRefresh={refetch}
          isLoading={isLoading}
        />

        <div className="mt-4">
          <DraggableList
              items={items}
              selectedItems={selectedItems}
              onSelect={handleItemSelect}
              onReorder={handleItemsReorder}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              isLoading={isLoading}
              total={total}
            />
        </div>

        {searchQuery && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="text-sm text-blue-800">
              Поиск: <span className="font-medium">"{searchQuery}"</span>
              {items.length > 0 && (
                <span className="ml-2">
                  Найдено: <span className="font-medium">{items.length}</span> элементов
                </span>
              )}
            </div>
          </div>
        )}

        {isLoading && items.length === 0 && (
          <div className="mt-4 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <div className="text-gray-600">Загрузка элементов...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemsList; 