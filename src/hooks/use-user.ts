import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/api/mock-api';
import { queryKeys } from '@/lib/query-client';
import type { User } from '@/api/types';

export function useUser() {
  return useQuery<User, Error>({
    queryKey: queryKeys.user,
    queryFn: getUser,
  });
}
