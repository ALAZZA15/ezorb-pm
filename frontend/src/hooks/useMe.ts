import { useQuery } from "@tanstack/react-query";
import { ApiError, apiGet } from "@/lib/api";
import type { User } from "@/lib/types";

export const ME_KEY = ["me"] as const;

/** Current signed-in user, or null when signed out (401). */
export function useMe() {
  return useQuery({
    queryKey: ME_KEY,
    queryFn: async (): Promise<User | null> => {
      try {
        return await apiGet<User>("/auth/me");
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) return null;
        throw e;
      }
    },
    staleTime: 60_000,
    retry: false,
  });
}