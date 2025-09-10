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
  const loading = false; // Not used in this simplified version

  // For testing - auto login
  useEffect(() => {
    const testUser = { email: 'test@example.com' };
    setUser(testUser);
  }, []);

  const signIn = async (email: string, password: string): Promise<SignInResponse> => {
    // Simple validation for testing
    if (email && password) {
      const testUser = { email };
      setUser(testUser);
      return { data: { user: testUser }, error: null };
    }
    return { data: null, error: new Error('Invalid credentials') };
  };

  const signOut = async () => {
    setUser(null);
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
