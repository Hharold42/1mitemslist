import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ItemsList from './components/ItemsList';

// Создаем экземпляр QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 минут
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ItemsList />
    </QueryClientProvider>
  );
}

export default App;
