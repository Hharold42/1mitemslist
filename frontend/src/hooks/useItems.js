import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getItems, reorderItems, selectItems, getState } from '../services/api';
import { useActionHistory } from './useActionHistory';

export const useItems = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState([]);
  const [localSelectedItems, setLocalSelectedItems] = useState(new Set());
  const [lastKnownState, setLastKnownState] = useState(null);
  const queryClient = useQueryClient();

  const {
    history,
    isProcessing,
    setIsProcessing,
    addAction,
    updateActionStatus,
    getLastPendingAction,
    clearHistory
  } = useActionHistory();

  const {
    data: itemsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['items', page, searchQuery],
    queryFn: () => getItems({ page, limit: 20, search: searchQuery }),
    keepPreviousData: true,
  });

  const { data: stateData } = useQuery({
    queryKey: ['state'],
    queryFn: getState,
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (stateData?.selectedItems) {
      setLocalSelectedItems(new Set(stateData.selectedItems));
    }
  }, [stateData?.selectedItems]);

  useEffect(() => {
    if (itemsData?.items) {
      if (page === 1) {
        setAllItems(itemsData.items);
      } else {
        setAllItems(prev => {
          const existingIds = new Set(prev.map(item => item.id));
          const newItems = itemsData.items.filter(item => !existingIds.has(item.id));
          return [...prev, ...newItems];
        });
      }
    }
  }, [itemsData?.items, page]);

  const selectMutation = useMutation({
    mutationFn: selectItems,
    onSuccess: () => {
      queryClient.invalidateQueries(['state']);
    },
  });

  const reorderMutation = useMutation({
    mutationFn: reorderItems,
    onSuccess: () => {
      queryClient.invalidateQueries(['items']);
    },
  });

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const loadMore = useCallback(() => {
    if (itemsData?.hasMore) {
      setPage(page + 1);
    }
  }, [itemsData?.hasMore, page]);

  const handleReorder = useCallback((dragInfo) => {
    if (isProcessing) {
      console.log('Action in progress, ignoring new reorder request');
      return;
    }

    const { movedId, targetId } = dragInfo;

    setLastKnownState([...allItems]);

    const actionId = addAction({
      type: 'reorder',
      movedId,
      targetId,
      searchQuery
    });

    const newItems = [...allItems];
    const movedIndex = newItems.findIndex(item => item.id === movedId);
    const targetIndex = newItems.findIndex(item => item.id === targetId);

    if (movedIndex !== -1 && targetIndex !== -1) {
      const [movedItem] = newItems.splice(movedIndex, 1);
      const insertIndex = targetIndex > movedIndex ? targetIndex : targetIndex;
      newItems.splice(insertIndex, 0, movedItem);
      setAllItems(newItems);
    }

    reorderMutation.mutate({
      movedId,
      targetId,
      searchQuery,
      actionId
    });
  }, [reorderMutation, searchQuery, allItems, isProcessing, addAction]);

  const handleSelect = useCallback((itemIds, action) => {
    selectMutation.mutate({ itemIds, action });
  }, [selectMutation]);

  const handleSelectItem = useCallback((itemId, isSelected) => {
    const action = isSelected ? 'deselect' : 'select';
    
    setLocalSelectedItems(prev => {
      const newSet = new Set(prev);
      if (action === 'select') {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      return newSet;
    });
    
    selectMutation.mutate({ itemIds: [itemId], action });
  }, [selectMutation]);

  const handleSelectAll = useCallback((selectAll) => {
    if (!itemsData?.items) return;

    const itemIds = itemsData.items.map(item => item.id);
    const action = selectAll ? 'select' : 'deselect';
    
    setLocalSelectedItems(prev => {
      const newSet = new Set(prev);
      if (action === 'select') {
        itemIds.forEach(id => newSet.add(id));
      } else {
        itemIds.forEach(id => newSet.delete(id));
      }
      return newSet;
    });
    
    selectMutation.mutate({ itemIds, action });
  }, [itemsData?.items, selectMutation]);

  return {
    items: allItems,
    total: itemsData?.total || 0,
    hasMore: itemsData?.hasMore || false,
    selectedItems: Array.from(localSelectedItems),
    isLoading,
    error,
    searchQuery,
    page,
    handleSearch,
    loadMore,
    handleReorder,
    handleSelect,
    handleSelectItem,
    handleSelectAll,
    refetch,
    reorderMutation,
    selectMutation,
    history,
    isProcessing,
    clearHistory
  };
}; 