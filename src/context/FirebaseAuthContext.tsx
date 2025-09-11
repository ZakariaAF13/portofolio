import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateEmail as firebaseUpdateEmail,
  updatePassword as firebaseUpdatePassword,
  User as FirebaseUser,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { auth } from '../config/firebase';

type User = {
  email: string;
  uid: string;
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

const FirebaseAuthContext = createContext<AuthContextType | undefined>(undefined);

export const FirebaseAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          email: firebaseUser.email || '',
          uid: firebaseUser.uid
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<SignInResponse> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const userData: User = {
        email: firebaseUser.email || '',
        uid: firebaseUser.uid
      };
      
      return { data: { user: userData }, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error : new Error('Sign in failed') 
      };
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { 
        error: error instanceof Error ? error : new Error('Sign out failed') 
      };
    }
  };

  const updateEmail = async (currentPassword: string, newEmail: string) => {
    try {
      if (!auth.currentUser || !auth.currentUser.email) {
        return { error: new Error('No authenticated user') };
      }

      // Re-authenticate user before updating email
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Update email
      await firebaseUpdateEmail(auth.currentUser, newEmail);
      
      return { error: null };
    } catch (error) {
      console.error('Update email error:', error);
      return { 
        error: error instanceof Error ? error : new Error('Failed to update email') 
      };
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      if (!auth.currentUser || !auth.currentUser.email) {
        return { error: new Error('No authenticated user') };
      }

      // Re-authenticate user before updating password
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Update password
      await firebaseUpdatePassword(auth.currentUser, newPassword);
      
      return { error: null };
    } catch (error) {
      console.error('Update password error:', error);
      return { 
        error: error instanceof Error ? error : new Error('Failed to update password') 
      };
    }
  };

  return (
    <FirebaseAuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signOut, 
      updateEmail, 
      updatePassword 
    }}>
      {!loading && children}
    </FirebaseAuthContext.Provider>
  );
};

export const useFirebaseAuth = () => {
  const context = useContext(FirebaseAuthContext);
  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return context;
};
