import { useCallback, useEffect, useRef, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import ItemRow from './ItemRow';

const DraggableList = ({
  items,
  selectedItems,
  onSelect,
  onReorder,
  onLoadMore,
  hasMore,
  isLoading,
  total,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
        delay: 150,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const selectedItemsSet = useMemo(() => new Set(selectedItems), [selectedItems]);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !hasMore || isLoading) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        onLoadMore();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading, onLoadMore]);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      onReorder({
        movedId: active.id,
        targetId: over.id
      });
    }
  }, [onReorder]);

  return (
    <div 
      ref={containerRef}
      className="border border-gray-200 rounded-lg overflow-hidden bg-white max-h-[600px] overflow-y-auto"
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => {
            const isSelected = selectedItemsSet.has(item.id);
            return (
              <ItemRow
                key={item.id}
                item={item}
                onSelect={onSelect}
                isSelected={isSelected}
              />
            );
          })}
        </SortableContext>
      </DndContext>
      
      {isLoading && hasMore && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-sm text-gray-600">Загрузка элементов...</span>
          </div>
        </div>
      )}
      
      {isLoading && items.length === 0 && (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <div className="text-gray-600">Загрузка элементов...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DraggableList; 