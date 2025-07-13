import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: () => api.getUser().then(res => {
      if (!res.ok) {
        throw new Error('Not authenticated');
      }
      return res.json();
    }),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    error,
  };
}
