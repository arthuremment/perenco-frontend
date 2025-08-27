import { useEffect } from "react";
import {
  Ship,
  Fuel,
  Package,
  Users,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { useShipsStore } from "../../store/ships";
import { useAuthStore } from "../../store/auth";
import { useReportsStore } from "../../store/reports";

export default function ShipDashboard() {
  const { t } = useTranslation();
  const { currentShip, fetchCurrentShip, loading, error } = useShipsStore();
  const { reports, fetchShipReports } = useReportsStore();
  const { user } = useAuthStore();

  console.log(currentShip);
  //console.log(user)

  useEffect(() => {
    if (user?.role === "ship") {
      fetchCurrentShip();
    }
  }, [user, fetchCurrentShip]);

  useEffect(() => {
    if (user?.role === "ship") {
      fetchShipReports();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;
  if (!currentShip && user?.type === "ship") return <div>No ship found</div>;

  const mostRecentReport = reports?.sort(
    (a, b) => new Date(b.report_date) - new Date(a.report_date)
  )[0];

  const currentStock =
    parseFloat(mostRecentReport?.fuel_oil_rob) +
      parseFloat(mostRecentReport?.fuel_oil_received) -
      (parseFloat(mostRecentReport?.fuel_oil_consumed) -
        parseFloat(mostRecentReport?.fuel_oil_delivered)) || 0;

  const totalCapacity = 15000;
  const fuelPercentage = (currentStock / totalCapacity) * 100;

  const fuelOperations = [
    // {
    //   id: "1",
    //   shipId: "1",
    //   date: "2024-12-15",
    //   quantity_delivered: 500,
    //   remaining_stock: 1850,
    //   daily_consumption: 180,
    //   supplier: "Total Energies",
    //   notes: "Plein effectué avant départ",
    // },
  ];
  const cargoOperations = [
    // {
    //   id: "1",
    //   shipId: "1",
    //   date: "2024-12-14",
    //   operation_type: "loading",
    //   product_type: "Pétrole brut",
    //   quantity: 52000,
    //   weight: 45000,
    //   destination: "Raffinerie de Limbe",
    //   notes: "Chargement complet - qualité vérifiée",
    // },
  ];

  const getStatusColor = (status) => {
    const colors = {
      docked: "bg-green-100 text-green-800",
      en_route: "bg-blue-100 text-blue-800",
      departed: "bg-gray-100 text-gray-800",
      maintenance: "bg-yellow-100 text-yellow-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status) => {
    const labels = {
      docked: "À quai",
      en_route: "En route",
      departed: "Parti",
      maintenance: "Maintenance",
    };
    return labels[status] || status;
  };

  const getMaintenanceStatusIcon = (status) => {
    switch (status) {
      case "good":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const cargoPercentage = 45000 > 0 ? (45000 / 50000) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-orange-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-blue-100 mt-2">Ship Dashboard</p>
          </div>
          <div className="text-right">
            <div
              className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                user.position
              )} text-gray-800`}
            >
              {getStatusLabel(user.position)}
            </div>
            <p className="text-blue-100 mt-2 capitalize">
              Master: {user.captain}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {t("dashboardNav.crew")}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {currentShip?.crew}
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {t("dashboardNav.gasoil")}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {currentStock} L
              </p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Fuel className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  fuelPercentage > 50
                    ? "bg-green-500"
                    : fuelPercentage > 25
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${fuelPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {fuelPercentage.toFixed(1)}% of capacity
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {t("dashboardNav.cargo")}
              </p>
              <p className="text-2xl font-bold text-gray-900">4500 T</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-green-500"
                style={{ width: `${cargoPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {cargoPercentage.toFixed(1)}% de charge
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {t("dashboardNav.maintenance")}
              </p>
              <p className="text-sm font-bold text-gray-900 capitalize">good</p>
            </div>
            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
              {getMaintenanceStatusIcon("good")}
            </div>
          </div>
        </div>
      </div>

      {/* Informations détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations générales */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t("dashboardNav.infos")}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <Ship className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {t("dashboardNav.typeN")}
                </p>
                <p className="text-sm text-gray-600 capitalize">
                  {currentShip?.type}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Current position
                </p>
                <p className="text-sm text-gray-600">
                  {user.position || "No specified"}
                </p>
              </div>
            </div>
            {/* <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Date d'arrivée
                </p>
                <p className="text-sm text-gray-600">
                  {ship.arrival_date
                    ? new Date(ship.arrival_date).toLocaleString("fr-FR")
                    : "Non définie"}
                </p>
              </div>
            </div> */}
            {/* <div className="flex items-center">
              <Anchor className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Date de départ prévue
                </p>
                <p className="text-sm text-gray-600">
                  {ship.departure_date
                    ? new Date(ship.departure_date).toLocaleString("fr-FR")
                    : "Non définie"}
                </p>
              </div>
            </div> */}
          </div>
        </div>

        {/* Cargaison actuelle */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Current cargo
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Type</p>
              <p className="text-sm text-gray-600">
                {"Pétrole brut" || "Aucune cargaison"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Weight</p>
                <p className="text-sm text-gray-600">45000 tonnes</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Volume</p>
                <p className="text-sm text-gray-600">52000 m³</p>
              </div>
            </div>
            {/* {["Pétrole brut Bonny Light", "Condensat"] > 0 && ( */}
            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">
                Products transported
              </p>
              <div className="space-y-1">
                {["Pétrole brut Bonny Light", "Condensat"].map(
                  (product, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2"
                    >
                      {product}
                    </span>
                  )
                )}
              </div>
            </div>
            {/* )} */}
          </div>
        </div>
      </div>

      {/* Activités récentes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent activities
        </h3>
        <div className="space-y-4">
          {fuelOperations?.slice(0, 3).map((operation) => (
            <div
              key={operation.id}
              className="flex items-center p-3 bg-orange-50 rounded-lg"
            >
              <Fuel className="h-5 w-5 text-orange-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Ravitaillement carburant - {operation.quantity_delivered}L
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(operation.date).toLocaleDateString("fr-FR")} •{" "}
                  {operation.supplier}
                </p>
              </div>
            </div>
          ))}
          {cargoOperations?.slice(0, 2).map((operation) => (
            <div
              key={operation.id}
              className="flex items-center p-3 bg-green-50 rounded-lg"
            >
              <Package className="h-5 w-5 text-green-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {operation.operation_type === "loading"
                    ? "Chargement"
                    : "Déchargement"}{" "}
                  - {operation.product_type}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(operation.date).toLocaleDateString("fr-FR")} •{" "}
                  {operation.quantity.toLocaleString()} m³
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
