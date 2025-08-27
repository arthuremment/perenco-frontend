import { Route, Navigate, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Login/Login";
import DashboardNavire from "./pages/DashboardNavire/DashboardNavire";
import GasoilNavire from "./pages/GasoilNavire/GasoilNavire";
import CargaisonNavire from "./pages/CargaisonNavire/CargaisonNavire";
import MaintenanceNavire from "./pages/MaintenanceNavire/MaintenanceNavire";
import ShipOperationalForm from "./pages/ShipOperationalForm/ShipOperationalForm";
import OperationalReportsList from "./pages/OperationalReportList/OperationalReportList";
import DashboardAdmin from "./pages/DashboardAdmin/DashboardAdmin";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthStore } from "./store/auth";

function App() {
  const { token, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  //console.log(user)

  // Vérifier l'état d'authentification au chargement
  useEffect(() => {
    // Simuler un petit délai pour le chargement initial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          !token ? (
            <Login />
          ) : (
            <Navigate
              to={
                user?.role === "admin" ? "/admin-dashboard" : "/ship-dashboard/:id"
              }
            />
          )
        }
      />

      {token ? (
        <Route path="/" element={<Layout />}>
          {/* Redirection par défaut selon le rôle */}
          <Route
            index
            element={
              <Navigate
                to={
                  user?.role === "admin"
                    ? "/admin-dashboard"
                    : "/ship-dashboard/:id"
                }
              />
            }
          />

          {/* Routes pour les navires (role = ship) */}
          {user?.role === "ship" && (
            <>
              <Route path="ship-dashboard/:id" element={<DashboardNavire />} />
              <Route path="ship-form/:id" element={<ShipOperationalForm />} />
              <Route path="ship-reports/:id" element={<OperationalReportsList />} />
              <Route path="ship-fuel/:id" element={<GasoilNavire />} />
              <Route path="ship-cargo/:id" element={<CargaisonNavire />} />
              <Route path="ship-maintenance/:id" element={<MaintenanceNavire />} />
            </>
          )}

          {/* Routes pour les administrateurs (role = admin) */}
          {user?.role === "admin" && (
            <Route
              path="admin-dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DashboardAdmin />
                </ProtectedRoute>
              }
            />
          )}

          {/* Redirection pour les routes non autorisées */}
          <Route
            path="*"
            element={
              <Navigate
                to={
                  user?.role === "admin"
                    ? "/admin-dashboard"
                    : "/ship-dashboard/:id"
                }
              />
            }
          />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
}

export default App;
