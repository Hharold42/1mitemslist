import { useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import ItemRow from './ItemRow';

const ITEM_HEIGHT = 60; // Высота одного элемента

/**
 * Компонент виртуального списка
 */
const VirtualList = ({
  items,
  selectedItems,
  onSelect,
  onLoadMore,
  hasMore,
  isLoading,
  itemCount,
}) => {
  // Рендер элемента списка
  const renderRow = useCallback(({ index, style }) => {
    const item = items[index];
    if (!item) {
      return (
        <div style={style} className="flex items-center justify-center p-3 bg-gray-50">
          <div className="text-gray-500">Загрузка...</div>
        </div>
      );
    }

    const isSelected = selectedItems.includes(item.id);

    return (
      <div key={item.id} style={style}>
        <ItemRow
          item={item}
          onSelect={onSelect}
          isSelected={isSelected}
        />
      </div>
    );
  }, [items, selectedItems, onSelect]);

  // Проверка, нужно ли загружать элемент
  const isItemLoaded = useCallback((index) => {
    return index < items.length;
  }, [items.length]);

  // Обработчик загрузки
  const loadMoreItems = useCallback((startIndex, stopIndex) => {
    if (hasMore && !isLoading) {
      onLoadMore();
    }
    return Promise.resolve();
  }, [hasMore, isLoading, onLoadMore]);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={itemCount}
        loadMoreItems={loadMoreItems}
      >
        {({ onItemsRendered, ref }) => (
          <List
            ref={ref}
            height={600}
            itemCount={itemCount}
            itemSize={ITEM_HEIGHT}
            onItemsRendered={onItemsRendered}
            className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            {renderRow}
          </List>
        )}
      </InfiniteLoader>
      
      {isLoading && (
        <div className="flex items-center justify-center p-4 bg-gray-50">
          <div className="text-gray-500">Загрузка...</div>
        </div>
      )}
    </div>
  );
};

export default VirtualList; 