import {
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  Printer,
  Download,
  Calendar,
  Ship,
  Clock,
  Fuel,
  Package,
  Users,
  MapPin,
  Box,
} from "lucide-react";

import { filterOperationsWithActivity } from "../utils/filterOperations";
import { formatNumber } from "../utils/formatNumber";

export default function OperationalReportView({ report, onBack }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-EN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const printReport = () => {
    window.print();
  };

  const time_distribution = {
    "Sailing Eco speed": report.sailing_eco,
    "Sailing Full speed": report.sailing_full,
    "Cargo Ops./Off loading,Loading/Loading dry bulk/Pumping fresh water, mud, bunkering, etc..":
      report.cargo_ops,
    "Lifting operations": report.lifting_ops,
    "tandby offshore with Engine/ON DP MODE": report.standby_offshore,
    "Standby @ Port": report.standby_port,
    "Standby @ Anchorage(anchor dropped)": report.standby_anchorage,
    "Downtime/Vessel failure": report.downtime,
  };

  //Filtre les transferts non vides
  const fuel_transfers = report.fuel_transfers?.filter(
    (transfer) => transfer.to_m3 || transfer.from_m3
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="bg-blue-900 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center text-blue-200 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={printReport}
                className="flex items-center bg-blue-700 px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </button>
              <button className="flex items-center bg-green-600 px-4 py-2 rounded-lg hover:bg-green-500">
                <Download className="h-4 w-4 mr-2" />
                PDF
              </button>
            </div>
          </div>

          <div className="text-center mt-4">
            <h1 className="text-3xl font-bold">DAILY REPORT</h1>
            <div className="flex items-center justify-center mt-2 space-x-6">
              <div className="flex items-center">
                <Ship className="h-5 w-5 mr-2" />
                <span className="text-lg">{report.vessel_name}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span className="text-lg">
                  {formatDate(report.report_date)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Distribution du temps */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Clock className="h-6 w-6 mr-2 text-blue-600" />
              Distribution des 24 heures
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {time_distribution &&
                Object.entries(time_distribution)
                  .filter(([key]) => !["total", "distance"].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-blue-800 capitalize mb-1">
                        {key.replace(/_/g, " ")}
                      </div>
                      <div className="text-2xl font-bold text-blue-900">
                        {formatNumber(value)}h
                      </div>
                    </div>
                  ))}
            </div>

            {/* <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-sm text-yellow-800 mb-1">Total heures</div>
                <div className="text-2xl font-bold text-yellow-900">
                  {calculateTotalHours(report.time_distribution)}h
                </div>
              </div>
            </div> */}

            <div className="bg-green-50 p-4 rounded-lg mt-4">
              <div className="text-sm text-green-800 mb-1">Distance</div>
              <div className="text-2xl font-bold text-green-900">
                {formatNumber(report?.distance)} NM
              </div>
            </div>
          </section>

          {/* Opérations */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-6 w-6 mr-2 text-blue-600" />
              Journal des opérations
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-3 py-2 text-left">
                      Début
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left">
                      Fin
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left">
                      Durée
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left">
                      Lieu
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left">
                      Activité
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {report.operations &&
                    filterOperationsWithActivity(report.operations).map(
                      (op, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="border border-gray-300 px-3 py-2">
                            {formatTime(op.time_from)}
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            {formatTime(op.time_to)}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 font-semibold">
                            {/* Calcul de la durée */}
                            {(() => {
                              const [startH, startM] = op.time_from
                                .split(":")
                                .map(Number);
                              const [endH, endM] = op.time_to
                                .split(":")
                                .map(Number);
                              let durationMins =
                                endH * 60 + endM - (startH * 60 + startM);
                              if (durationMins < 0) durationMins += 24 * 60;
                              return `${String(
                                Math.floor(durationMins / 60)
                              ).padStart(2, "0")}:${String(
                                durationMins % 60
                              ).padStart(2, "0")}`;
                            })()}
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            {op.location}
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            {op.activity}
                          </td>
                        </tr>
                      )
                    )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Tank Status */}
          {report?.tanks?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Package className="h-6 w-6 mr-2 text-blue-600" />
                Statut des Réservoirs
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-yellow-400">
                    <tr className="text-xs">
                      <th className="border border-gray-300 px-2 py-1">
                        Tank #
                      </th>
                      <th className="border border-gray-300 px-2 py-1">
                        Dedicated Tank
                      </th>
                      <th className="border border-gray-300 px-2 py-1">
                        Fluid Type
                      </th>
                      <th className="border border-gray-300 px-2 py-1">
                        Quantité (m³)
                      </th>
                      <th className="border border-gray-300 px-2 py-1">
                        Status
                      </th>
                      <th className="border border-gray-300 px-2 py-1">
                        Site Origine
                      </th>
                      <th className="border border-gray-300 px-2 py-1">
                        Site Destination
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.tanks.map((tank, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-blue-50" : "bg-white"}
                      >
                        <td className="border border-gray-300 bg-yellow-200 px-2 py-1 font-bold text-center">
                          {tank.tank}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-center">
                          {tank.type || "-"}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-center">
                          {tank.fluid_type || "-"}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-center">
                          {formatNumber(tank.quantity)}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-center">
                          {tank.status}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-center">
                          {tank.origin_site || "-"}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-center">
                          {tank.dest_site || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Silo Status */}
          {report?.silos?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Box className="h-6 w-6 mr-2 text-blue-600" />
                Statut des Silos
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-yellow-400">
                    <tr className="text-xs">
                      <th className="border border-gray-300 px-2 py-1">
                        Silo #
                      </th>
                      <th className="border border-gray-300 px-2 py-1">
                        Dedicated Silo
                      </th>
                      <th className="border border-gray-300 px-2 py-1">
                        Product Type
                      </th>
                      <th className="border border-gray-300 px-2 py-1">
                        Quantity (T)
                      </th>
                      <th className="border border-gray-300 px-2 py-1">
                        Status
                      </th>
                      <th className="border border-gray-300 px-2 py-1">
                        Last cleaning
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.silos.map((silo, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-blue-50" : "bg-white"}
                      >
                        <td className="border border-gray-300 bg-yellow-200 px-2 py-1 font-bold text-center">
                          {silo.silo}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-center">
                          {silo.type || "-"}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-center">
                          {silo.product || "-"}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-center">
                          {formatNumber(silo.quantity)}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-center">
                          {silo.status}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-center">
                          {silo.last_cleaning || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Fuel Transfers */}
          {fuel_transfers?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Fuel className="h-6 w-6 mr-2 text-blue-600" />
                Fuel Oil Transfers
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th
                        colSpan="3"
                        className="border border-gray-300 px-2 py-2 text-red-600 font-semibold text-center"
                      >
                        <div className="flex items-center justify-center font-bold">
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                          DISCHARGES
                        </div>
                      </th>
                      <th
                        colSpan="3"
                        className="border border-gray-300 px-2 py-2 text-green-600 font-semibold text-center"
                      >
                        <div className="flex items-center justify-center font-bold">
                          <ArrowDownLeft className="h-4 w-4 mr-1" />
                          CHARGES
                        </div>
                      </th>
                    </tr>
                    <tr className="bg-gray-50 text-gray-700 text-xs">
                      <th className="border border-gray-300 px-2 py-1 text-red-600">
                        To
                      </th>
                      <th className="border border-gray-300 px-2 py-1 text-red-600">
                        m³
                      </th>
                      <th className="border border-gray-300 px-2 py-1 text-red-600">
                        Details
                      </th>
                      <th className="border border-gray-300 px-2 py-1 text-green-600">
                        From
                      </th>
                      <th className="border border-gray-300 px-2 py-1 text-green-600">
                        m³
                      </th>
                      <th className="border border-gray-300 px-2 py-1 text-green-600">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fuel_transfers.map((transfer, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="border border-gray-300 px-2 py-1">
                          {transfer.to || "-"}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-right">
                          {transfer.to_m3 ? formatNumber(transfer.to_m3) : "-"}
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          {transfer.to_details || "-"}
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          {transfer.from || "-"}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-right">
                          {transfer.from_m3
                            ? formatNumber(transfer.from_m3)
                            : "-"}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-center">
                          {transfer.from_details || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Consommables */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Fuel className="h-6 w-6 mr-2 text-blue-600" />
              Consommables
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-900 mb-3">
                  Fuel Oil (m³)
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>À bord:</span>
                    <span className="font-semibold">
                      {formatNumber(report?.fuel_oil_rob)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reçu:</span>
                    <span className="font-semibold">
                      {formatNumber(report?.fuel_oil_received)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consommé:</span>
                    <span className="font-semibold">
                      {formatNumber(report?.fuel_oil_consumed)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">
                  Lub Oil (L)
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>À bord:</span>
                    <span className="font-semibold">
                      {formatNumber(report?.lub_oil_rob)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reçu:</span>
                    <span className="font-semibold">
                      {formatNumber(report?.lub_oil_received)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consommé:</span>
                    <span className="font-semibold">
                      {formatNumber(report?.lub_oil_consumed)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-3">
                  FW/DW (m³)
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>À bord:</span>
                    <span className="font-semibold">
                      {formatNumber(report?.fresh_water_rob)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reçu:</span>
                    <span className="font-semibold">
                      {formatNumber(report?.fresh_water_received)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consommé:</span>
                    <span className="font-semibold">
                      {formatNumber(report?.fresh_water_consumed)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Personnel */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Users className="h-6 w-6 mr-2 text-blue-600" />
              Personnel à bord
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Équipage</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {report?.crew}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Visiteurs</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {report?.visitors || 0}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total POB</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {report?.crew + report?.visitors}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Remarques */}
          {report.remarks && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Remarques générales
              </h2>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-gray-800 whitespace-pre-wrap">
                  {report.remarks}
                </p>
              </div>
            </section>
          )}

          {/* Signature */}
          <section>
            <div className="border-t-2 border-gray-300 pt-4 mt-6">
              <div className="text-sm text-gray-600">Préparé par:</div>
              <div className="text-lg font-semibold text-gray-900">
                {report.prepared_by || "Non spécifié"}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Date de création:{" "}
                {new Date(report.report_date).toLocaleDateString("fr-FR")}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Modifié le:{" "}
                {new Date(report.update_at).toLocaleDateString("fr-FR")}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
