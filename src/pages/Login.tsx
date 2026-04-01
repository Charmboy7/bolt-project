import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { loginSchema } from '../lib/validation';

export function Login() {
  const { login, forgotPassword, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = loginSchema.parse({ email, password });
      await login(data.email, data.password);
    } catch (err) {
      if (err instanceof Error) {
        setMessage(err.message);
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage('Please enter your email');
      return;
    }
    const success = await forgotPassword(email);
    if (success) {
      setMessage('Password reset instructions sent to your email');
    }
  };

  return (
    <AuthLayout title="Sign in to your account">
      <form onSubmit={handleSubmit} className="space-y-6">
        {(error || message) && (
          <p className="text-sm text-red-600">{error || message}</p>
        )}
        
        <Input
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" isLoading={isLoading}>
          Sign in
        </Button>

        <div className="text-sm">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Forgot your password?
          </button>
        </div>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}