import { QueryProvider } from './providers/QueryProvider';
import { AIProvider } from './contexts/AIContext';
import { NotificationProvider, NotificationContainer } from './contexts/NotificationContext';
import { PerformanceMonitor } from './components/PerformanceMonitor';
import AppRouter from './router';

function App() {
  return (
    <QueryProvider>
      <NotificationProvider>
        <AIProvider>
          <AppRouter />
          <NotificationContainer />
          <PerformanceMonitor />
        </AIProvider>
      </NotificationProvider>
    </QueryProvider>
  )
}

export default App
