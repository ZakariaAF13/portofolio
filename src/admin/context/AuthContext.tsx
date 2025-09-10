import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type User = {
  email: string;
  // Add other user properties as needed
};

type StoredCredentials = {
  email: string;
  password: string;
};

type SignInResponse = {
  data: { user: User | null } | null;
  error: Error | null;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<SignInResponse>;
  signOut: () => Promise<{ error: Error | null }>;
  updateEmail: (currentPassword: string, newEmail: string) => Promise<{ error: Error | null }>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<{ error: Error | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const CREDENTIALS_KEY = 'admin_credentials';

  const getStoredCredentials = (): StoredCredentials => {
    const raw = localStorage.getItem(CREDENTIALS_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as StoredCredentials;
        if (parsed.email && typeof parsed.password === 'string') return parsed;
      } catch (_) {
        // fall through to defaults
      }
    }
    const defaults: StoredCredentials = { email: 'admin@example.com', password: 'password123' };
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(defaults));
    return defaults;
  };

  const setStoredCredentials = (creds: StoredCredentials) => {
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
  };

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('admin_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('admin_user');
      }
    }
    // Ensure credentials exist
    getStoredCredentials();
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<SignInResponse> => {
    // Validate against stored credentials (demo purpose)
    const creds = getStoredCredentials();
    if (email === creds.email && password === creds.password) {
      const userData = { email };
      setUser(userData);
      localStorage.setItem('admin_user', JSON.stringify(userData));
      return { data: { user: userData }, error: null };
    }
    return { data: null, error: new Error('Invalid email or password') };
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('admin_user');
    return { error: null };
  };

  const updateEmail = async (currentPassword: string, newEmail: string) => {
    const creds = getStoredCredentials();
    if (currentPassword !== creds.password) {
      return { error: new Error('Current password is incorrect') };
    }
    const updated: StoredCredentials = { ...creds, email: newEmail };
    setStoredCredentials(updated);
    // If logged in, update user state and persisted user
    if (user) {
      const updatedUser = { ...user, email: newEmail };
      setUser(updatedUser);
      localStorage.setItem('admin_user', JSON.stringify(updatedUser));
    }
    return { error: null };
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    const creds = getStoredCredentials();
    if (currentPassword !== creds.password) {
      return { error: new Error('Current password is incorrect') };
    }
    const updated: StoredCredentials = { ...creds, password: newPassword };
    setStoredCredentials(updated);
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, updateEmail, updatePassword }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
