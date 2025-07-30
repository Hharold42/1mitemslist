import { CheckSquare, Square, RotateCcw } from 'lucide-react';
import clsx from 'clsx';

/**
 * Компонент панели управления
 */
const ControlPanel = ({
  total,
  selectedCount,
  onSelectAll,
  onDeselectAll,
  onRefresh,
  isLoading,
}) => {
  const allSelected = selectedCount > 0 && selectedCount === total;
  const someSelected = selectedCount > 0 && selectedCount < total;

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
      {/* Левая часть - статистика и кнопки выбора */}
      <div className="flex items-center gap-4">
        {/* Статистика */}
        <div className="text-sm text-gray-600">
          Выбрано: <span className="font-medium text-blue-600">{selectedCount}</span> из{' '}
          <span className="font-medium">{total.toLocaleString()}</span>
        </div>

        {/* Кнопки выбора */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSelectAll}
            disabled={allSelected || isLoading}
            className={clsx(
              "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md",
              "transition-colors duration-150",
              allSelected || isLoading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
            )}
          >
            <CheckSquare className="h-4 w-4" />
            Выбрать все
          </button>

          <button
            onClick={onDeselectAll}
            disabled={selectedCount === 0 || isLoading}
            className={clsx(
              "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md",
              "transition-colors duration-150",
              selectedCount === 0 || isLoading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-red-50 text-red-700 hover:bg-red-100"
            )}
          >
            <Square className="h-4 w-4" />
            Снять выбор
          </button>
        </div>
      </div>

      {/* Правая часть - кнопка обновления */}
      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className={clsx(
            "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md",
            "transition-colors duration-150",
            isLoading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          <RotateCcw className={clsx("h-4 w-4", isLoading && "animate-spin")} />
          Обновить
        </button>
      </div>
    </div>
  );
};

export default ControlPanel; 