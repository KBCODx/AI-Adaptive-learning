import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, LoginCredentials, SignUpData, SubjectType, DifficultyLevel } from '../types';

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
  createdAt: '2026-01-01T00:00:00.000Z'
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

  // Initialize stored accounts and active session on mount
  useEffect(() => {
    try {
      // 1. Seed demo user into registered users if not present
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
  }, []);

  const clearError = () => setAuthError(null);

  const login = async ({
    email,
    password,
    rememberMe = true
  }: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);

    // Realistic simulated network latency for premium UX
    await new Promise((resolve) => setTimeout(resolve, 600));

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    try {
      const storedUsersRaw = localStorage.getItem(REGISTERED_USERS_KEY);
      const registeredUsers: StoredAccount[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      // Check against registered users and demo credentials
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

        // Store session based on rememberMe preference
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
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = 'An unexpected error occurred during login. Please try again.';
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const signup = async (
    data: SignUpData
  ): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);

    // Realistic simulated network latency
    await new Promise((resolve) => setTimeout(resolve, 750));

    const cleanEmail = data.email.trim().toLowerCase();
    const cleanPassword = data.password.trim();

    try {
      const storedUsersRaw = localStorage.getItem(REGISTERED_USERS_KEY);
      const registeredUsers: StoredAccount[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      // Check if user already exists
      const existing = registeredUsers.find(
        (acc) => acc.user.email.toLowerCase() === cleanEmail
      );

      if (existing) {
        const errorMsg = 'An account with this email already exists. Please login instead.';
        setAuthError(errorMsg);
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

      return { success: true };
    } catch (err) {
      const errorMsg = 'Failed to create account. Please try again.';
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);

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
    await new Promise((resolve) => setTimeout(resolve, 600));

    return {
      success: true,
      message: `Password reset instructions have been sent to ${email}. (Prototype simulation — in production, an email with a secure token will be dispatched)`
    };
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
        }
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
