import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import clsx from 'clsx';
import { memo } from 'react';

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

  const handleClick = (e) => {
    if (e.detail === 1) {
      onSelect(item.id, isSelected);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={itemStyle}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={clsx(
        "flex items-center gap-3 p-3 border-b border-gray-200",
        "hover:bg-gray-50 transition-colors duration-150",
        "bg-white cursor-pointer",
        isDragging && "opacity-50 shadow-lg",
        isSelected && "bg-green-100 border-green-300"
      )}
    >
      <div className="text-gray-400">
        <GripVertical className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">
          {item.label}
        </div>
        <div className="text-xs text-gray-500">
          ID: {item.id}
        </div>
      </div>

      {isSelected && (
        <div className="w-2 h-2 bg-green-500 rounded-full" />
      )}
    </div>
  );
});

ItemRow.displayName = 'ItemRow';

export default ItemRow; 