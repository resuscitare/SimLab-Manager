import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import { useEffect } from 'react';

// Componente privado para rotas protegidas
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redireciona para login com retorno à página atual
      window.location.href = `/login?redirect=${encodeURIComponent(location.pathname)}`;
    }
  }, [isAuthenticated, location.pathname]);

  return isAuthenticated ? children : <Navigate to="/login" replace state={{ from: location }} />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        {/* Adicione mais rotas aqui conforme necessário */}
      </Routes>
    </Router>
  );
}

export default App;