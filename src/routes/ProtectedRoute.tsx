import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const authed = typeof window !== 'undefined' && localStorage.getItem('auth') === 'true';
  if (!authed) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
