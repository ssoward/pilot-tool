import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AIProvider } from './contexts/AIContext';
import AppRouter from './router';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AIProvider>
        <AppRouter />
      </AIProvider>
    </QueryClientProvider>
  )
}

export default App
