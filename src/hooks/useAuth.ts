import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export type AuthUser = {
  id: string;
  email: string;
  username: string;
  name: string | null;
  role: string;
  avatarUrl: string | null;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const authUser = useMemo(() => {
    if (!user) return null;
    return {
      id: user.id,
      email: user.email || "",
      username: user.email?.split('@')[0] || "user",
      name: user.user_metadata?.name || user.user_metadata?.full_name || user.email,
      role: user.app_metadata?.role || "user",
      avatarUrl: user.user_metadata?.avatar_url || null,
    } as AuthUser;
  }, [user]);

  return useMemo(
    () => ({
      user: authUser,
      isAuthenticated: !!user,
      isAdmin: authUser?.role === "admin" || user?.email === "khushaankgupta@gmail.com", // Fallback admin check
      isLoading,
      logout,
    }),
    [authUser, user, isLoading, logout],
  );
}

