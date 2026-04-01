import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { TasksPage } from './pages/TasksPage';
import { SettingsLayout } from './pages/settings/SettingsLayout';
import { AreasSettings } from './pages/settings/AreasSettings';
import { UserManagement } from './pages/settings/UserManagement';
import { CalendarIntegration } from './pages/settings/CalendarIntegration';
import { Header } from './components/Header';
import { supabase } from './lib/supabase';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100">
                <Header />
                <TasksPage />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100">
                <Header />
                <SettingsLayout />
              </div>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="areas" replace />} />
          <Route path="areas" element={<AreasSettings />} />
          <Route path="user" element={<UserManagement />} />
          <Route path="calendar" element={<CalendarIntegration />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}