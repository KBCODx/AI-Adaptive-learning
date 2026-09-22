import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AuthUser, LoginCredentials, SignUpData, UserProfile, DifficultyLevel, SubjectType } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  supabaseUser: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  loading: boolean; // Alias for requirement 12
  isAuthenticated: boolean;
  authError: string | null;
  isConfigured: boolean;
  signIn: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>; // Backwards compatible alias
  signUp: (data: SignUpData) => Promise<{ success: boolean; error?: string; requiresConfirmation?: boolean }>;
  signup: (data: SignUpData) => Promise<{ success: boolean; error?: string; requiresConfirmation?: boolean }>; // Backwards compatible alias
  signOut: () => Promise<void>;
  logout: () => Promise<void>; // Backwards compatible alias
  resetPassword: (email: string) => Promise<{ success: boolean; message: string; error?: string }>;
  clearError: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Fetch or construct profile from Supabase profiles table
  const fetchProfile = async (uid: string, currentUser?: User | null): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .maybeSingle();

      if (!error && data) {
        return data as UserProfile;
      }

      // If no row exists yet, fallback to user metadata provided at signup
      const meta = currentUser?.user_metadata || {};
      const fallbackProfile: UserProfile = {
        id: uid,
        full_name: meta.full_name || meta.name || currentUser?.email?.split('@')[0] || 'Student',
        learning_level: (meta.learning_level as DifficultyLevel) || 'Intermediate',
        preferred_subjects: (meta.preferred_subjects as SubjectType[]) || ['Mathematics', 'Science']
      };

      // Attempt to self-heal/insert profile row if missing
      try {
        await supabase.from('profiles').upsert(fallbackProfile);
      } catch (upsertErr) {
        // RLS might prevent or table might not have trigger yet
      }

      return fallbackProfile;
    } catch (err) {
      console.warn('Could not fetch user profile from Supabase:', err);
      return null;
    }
  };

  // Convert Supabase User & Profile into cohesive AuthUser for app consumption
  const syncUserState = (sbUser: User | null, userProf: UserProfile | null) => {
    if (!sbUser) {
      setUser(null);
      setProfile(null);
      return;
    }

    const resolvedProfile = userProf || {
      id: sbUser.id,
      full_name: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'Student',
      learning_level: (sbUser.user_metadata?.learning_level as DifficultyLevel) || 'Intermediate',
      preferred_subjects: (sbUser.user_metadata?.preferred_subjects as SubjectType[]) || ['Mathematics', 'Science']
    };

    setProfile(resolvedProfile);
    setUser({
      id: sbUser.id,
      email: sbUser.email || '',
      name: resolvedProfile.full_name,
      level: resolvedProfile.learning_level,
      preferredSubjects: resolvedProfile.preferred_subjects,
      grade: sbUser.user_metadata?.grade || '10th',
      preferredStyle: 'Simple',
      createdAt: sbUser.created_at
    });
  };

  // Initialize session and attach auth state listener
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // 1. Get initial session from Supabase built-in persistence
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();

        if (error) {
          console.warn('Supabase getSession error:', error.message);
        }

        if (mounted) {
          setSession(initialSession);
          setSupabaseUser(initialSession?.user ?? null);

          if (initialSession?.user) {
            const prof = await fetchProfile(initialSession.user.id, initialSession.user);
            if (mounted) syncUserState(initialSession.user, prof);
          } else {
            syncUserState(null, null);
          }
        }
      } catch (err) {
        console.error('Error initializing Supabase authentication:', err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // 2. Subscribe to Supabase auth state change events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;

        setSession(newSession);
        const newUser = newSession?.user ?? null;
        setSupabaseUser(newUser);

        if (newUser) {
          const prof = await fetchProfile(newUser.id, newUser);
          if (mounted) syncUserState(newUser, prof);
        } else {
          syncUserState(null, null);
        }

        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const clearError = () => setAuthError(null);

  const refreshProfile = async () => {
    if (supabaseUser) {
      const prof = await fetchProfile(supabaseUser.id, supabaseUser);
      syncUserState(supabaseUser, prof);
    }
  };

  // Sign In with Supabase Email & Password
  const signIn = async ({
    email,
    password
  }: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);

    if (!isSupabaseConfigured) {
      const configMsg = 'Supabase is not configured. Please add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.';
      setAuthError(configMsg);
      return { success: false, error: configMsg };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password
      });

      if (error) {
        let friendlyMsg = 'Invalid email or password. Please try again.';
        if (error.message.toLowerCase().includes('email not confirmed')) {
          friendlyMsg = 'Please verify your email address before logging in. Check your inbox.';
        } else if (error.message.toLowerCase().includes('rate limit')) {
          friendlyMsg = 'Too many failed login attempts. Please wait a few moments and try again.';
        }
        setAuthError(friendlyMsg);
        return { success: false, error: friendlyMsg };
      }

      if (data.user) {
        setSupabaseUser(data.user);
        setSession(data.session);
        const prof = await fetchProfile(data.user.id, data.user);
        syncUserState(data.user, prof);
      }

      return { success: true };
    } catch (err: any) {
      const genericMsg = err?.message || 'A network error occurred while signing in. Please check your connection.';
      setAuthError(genericMsg);
      return { success: false, error: genericMsg };
    }
  };

  // Sign Up with Supabase Email, Password & User Profile
  const signUp = async (
    data: SignUpData
  ): Promise<{ success: boolean; error?: string; requiresConfirmation?: boolean }> => {
    setAuthError(null);

    if (!isSupabaseConfigured) {
      const configMsg = 'Supabase is not configured. Please add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.';
      setAuthError(configMsg);
      return { success: false, error: configMsg };
    }

    try {
      const cleanEmail = data.email.trim().toLowerCase();
      const cleanName = data.name.trim();

      // Register new user with Supabase Auth including metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: data.password,
        options: {
          data: {
            full_name: cleanName,
            learning_level: data.level,
            preferred_subjects: data.preferredSubjects,
            grade: data.grade || '10th'
          }
        }
      });

      if (authError) {
        let friendlyMsg = authError.message;
        if (authError.message.toLowerCase().includes('already registered')) {
          friendlyMsg = 'An account with this email already exists. Please log in instead.';
        } else if (authError.message.toLowerCase().includes('weak password')) {
          friendlyMsg = 'Password is too weak. Please use at least 8 characters with a mix of letters and numbers.';
        }
        setAuthError(friendlyMsg);
        return { success: false, error: friendlyMsg };
      }

      // If user was created, insert/upsert into public.profiles table
      if (authData.user) {
        const newProfile: UserProfile = {
          id: authData.user.id,
          full_name: cleanName,
          learning_level: data.level,
          preferred_subjects: data.preferredSubjects
        };

        try {
          await supabase.from('profiles').upsert(newProfile);
        } catch (dbErr) {
          console.warn('Could not manually upsert profile (schema trigger will handle):', dbErr);
        }

        // Check if email confirmation is required by Supabase settings
        const requiresConfirmation = !authData.session;

        if (authData.session) {
          setSupabaseUser(authData.user);
          setSession(authData.session);
          syncUserState(authData.user, newProfile);
        }

        return { success: true, requiresConfirmation };
      }

      return { success: true };
    } catch (err: any) {
      const genericMsg = err?.message || 'Failed to create account. Please try again.';
      setAuthError(genericMsg);
      return { success: false, error: genericMsg };
    }
  };

  // Sign Out via Supabase
  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Error during Supabase signOut:', err);
    } finally {
      setSupabaseUser(null);
      setSession(null);
      setProfile(null);
      setUser(null);
      setAuthError(null);

      // Clear any history states to prevent navigating back into dashboard
      try {
        window.history.pushState(null, '', window.location.href);
      } catch (e) {}
    }
  };

  // Password Reset for Email via Supabase
  const resetPassword = async (
    email: string
  ): Promise<{ success: boolean; message: string; error?: string }> => {
    setAuthError(null);

    if (!isSupabaseConfigured) {
      const configMsg = 'Supabase is not configured. Please add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.';
      return { success: false, message: configMsg, error: configMsg };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: window.location.origin
      });

      if (error) {
        return {
          success: false,
          message: error.message || 'Unable to send password reset email. Please try again.',
          error: error.message
        };
      }

      return {
        success: true,
        message: 'If an account exists for this email, password reset instructions have been sent.'
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Failed to request password reset. Please try again.',
        error: err?.message
      };
    }
  };

  const isAuthenticated = Boolean(session && user);

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        session,
        profile,
        isLoading,
        loading: isLoading,
        isAuthenticated,
        authError,
        isConfigured: isSupabaseConfigured,
        signIn,
        login: signIn,
        signUp,
        signup: signUp,
        signOut,
        logout: signOut,
        resetPassword,
        clearError,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
