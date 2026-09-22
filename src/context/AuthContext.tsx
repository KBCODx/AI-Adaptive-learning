import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, LoginCredentials, SignUpData, SubjectType, DifficultyLevel } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignUpData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  clearError: () => void;
  demoCredentials: { email: string; password: string };
  resendVerificationEmail: () => Promise<{ success: boolean; error?: string }>;
  pendingVerificationEmail: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_STORAGE_KEY = 'gurumitra_auth_session';
const REGISTERED_USERS_KEY = 'gurumitra_registered_users';

const DEMO_USER: AuthUser = {
  id: 'user-demo-khushi',
  name: 'Khushi Dixit',
  email: 'demo@student.com',
  grade: '10th',
  level: 'Intermediate',
  preferredSubjects: ['Mathematics', 'Science', 'English', 'Computer Science', 'Social Science'],
  preferredStyle: 'Simple',
  isDemo: true,
  emailVerified: true,
  createdAt: new Date().toISOString()
};

const DEMO_PASSWORD = 'Demo@123';

interface StoredAccount {
  user: AuthUser;
  passwordHash: string;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);

  // Initialize stored accounts and active session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // 1. Seed demo user into registered users if not present (for fallback local storage)
        const storedUsersRaw = localStorage.getItem(REGISTERED_USERS_KEY);
        let registeredUsers: StoredAccount[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

        const demoExists = registeredUsers.some(
          (acc) => acc.user.email.toLowerCase() === DEMO_USER.email.toLowerCase()
        );

        if (!demoExists) {
          registeredUsers.push({
            user: DEMO_USER,
            passwordHash: DEMO_PASSWORD
          });
          localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers));
        }

        // 2. Check for active session in localStorage or sessionStorage
        const savedSessionRaw =
          localStorage.getItem(SESSION_STORAGE_KEY) ||
          sessionStorage.getItem(SESSION_STORAGE_KEY);

        if (savedSessionRaw) {
          const parsedSession: AuthUser = JSON.parse(savedSessionRaw);
          if (parsedSession && parsedSession.id && parsedSession.email) {
            setUser(parsedSession);
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        console.error('Failed to restore authentication session:', err);
        localStorage.removeItem(SESSION_STORAGE_KEY);
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const clearError = () => setAuthError(null);

  const login = async ({
    email,
    password,
    rememberMe = true
  }: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    setIsLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      // Demo login bypass
      if (cleanEmail === DEMO_USER.email.toLowerCase() && cleanPassword === DEMO_PASSWORD) {
        setUser(DEMO_USER);
        setIsAuthenticated(true);
        setIsLoading(false);
        // Persist demo session
        if (rememberMe) {
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(DEMO_USER));
        } else {
          sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(DEMO_USER));
          localStorage.removeItem(SESSION_STORAGE_KEY);
        }
        return { success: true };
      }

      // Supabase login (if configured)
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword
        });

        if (error) throw error;

        const sessionUser = data.user;
        if (!sessionUser) throw new Error('No user returned');

        // Guard against undefined email (should not happen after successful signIn)
        const userEmail = sessionUser.email ?? '';
        if (!userEmail) {
          throw new Error('User email is missing');
        }

        // Check if email is verified
        if (!sessionUser.email_confirmed_at) {
          setAuthError('Please verify your email before logging in. Check your inbox for the verification link.');
          setIsLoading(false);
          return { success: false, error: 'Email not verified' };
        }

        // Fetch user metadata from auth.user.user_metadata (set during signup)
        const metadata = sessionUser.user_metadata || {};
        const authUser: AuthUser = {
          id: sessionUser.id,
          name: metadata.name || userEmail.split('@')[0],
          email: userEmail,
          grade: metadata.grade || '10th',
          level: (metadata.level as DifficultyLevel) || 'Intermediate',
          preferredSubjects: metadata.preferredSubjects
            ? (metadata.preferredSubjects as SubjectType[])
            : ['Mathematics', 'Science'],
          preferredStyle: metadata.preferredStyle || 'Simple',
          isDemo: false,
          emailVerified: !!sessionUser.email_confirmed_at,
          createdAt: sessionUser.created_at || new Date().toISOString()
        };

        setUser(authUser);
        setIsAuthenticated(true);
        setAuthError(null);

        // Store session based on rememberMe preference
        if (rememberMe) {
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(authUser));
        } else {
          sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(authUser));
          localStorage.removeItem(SESSION_STORAGE_KEY);
        }

        setIsLoading(false);
        return { success: true };
      } else {
        // Fallback to local storage (no email verification simulation)
        const storedUsersRaw = localStorage.getItem(REGISTERED_USERS_KEY);
        const registeredUsers: StoredAccount[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

        const matchedAccount = registeredUsers.find(
          (acc) =>
            acc.user.email.toLowerCase() === cleanEmail &&
            acc.passwordHash === cleanPassword
        );

        if (matchedAccount) {
          const authenticatedUser = matchedAccount.user;
          setUser(authenticatedUser);
          setIsAuthenticated(true);
          setAuthError(null);

          if (rememberMe) {
            localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(authenticatedUser));
          } else {
            sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(authenticatedUser));
            localStorage.removeItem(SESSION_STORAGE_KEY);
          }

          return { success: true };
        } else {
          const errorMsg = 'Invalid email or password. Please try again.';
          setAuthError(errorMsg);
          setIsLoading(false);
          return { success: false, error: errorMsg };
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMsg = err.message?.includes('Invalid login credentials')
        ? 'Invalid email or password. Please try again.'
        : 'An unexpected error occurred during login. Please try again.';
      setAuthError(errorMsg);
      setIsLoading(false);
      return { success: false, error: errorMsg };
    }
  };

  const signup = async (
    data: SignUpData
  ): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    setIsLoading(true);

    try {
      const cleanEmail = data.email.trim().toLowerCase();
      const cleanPassword = data.password.trim();

      // Basic validation
      if (cleanPassword.length < 6) {
        throw new Error('Password should be at least 6 characters long');
      }

      // Supabase signup (if configured)
      if (supabase) {
        // Prepare user metadata
        const metadata = {
          name: data.name.trim(),
          grade: data.grade || '10th',
          level: data.level || 'Intermediate',
          preferredSubjects: data.preferredSubjects,
          preferredStyle: 'Simple'
        };

        const { error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: {
            data: metadata
          }
        });

        if (error) throw error;

        // Sign up successful, but email not verified yet
        setPendingVerificationEmail(cleanEmail);
        setIsLoading(false);
        return { success: true };
      } else {
        // Fallback to local storage (instant verification simulation)
        const storedUsersRaw = localStorage.getItem(REGISTERED_USERS_KEY);
        const registeredUsers: StoredAccount[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

        // Check if user already exists
        const existing = registeredUsers.find(
          (acc) => acc.user.email.toLowerCase() === cleanEmail
        );

        if (existing) {
          const errorMsg = 'An account with this email already exists. Please login instead.';
          setAuthError(errorMsg);
          setIsLoading(false);
          return { success: false, error: errorMsg };
        }

        // Create new user record
        const newUser: AuthUser = {
          id: `user-${Date.now()}`,
          name: data.name.trim(),
          email: cleanEmail,
          grade: data.grade || '10th',
          level: data.level || 'Intermediate',
          preferredSubjects:
            data.preferredSubjects.length > 0
              ? data.preferredSubjects
              : ['Mathematics', 'Science'],
          preferredStyle: 'Simple',
          isDemo: false,
          emailVerified: true, // simulate instant verification in fallback
          createdAt: new Date().toISOString()
        };

        // Save user to simulated user database
        registeredUsers.push({
          user: newUser,
          passwordHash: cleanPassword
        });
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers));

        // Authenticate new user immediately
        setUser(newUser);
        setIsAuthenticated(true);
        setAuthError(null);
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newUser));

        setIsLoading(false);
        return { success: true };
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      let errorMsg = 'Failed to create account. Please try again.';
      if (err.message?.includes('Password should be at least 6 characters')) {
        errorMsg = err.message;
      } else if (err.message?.includes('User already registered')) {
        errorMsg = 'An account with this email already exists. Please login instead.';
      }
      setAuthError(errorMsg);
      setIsLoading(false);
      return { success: false, error: errorMsg };
    }
  };

  const resendVerificationEmail = async (): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    setIsLoading(true);

    try {
      if (!pendingVerificationEmail) {
        throw new Error('No pending verification email');
      }

      // Supabase resend (if configured)
      if (supabase) {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: pendingVerificationEmail
        });

        if (error) throw error;
      }
      // If supabase not configured, we just pretend it worked (fallback)

      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      console.error('Resend verification error:', err);
      const errorMsg = 'Failed to resend verification email. Please try again.';
      setAuthError(errorMsg);
      setIsLoading(false);
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
    setPendingVerificationEmail(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);

    // Clear syllabus data for all possible users (defensive cleanup)
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('gurumitra_syllabus_data_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      // Ignore errors in cleanup
    }

    // Prevent navigation back to protected view via browser back button
    try {
      window.history.pushState(null, '', window.location.href);
    } catch (e) {
      // Ignore in non-browser envs
    }
  };

  const resetPassword = async (
    email: string
  ): Promise<{ success: boolean; message: string }> => {
    // Simulated delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `Password reset instructions have been sent to ${email}. (Prototype simulation — in production, an email with a secure token will be dispatched)`
        });
      }, 600);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        authError,
        login,
        signup,
        logout,
        resetPassword,
        clearError,
        demoCredentials: {
          email: DEMO_USER.email,
          password: DEMO_PASSWORD
        },
        resendVerificationEmail,
        pendingVerificationEmail
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