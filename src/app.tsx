import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui';
import { queryClient } from '@/lib/query-client';
import { Home } from '@/pages/home';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
      <Toaster />
    </QueryClientProvider>
  );
}
