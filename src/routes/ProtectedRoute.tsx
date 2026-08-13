import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-500">Carregando...</p>
      </div>
    );
  }

  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" replace />;
}