import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { customer, checkSession, isLoading } = useAuthStore();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 3000)
      );

      try {
        if (!customer) {
          // Race the checkSession against a 3s timeout
          await Promise.race([checkSession(), timeoutPromise]);
        }
      } catch (error) {
        console.error('ProtectedRoute: session check failed or timed out', error);
      } finally {
        setIsChecking(false);
      }
    };
    initAuth();
  }, [customer, checkSession]);

  if (isChecking || isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-pulse text-stone-400">Loading...</div>
      </div>
    );
  }

  if (!customer) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
