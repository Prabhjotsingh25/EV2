// Updated: src/contexts/AuthContext.tsx
// Reference (original): :contentReference[oaicite:1]{index=1}
import React, { createContext, useContext, useEffect, useState } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role: string
  ) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let subscription: { unsubscribe?: () => void } | null = null;

    // get current session (v2)
    (async () => {
      try {
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          // eslint-disable-next-line no-console
          console.error("getSession error:", error);
        }
        setSession(currentSession ?? null);
        setUser(currentSession?.user ?? null);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("getSession request failed:", err);
      } finally {
        setLoading(false);
      }
    })();

    // subscribe to auth state changes
    try {
      const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
        setSession(newSession ?? null);
        setUser(newSession?.user ?? null);
        setLoading(false);
      });
      subscription = data?.subscription ?? null;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("onAuthStateChange subscription failed:", err);
    }

    return () => {
      try {
        if (subscription && typeof subscription.unsubscribe === "function") {
          subscription.unsubscribe();
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("Error unsubscribing auth listener:", e);
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (!error) {
        navigate("/");
      }
      return { error };
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("signIn failed:", err);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: string
  ) => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            role,
          },
        },
      });
      // Note: do not navigate away automatically; wait for email confirm or onAuthStateChange
      return { error };
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("signUp failed:", err);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        // eslint-disable-next-line no-console
        console.error("signOut error:", error);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("signOut failed:", err);
    } finally {
      setLoading(false);
      navigate("/auth");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, session, loading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};
