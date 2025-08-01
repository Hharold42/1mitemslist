import { useState, useEffect } from 'react';
import { BarChart3, Activity, Clock, Users } from 'lucide-react';

const LogsViewer = () => {
  const [activeTab, setActiveTab] = useState('actions');
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const fetchLogs = async (type = 'actions') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        start: dateRange.start,
        end: dateRange.end,
        limit: '100'
      });
      
      const response = await fetch(`/api/logs/${type}?${params}`);
      const data = await response.json();
      setLogs(data.logs);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const params = new URLSearchParams({
        start: dateRange.start,
        end: dateRange.end
      });
      
      const response = await fetch(`/api/logs/stats?${params}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    fetchLogs(activeTab);
    fetchStats();
  }, [activeTab, dateRange]);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('ru-RU');
  };

  const formatDuration = (duration) => {
    const ms = parseInt(duration);
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getActionColor = (action) => {
    const colors = {
      getItems: 'text-blue-600',
      reorderItems: 'text-green-600',
      selectItems: 'text-purple-600',
      getState: 'text-orange-600'
    };
    return colors[action] || 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Просмотр логов
          </h1>
          <p className="text-gray-600">
            Мониторинг действий пользователей и производительности системы
          </p>
        </div>

        {/* Фильтры по дате */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">С:</span>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">По:</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              />
            </label>
          </div>
        </div>

        {/* Статистика */}
        {stats && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Всего действий</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-2">
                {stats.totalActions}
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Запросов</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-2">
                {stats.totalPerformanceLogs}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">Среднее время</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-2">
                {stats.performanceStats.getItems ? 
                  formatDuration(stats.performanceStats.getItems.avgDuration) : 
                  'N/A'
                }
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-gray-600">Уникальных IP</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-2">
                {new Set(logs.map(log => log.details?.ip).filter(Boolean)).size}
              </div>
            </div>
          </div>
        )}

        {/* Табы */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('actions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'actions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Действия пользователей
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'performance'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Производительность
              </button>
            </nav>
          </div>
        </div>

        {/* Логи */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <div className="text-gray-600">Загрузка логов...</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Время
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {activeTab === 'actions' ? 'Действие' : 'Операция'}
                    </th>
                    {activeTab === 'performance' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Время выполнения
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Детали
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP адрес
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTimestamp(log.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getActionColor(log.action || log.operation)}`}>
                          {log.action || log.operation}
                        </span>
                      </td>
                      {activeTab === 'performance' && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            parseInt(log.duration) < 100 ? 'bg-green-100 text-green-800' :
                            parseInt(log.duration) < 500 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {formatDuration(log.duration)}
                          </span>
                        </td>
                      )}
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs truncate">
                          {activeTab === 'actions' ? (
                            <div>
                              {log.details.page && <div>Страница: {log.details.page}</div>}
                              {log.details.search && <div>Поиск: "{log.details.search}"</div>}
                              {log.details.movedId && <div>Перемещение: {log.details.movedId} → {log.details.targetId}</div>}
                              {log.details.itemIds && <div>Элементы: {log.details.itemIds.length} шт.</div>}
                            </div>
                          ) : (
                            <div>
                              {log.details.success !== undefined && (
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  log.details.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {log.details.success ? 'Успешно' : 'Ошибка'}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.details?.ip || log.ip || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {!loading && logs.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Логи не найдены для выбранного периода
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogsViewer; 