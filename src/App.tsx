import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AppLayout } from "./layouts/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { TicketsPage } from "./pages/TicketsPage";
import { TicketDetailsPage } from "./pages/TicketDetailsPage";
import { UsersPage } from "./pages/UsersPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { KanbanPage } from "./pages/KanbanPage";
import { useSocket } from "./hooks/useSocket";
import { useSocketEvents } from "./hooks/useSocketEvents";
import { Toaster } from "sonner";


function PlaceholderPage({
  title,
}: {
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8">
      <h2 className="text-2xl font-bold text-slate-900">
        {title}
      </h2>

      <p className="mt-2 text-slate-500">
        Esta tela será criada na próxima etapa.
      </p>
    </div>
  );
}

export function App() {

  useSocket();

  useSocketEvents();

  return (
    <>
      <Toaster
        position="top-right"
        richColors
        closeButton
      />
      <Routes>
        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route
              path="/dashboard"
              element={<DashboardPage />}
            />

            <Route
              path="/tickets"
              element={<TicketsPage />}
            />

            <Route
              path="/kanban"
              element={<KanbanPage />}
            />

            <Route
              path="/tickets/:id"
              element={<TicketDetailsPage />}
            />

            <Route
              path="/users"
              element={<UsersPage />}
            />

            <Route
              path="/reports"
              element={<ReportsPage />}
            />

            <Route
              path="/settings"
              element={<SettingsPage />}
            />
          </Route>
        </Route>

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />
      </Routes>
    </>
  );
}