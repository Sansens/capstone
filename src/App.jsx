import React, { useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import PengajuanSurat from "./pages/PengajuanSurat.jsx";
import LaporanMandiri from "./pages/LaporanMandiri.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminAccounts from "./pages/AdminAccounts.jsx";
import AdminLetterTypes from "./pages/AdminLetterTypes.jsx";
import ResidentDashboard from "./pages/ResidentDashboard.jsx";
import ResidentProfile from "./pages/ResidentProfile.jsx";
import Login from "./pages/Login.jsx";
import Sistem from "./pages/Sistem.jsx";

const SESSION_KEY = "silaras-session";
const homeForRole = {
  resident: "/warga",
  "rt-admin": "/dashboard",
  "system-admin": "/admin",
};

function readSession() {
  try {
    const stored = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    return stored && homeForRole[stored.role] ? stored : null;
  } catch {
    return null;
  }
}

function RequireAuth({ session }) {
  return session ? <Outlet /> : <Navigate to="/" replace />;
}

function RequireRole({ session, role, children }) {
  return session?.role === role ? children : <Navigate to={homeForRole[session?.role] || "/"} replace />;
}

export default function App() {
  const [session, setSession] = useState(readSession);

  const login = (nextSession) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  return (
    <Routes>
      <Route path="/" element={<Login session={session} onLogin={login} />} />
      <Route path="/login" element={<Login session={session} onLogin={login} />} />
      <Route element={<RequireAuth session={session} />}>
        <Route element={<Layout session={session} onLogout={logout} />}>
          <Route path="/warga" element={<RequireRole session={session} role="resident"><ResidentDashboard session={session} /></RequireRole>} />
          <Route path="/ajukan" element={<RequireRole session={session} role="resident"><PengajuanSurat session={session} /></RequireRole>} />
          <Route path="/lapor" element={<RequireRole session={session} role="resident"><LaporanMandiri session={session} /></RequireRole>} />
          <Route path="/profil" element={<RequireRole session={session} role="resident"><ResidentProfile session={session} /></RequireRole>} />
          <Route path="/lacak" element={<Navigate to="/warga" replace />} />
          <Route path="/dashboard" element={<RequireRole session={session} role="rt-admin"><Dashboard /></RequireRole>} />
          <Route path="/admin" element={<RequireRole session={session} role="system-admin"><Navigate to="/admin/akun" replace /></RequireRole>} />
          <Route path="/admin/akun" element={<RequireRole session={session} role="system-admin"><AdminAccounts /></RequireRole>} />
          <Route path="/admin/surat" element={<RequireRole session={session} role="system-admin"><AdminLetterTypes /></RequireRole>} />
          <Route path="/sistem" element={session?.role === "resident" ? <Navigate to="/warga" replace /> : <Sistem />} />
          <Route path="*" element={<Navigate to={homeForRole[session?.role] || "/"} replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
