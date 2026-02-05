import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import BudgetPage from './pages/Budget';
import OperationsPage from './pages/Operations';
import ProposalsPage from './pages/Proposals';
import TimelinePage from './pages/Timeline';
import SettingsPage from './pages/Settings';
import { useAuth } from './lib/auth';

function RequireAuth({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 20 }}>Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="budget" element={<BudgetPage />} />
        <Route path="operations" element={<OperationsPage />} />
        <Route path="proposals" element={<ProposalsPage />} />
        <Route path="timeline" element={<TimelinePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
