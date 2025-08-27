import { useState } from "react";
import {
  Fuel,
  Plus,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Truck,
  Download,
  Upload,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";

import { useShipsStore } from "../../store/ships";
import { useReportsStore } from "../../store/reports";

export default function GasoilNavire() {
  const { reports } = useReportsStore();
  const { currentShip } = useShipsStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    to: "",
    to_m3: "",
    to_details: "",
    from: "",
    from_m3: "",
    from_details: "",
  });

  if (!currentShip) {
    return <div>Erreur: Aucun navire connecté</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici on ajouterait normalement l'opération à la base de données
    console.log("Nouveau transfert de fuel:", formData);
    setShowAddForm(false);
    setFormData({
      date: new Date().toISOString().split("T")[0],
      to: "",
      to_m3: "",
      to_details: "",
      from: "",
      from_m3: "",
      from_details: "",
    });
  };

  const mostRecentReport = reports.sort(
    (a, b) => new Date(b.report_date) - new Date(a.report_date)
  )[0];

  //console.log(reports);

  // Calculs basés sur les données disponibles
  const totalReceived = reports?.fuel_transfers?.reduce(
    (sum, transfer) => sum + (parseFloat(transfer.to_m3) || 0),
    0
  );
  const totalDelivered = reports?.fuel_transfers?.reduce(
    (sum, transfer) => sum + (parseFloat(transfer.from_m3) || 0),
    0
  );
  const netChange = totalReceived - totalDelivered;

  // Valeurs statiques pour l'exemple (à adapter selon vos besoins)
  const currentStock =
    parseFloat(mostRecentReport?.fuel_oil_rob) +
      parseFloat(mostRecentReport?.fuel_oil_received) -
      (parseFloat(mostRecentReport?.fuel_oil_consumed) -
        parseFloat(mostRecentReport?.fuel_oil_delivered)) || 0;
  const totalCapacity = 15000;
  const dailyConsumption =
    reports.reduce((sum, r) => sum + parseFloat(r.fuel_oil_consumed || 0), 0) /
      reports.length || 0;

  const fuelPercentage = (currentStock / totalCapacity) * 100;
  const autonomyDays = Math.floor(currentStock / dailyConsumption) || 0;

  const getFuelStatus = () => {
    if (fuelPercentage < 25)
      return { status: "critical", color: "text-red-600", icon: AlertTriangle };
    if (fuelPercentage < 50)
      return {
        status: "warning",
        color: "text-yellow-600",
        icon: TrendingDown,
      };
    return { status: "good", color: "text-green-600", icon: TrendingUp };
  };

  const fuelStatus = getFuelStatus();
  const StatusIcon = fuelStatus.icon;

  // Fonction pour déterminer le type de transfert et la couleur de fond
  const getTransferType = (transfer) => {
    const hasTo =
      transfer.to && transfer.to_m3 && parseFloat(transfer.to_m3) > 0;
    const hasFrom =
      transfer.from && transfer.from_m3 && parseFloat(transfer.from_m3) > 0;

    if (hasTo && hasFrom) {
      return {
        type: "échange",
        bgColor: "bg-blue-50",
        icon: TrendingUp,
        textColor: "text-blue-800",
      };
    } else if (hasTo) {
      return {
        type: "chargement",
        bgColor: "bg-green-50",
        icon: Upload,
        textColor: "text-green-800",
      };
    } else if (hasFrom) {
      return {
        type: "déchargement",
        bgColor: "bg-red-50",
        icon: Download,
        textColor: "text-red-800",
      };
    } else {
      return {
        type: "inconnu",
        bgColor: "bg-gray-50",
        icon: AlertTriangle,
        textColor: "text-gray-800",
      };
    }
  };

  //console.log(reports);
  // Préparer les données pour l'affichage dans le tableau
  const prepareTransferData = () => {
    const transfers = [];
    const stats = {
      totalReceived: 0,
      totalDelivered: 0,
      vessels: new Set(),
      dates: new Set(),
    };

    // Vérifier que reports est un tableau
    if (!Array.isArray(reports)) {
      console.error("Reports is not an array:", reports);
      return { transfers: [], stats };
    }

    // Parcourir tous les rapports
    reports.forEach((report) => {
      // Ajouter le navire et la date aux statistiques
      if (report.vessel_name) stats.vessels.add(report.vessel_name);
      if (report.report_date) stats.dates.add(report.report_date);

      // Vérifier si ce rapport a des transferts de fuel
      if (report.fuel_transfers && Array.isArray(report.fuel_transfers)) {
        // Parcourir tous les transferts de ce rapport
        report.fuel_transfers.forEach((transfer, index) => {
          if (!transfer) return;

          // Ajouter les déchargements (sorties)
          if (transfer.to && transfer.to_m3 && parseFloat(transfer.to_m3) > 0) {
            const quantity = parseFloat(transfer.to_m3);
            transfers.push({
              id: `${report.id}-${index}-out`,
              date: report.report_date,
              type: "déchargement",
              partie: transfer.to,
              quantite: quantity,
              details: transfer.to_details,
              bgColor: "bg-red-50",
              textColor: "text-red-800",
              icon: ArrowUpRight,
              signe: "-",
              reportId: report.id,
              vesselName: report.vessel_name,
            });
            stats.totalDelivered += quantity;
          }

          // Ajouter les chargements (entrées)
          if (
            transfer.from &&
            transfer.from_m3 &&
            parseFloat(transfer.from_m3) > 0
          ) {
            const quantity = parseFloat(transfer.from_m3);
            transfers.push({
              id: `${report.id}-${index}-in`,
              date: report.report_date,
              type: "chargement",
              partie: transfer.from,
              quantite: quantity,
              details: transfer.from_details,
              bgColor: "bg-green-50",
              textColor: "text-green-800",
              icon: ArrowDownLeft,
              signe: "+",
              reportId: report.id,
              vesselName: report.vessel_name,
            });
            stats.totalReceived += quantity;
          }
        });
      }
    });

    // Convertir les Sets en tableaux pour les statistiques
    stats.vessels = Array.from(stats.vessels);
    stats.dates = Array.from(stats.dates);

    // Trier par date (du plus récent au plus ancien)
    const sortedTransfers = transfers.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    return { transfers: sortedTransfers, stats };
  };

  const displayTransfers = prepareTransferData();

  //console.log(displayTransfers);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Fuel Oil Management
          </h1>
          <p className="text-gray-600 mt-2">
            {currentShip.name} - Fuel oil transfers and tracking
          </p>
        </div>
        {/* <button
          onClick={() => setShowAddForm(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nouveau transfert
        </button> */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentStock} m³
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
            <div className="mt-2 flex items-center text-sm">
              <StatusIcon className={`h-4 w-4 mr-1 ${fuelStatus.color}`} />
              <span className={`font-medium ${fuelStatus.color}`}>
                {fuelStatus.status === "critical"
                  ? "Critical stock"
                  : fuelStatus.status === "warning"
                  ? "Low stock"
                  : "Normal stock"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Capacity
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {totalCapacity} m³
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">
              {fuelPercentage.toFixed(1)}% of capacity
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Consumption/day
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {dailyConsumption.toFixed(2)} m³
              </p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">Average consumption</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Autonomy</p>
              <p className="text-2xl font-bold text-gray-900">
                {autonomyDays} days
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">At current consumption</span>
          </div>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Nouveau transfert de fuel oil
          </h3>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destinataire
              </label>
              <input
                type="text"
                required
                value={formData.to}
                onChange={(e) =>
                  setFormData({ ...formData, to: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Nom du destinataire"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantité reçue (m³)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.to_m3}
                onChange={(e) =>
                  setFormData({ ...formData, to_m3: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Détails réception
              </label>
              <input
                type="text"
                value={formData.to_details}
                onChange={(e) =>
                  setFormData({ ...formData, to_details: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Détails de réception"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expéditeur
              </label>
              <input
                type="text"
                value={formData.from}
                onChange={(e) =>
                  setFormData({ ...formData, from: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Nom de l'expéditeur"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantité livrée (m³)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.from_m3}
                onChange={(e) =>
                  setFormData({ ...formData, from_m3: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Détails livraison
              </label>
              <textarea
                value={formData.from_details}
                onChange={(e) =>
                  setFormData({ ...formData, from_details: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={3}
                placeholder="Détails de livraison"
              />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Ajouter
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Fuel Transfers History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Fuel Oil Transfer
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipient/Sender
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity (m³)
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayTransfers.transfers.map((transfer) => {
                const TransferIcon = transfer.icon;

                return (
                  <tr
                    key={transfer.id}
                    className={`hover:opacity-90 ${transfer.bgColor}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transfer.date
                        ? new Date(transfer.date).toLocaleDateString("fr-FR")
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center justify-center text-center">
                        <TransferIcon className="h-4 w-4 mr-1" />
                        {transfer.partie}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium">
                      <span
                        className={
                          transfer.type === "chargement"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {transfer.signe}
                        {parseFloat(transfer.quantite).toLocaleString()} m³
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-900 max-w-xs ">
                      {transfer.details || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {reports?.length === 0 && (
          <div className="text-center py-12">
            <Fuel className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No transfer
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Start by adding a fuel oil transfer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
