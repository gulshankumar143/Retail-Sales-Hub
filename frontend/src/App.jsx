import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QueryProvider } from './context/QueryContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes/AppRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <QueryProvider>
          <AppRoutes />
        </QueryProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
