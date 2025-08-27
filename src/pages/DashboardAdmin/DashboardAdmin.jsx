import { useState, useEffect } from "react";
import {
  LogOut,
  BarChart3,
  Download as DownloadIcon,
  Ship,
  BarChart2,
  Clipboard,
  ShipIcon,
} from "lucide-react";

import Dashboard from "../../components/Dashboard";
import ShipsManagement from "../../components/ShipsManagement";
import ReportsManagement from "../../components/ReportsManagement";
import Analytics from "../../components/Analytics";
import { useShipsStore } from "../../store/ships";
import { useReportsStore } from "../../store/reports";
import { useAuthStore } from "../../store/auth";

const DashboardAdmin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const { type, logout } = useAuthStore();
  const { allReports, fetchReports } = useReportsStore();
  const { ships, fetchShips, loading, error } = useShipsStore();

  useEffect(() => {
    if (type === "admin") {
      fetchShips();
    }
  }, [type, fetchShips]);

  useEffect(() => {
    fetchReports();
  }, []);

  const handleEditShip = (ship) => {
    console.log("Modifier le navire:", ship);
    // Ouvrir un modal ou formulaire d'édition
  };

  const handleDeleteShip = (shipId) => {
    console.log("Supprimer le navire:", shipId);
    // Confirmation et suppression
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
  };

  const handleExportReport = (report) => {
    console.log("Exporter le rapport:", report);
    setShowExportModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <ShipIcon className="h-8 w-8 text-orange-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Fleet Management
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* <button className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </button>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-gray-600" />
            </div> */}
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
                <Ship className="h-5 w-5 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-bold text-gray-900">
                PERENCO Log
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex space-x-8">
            {[
              { id: "dashboard", label: "Tableau de bord", icon: BarChart3 },
              { id: "ships", label: "Navires", icon: Ship },
              { id: "reports", label: "Rapports", icon: Clipboard },
              { id: "analytics", label: "Analytique", icon: BarChart2 },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`py-4 px-1 font-medium text-sm border-b-2 flex items-center ${
                    activeTab === tab.id
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div>
            <button
              onClick={logout}
              className="p-2 text-white rounded-lg transition-colors bg-red-400 hover:bg-red-600 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && (
          <Dashboard reports={allReports.reports} ships={ships} />
        )}
        {activeTab === "ships" && (
          <ShipsManagement
            ships={ships}
            onEditShip={handleEditShip}
            onDeleteShip={handleDeleteShip}
          />
        )}
        {activeTab === "reports" && (
          <ReportsManagement
            reports={allReports.reports}
            ships={ships}
            onViewReport={handleViewReport}
            onExportReport={handleExportReport}
          />
        )}
        {activeTab === "analytics" && (
          <Analytics reports={reports} ships={ships} />
        )}
      </main>

      {/* Modal de détail du rapport */}
      {selectedReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Détails du rapport
              </h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                &times;
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Navire</p>
                  <p className="text-sm text-gray-900">
                    {ships.find((s) => s.id === selectedReport.ship_id)?.name ||
                      "Navire inconnu"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedReport.report_date).toLocaleDateString(
                      "fr-FR"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Distance</p>
                  <p className="text-sm text-gray-900">
                    {selectedReport.distance}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">ROB</p>
                  <p className="text-sm text-gray-900">
                    {selectedReport.fuel_oil_rob} m³
                  </p>
                </div>
              </div>

              {selectedReport.fuel_transfers &&
                Object.keys(selectedReport.fuel_transfers).length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Transferts de Gasoil
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(selectedReport.fuel_transfers).map(
                        ([key, transfer]) => (
                          <div key={key} className="rounded-md p-3">
                            <div className="grid grid-cols-2 gap-4">
                              {transfer.to && (
                                <div className="bg-red-50 p-2 rounded-md">
                                  <p className="text-xs font-medium text-red-800">
                                    OUT
                                  </p>
                                  <p className="text-sm">{transfer.to}</p>
                                  <p className="text-sm font-medium">
                                    - {transfer.to_m3} m³
                                  </p>
                                  {transfer.to_details && (
                                    <p className="text-xs mt-1">
                                      {transfer.to_details}
                                    </p>
                                  )}
                                </div>
                              )}
                              {transfer.from && (
                                <div className="bg-green-50 p-2 rounded-md">
                                  <p className="text-xs font-medium text-green-800">
                                    IN
                                  </p>
                                  <p className="text-sm">{transfer.from}</p>
                                  <p className="text-sm font-medium">
                                    + {transfer.from_m3} m³
                                  </p>
                                  {transfer.from_details && (
                                    <p className="text-xs mt-1">
                                      {transfer.from_details}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAdmin;
