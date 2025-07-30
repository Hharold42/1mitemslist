import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import clsx from 'clsx';
import { memo } from 'react';

/**
 * Компонент строки элемента списка
 */
const ItemRow = memo(({ 
  item, 
  onSelect, 
  isSelected, 
  isDragging = false 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const itemStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={itemStyle}
      className={clsx(
        "flex items-center gap-3 p-3 border-b border-gray-200",
        "hover:bg-gray-50 transition-colors duration-150",
        "bg-white",
        isDragging && "opacity-50 shadow-lg",
        isSelected && "bg-blue-50 border-blue-200"
      )}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      {/* Checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelect(item.id, isSelected)}
        className={clsx(
          "h-4 w-4 rounded border-gray-300",
          "text-blue-600 focus:ring-blue-500",
          "cursor-pointer"
        )}
      />

      {/* Item content */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">
          {item.label}
        </div>
        <div className="text-xs text-gray-500">
          ID: {item.id}
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="w-2 h-2 bg-blue-500 rounded-full" />
      )}
    </div>
  );
});

ItemRow.displayName = 'ItemRow';

export default ItemRow; 