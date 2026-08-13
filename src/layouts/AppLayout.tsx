import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { useSettings } from "../hooks/useSettings";
import { applyAppTheme } from "../utils/app-theme";

export function AppLayout() {
  const settingsQuery = useSettings();

  useEffect(() => {
    if (!settingsQuery.data) {
      return;
    }

    applyAppTheme(settingsQuery.data);
  }, [settingsQuery.data]);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Header />

        <main className="p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}