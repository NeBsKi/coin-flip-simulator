import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/api/mockApi';
import { queryKeys } from '@/lib/queryClient';
import type { User } from '@/api/types';

export function useUser() {
  return useQuery<User>({
    queryKey: queryKeys.user,
    queryFn: getUser,
  });
}
