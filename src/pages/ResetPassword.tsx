import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';

export function ResetPassword() {
  const { updatePassword, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    const success = await updatePassword(password);
    if (success) {
      navigate('/login', { 
        state: { message: 'Password updated successfully. Please sign in with your new password.' }
      });
    }
  };

  return (
    <AuthLayout title="Set new password">
      <form onSubmit={handleSubmit} className="space-y-6">
        {(error || validationError) && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error || validationError}</p>
          </div>
        )}

        <Input
          label="New password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Input
          label="Confirm new password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button type="submit" isLoading={isLoading}>
          Update password
        </Button>
      </form>
    </AuthLayout>
  );
}