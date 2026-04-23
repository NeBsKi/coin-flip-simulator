import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui';
import { queryClient } from '@/lib/queryClient';
import { Home } from '@/pages/Home';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
      <Toaster />
    </QueryClientProvider>
  );
}
