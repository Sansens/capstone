import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
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
import { accountSessionForUser } from "./firebaseAuth.js";
import { auth } from "./firebase.js";
const homeForRole = {
  resident: "/warga",
  "rt-admin": "/dashboard",
  "system-admin": "/admin",
};

function RequireAuth({ session }) {
  return session ? <Outlet /> : <Navigate to="/" replace />;
}

function RequireRole({ session, role, children }) {
  return session?.role === role ? children : <Navigate to={homeForRole[session?.role] || "/"} replace />;
}

export default function App() {
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (!auth) {
      setAuthReady(true);
      return undefined;
    }

    let active = true;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        if (active) {
          setSession(null);
          setAuthReady(true);
        }
        return;
      }

      try {
        const nextSession = await accountSessionForUser(user);
        if (active) {
          setSession(nextSession);
          setAuthError("");
        }
      } catch (error) {
        let sessionError = error.message || "Gagal memuat peran akun.";
        try {
          await signOut(auth);
        } catch (signOutError) {
          sessionError = `${sessionError} Sesi gagal ditutup: ${signOutError.message}`;
        }
        if (active) {
          setSession(null);
          setAuthError(sessionError);
        }
      } finally {
        if (active) setAuthReady(true);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const login = (nextSession) => {
    setSession(nextSession);
    setAuthError("");
  };

  const logout = async () => {
    if (auth) await signOut(auth);
    setSession(null);
    setAuthError("");
  };

  if (!authReady) return <main className="login-screen"><p className="muted">Memeriksa sesi Firebase…</p></main>;

  return (
    <Routes>
      <Route path="/" element={<Login session={session} onLogin={login} authError={authError} />} />
      <Route path="/login" element={<Login session={session} onLogin={login} authError={authError} />} />
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
