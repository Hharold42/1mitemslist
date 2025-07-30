import { useState, useCallback } from 'react';

export const useActionHistory = () => {
  const [history, setHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addAction = useCallback((action) => {
    const actionWithId = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      status: 'pending', // pending, success, error
      ...action
    };

    setHistory(prev => [...prev, actionWithId]);
    return actionWithId.id;
  }, []);

  const updateActionStatus = useCallback((actionId, status, error = null) => {
    setHistory(prev => prev.map(action => 
      action.id === actionId 
        ? { ...action, status, error, completedAt: new Date().toISOString() }
        : action
    ));
  }, []);

  const getLastPendingAction = useCallback(() => {
    return history.find(action => action.status === 'pending');
  }, [history]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const getHistory = useCallback(() => {
    return history;
  }, [history]);

  return {
    history,
    isProcessing,
    setIsProcessing,
    addAction,
    updateActionStatus,
    getLastPendingAction,
    clearHistory,
    getHistory
  };
}; 