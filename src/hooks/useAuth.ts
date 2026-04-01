import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp, resetPassword, updatePassword, signOut } from '../lib/auth';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (action: () => Promise<any>, redirectPath?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await action();
      if (redirectPath) {
        navigate(redirectPath);
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = (email: string, password: string) => 
    handleAuth(() => signIn(email, password), '/');

  const register = (email: string, password: string, name: string) => 
    handleAuth(() => signUp(email, password, name));

  const forgotPassword = (email: string) => 
    handleAuth(() => resetPassword(email));

  const updateUserPassword = (newPassword: string) => 
    handleAuth(() => updatePassword(newPassword));

  const logout = () => handleAuth(signOut, '/login');

  return {
    isLoading,
    error,
    login,
    register,
    forgotPassword,
    updatePassword: updateUserPassword,
    logout
  };
}