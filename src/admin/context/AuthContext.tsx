import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type User = {
  email: string;
  // Add other user properties as needed
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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<SignInResponse> => {
    // Simple validation for demo - in production, this would be an API call
    if (email === 'admin@example.com' && password === 'password123') {
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

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
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
