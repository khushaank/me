import { trpc } from "@/providers/trpc";
import { useCallback, useMemo } from "react";

export type AuthUser = {
  id: number;
  username: string;
  name: string | null;
  role: string;
};

export function useAuth() {
  const utils = trpc.useUtils();

  const {
    data: user,
    isLoading,
  } = trpc.auth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  const logout = useCallback(
    () => logoutMutation.mutate(),
    [logoutMutation],
  );

  return useMemo(
    () => ({
      user: (user ?? null) as AuthUser | null,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
      isLoading: isLoading || logoutMutation.isPending,
      logout,
    }),
    [user, isLoading, logoutMutation.isPending, logout],
  );
}
