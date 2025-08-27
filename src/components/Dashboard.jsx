import { useState, useMemo } from "react";
import {
  Ship,
  Activity,
  Clipboard,
  Calendar,
  Download,
  Zap,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

import TrendIndicator from "./TrendIndicator";

const Dashboard = ({ reports = [], ships = [] }) => {
  const [timeRange, setTimeRange] = useState("30days");

  //console.log(reports)

  // Préparation des données pour les graphiques basées sur les rapports réels
  const chartData = useMemo(() => {
    if (!reports.length) return [];

    return (
      reports
        //.slice(-10) // Prendre les 10 derniers rapports
        .map((report) => ({
          date: new Date(report.report_date).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
          }),
          fuelConsumed: parseFloat(report.fuel_oil_consumed || 0),
          fuelReceived: parseFloat(report.fuel_oil_received || 0),
          fuelDelivered: parseFloat(report.fuel_oil_delivered || 0),
          fuelROB: parseFloat(report.fuel_oil_rob || 0),
          sailingEco: parseFloat(report.sailing_eco || 0),
          sailingFull: parseFloat(report.sailing_full || 0),
          cargoOps: parseFloat(report.cargo_ops || 0),
          liftingOps: parseFloat(report.lifting_ops || 0),
          distance: parseFloat(report.distance || 0),
        }))
    );
  }, [reports]);

  // Données pour la répartition des opérations
  const operationsData = useMemo(() => {
    if (!reports.length) return [];

    const totalReports = reports.length;
    const operationsSummary = reports.reduce(
      (acc, report) => ({
        sailingEco: acc.sailingEco + parseFloat(report.sailing_eco || 0),
        sailingFull: acc.sailingFull + parseFloat(report.sailing_full || 0),
        cargoOps: acc.cargoOps + parseFloat(report.cargo_ops || 0),
        liftingOps: acc.liftingOps + parseFloat(report.lifting_ops || 0),
        standby:
          acc.standby +
          parseFloat(report.standby_offshore || 0) +
          parseFloat(report.standby_port || 0) +
          parseFloat(report.standby_anchorage || 0),
        downtime: acc.downtime + parseFloat(report.downtime || 0),
      }),
      {
        sailingEco: 0,
        sailingFull: 0,
        cargoOps: 0,
        liftingOps: 0,
        standby: 0,
        downtime: 0,
      }
    );

    return [
      { name: "Sailing Eco Speed", value: operationsSummary.sailingEco },
      { name: "Sailing Full Speed", value: operationsSummary.sailingFull },
      { name: "Cargo Ops", value: operationsSummary.cargoOps },
      { name: "Lifting Ops", value: operationsSummary.liftingOps },
      { name: "Standby", value: operationsSummary.standby },
      { name: "Downtime", value: operationsSummary.downtime },
    ].filter((item) => item.value > 0);
  }, [reports]);

  // Données pour la consommation de fuel par navire
  const fuelByShipData = useMemo(() => {
    if (!reports.length || !ships.length) return [];

    const fuelConsumptionByShip = {};

    reports.forEach((report) => {
      const shipId = report.ship_id;
      const ship = ships.find((s) => s.id === shipId);
      const shipName = ship ? ship.small_name : `Ship ${shipId}`;

      if (!fuelConsumptionByShip[shipName]) {
        fuelConsumptionByShip[shipName] = 0;
      }

      fuelConsumptionByShip[shipName] += parseFloat(
        report.fuel_oil_consumed || 0
      );
    });

    return Object.entries(fuelConsumptionByShip)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [reports, ships]);

  // Statistiques calculées à partir des données réelles
  const stats = useMemo(() => {
    const totalFuelConsumed = reports.reduce(
      (acc, report) => acc + parseFloat(report.fuel_oil_consumed || 0),
      0
    );

    const totalFuelReceived = reports.reduce(
      (acc, report) => acc + parseFloat(report.fuel_oil_received || 0),
      0
    );

    const totalFuelDelivered = reports.reduce(
      (acc, report) => acc + parseFloat(report.fuel_oil_delivered || 0),
      0
    );

    const avgFuelEfficiency = reports.length
      ? totalFuelConsumed /
        reports.reduce(
          (acc, report) => acc + parseFloat(report.distance || 0),
          0
        )
      : 0;

    return {
      totalShips: ships.length,
      totalReports: reports.length,
      totalFuelConsumed,
      totalFuelReceived,
      totalFuelDelivered,
      avgFuelEfficiency: avgFuelEfficiency || 0,
      activeShips: new Set(reports.map((r) => r.ship_id)).size,
      avgROB: reports.length
        ? reports.reduce(
            (acc, report) => acc + parseFloat(report.fuel_oil_rob || 0),
            0
          ) / reports.length
        : 0,
    };
  }, [reports, ships]);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#F9A826",
    "#6A5ACD",
    "#FFA07A",
  ];

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-md">
          <p className="text-gray-700 font-medium">{`Date: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Tooltip pour les graphiques circulaires
  const SimpleTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-md">
          <p className="text-gray-700 font-medium">{`${
            payload[0].name
          }: ${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  const trends = useMemo(() => {
    if (reports.length < 2) return {};

    // Séparer les données en période actuelle et précédente
    const sortedReports = [...reports].sort(
      (a, b) => new Date(b.report_date) - new Date(a.report_date)
    );

    const currentPeriod = sortedReports.slice(
      0,
      Math.floor(sortedReports.length / 2)
    );
    const previousPeriod = sortedReports.slice(
      Math.floor(sortedReports.length / 2)
    );

    const calculatePeriodStats = (period) => ({
      fuelConsumed: period.reduce(
        (acc, report) => acc + parseFloat(report.fuel_oil_consumed || 0),
        0
      ),
      fuelReceived: period.reduce(
        (acc, report) => acc + parseFloat(report.fuel_oil_received || 0),
        0
      ),
      fuelDelivered: period.reduce(
        (acc, report) => acc + parseFloat(report.fuel_oil_delivered || 0),
        0
      ),
      totalDistance: period.reduce(
        (acc, report) => acc + parseFloat(report.distance || 0),
        0
      ),
      totalROB: period.reduce(
        (acc, report) => acc + parseFloat(report.fuel_oil_rob || 0),
        0
      ),
    });

    const currentStats = calculatePeriodStats(currentPeriod);
    const previousStats = calculatePeriodStats(previousPeriod);

    const currentEfficiency =
      currentStats.totalDistance > 0
        ? currentStats.fuelConsumed / currentStats.totalDistance
        : 0;

    const previousEfficiency =
      previousStats.totalDistance > 0
        ? previousStats.fuelConsumed / previousStats.totalDistance
        : 0;

    const avgROBCurrent = currentPeriod.length
      ? currentStats.totalROB / currentPeriod.length
      : 0;
    const avgROBPrevious = previousPeriod.length
      ? previousStats.totalROB / previousPeriod.length
      : 0;

    return {
      fuelConsumed: {
        current: currentStats.fuelConsumed,
        previous: previousStats.fuelConsumed,
      },
      fuelReceived: {
        current: currentStats.fuelReceived,
        previous: previousStats.fuelReceived,
      },
      fuelDelivered: {
        current: currentStats.fuelDelivered,
        previous: previousStats.fuelDelivered,
      },
      efficiency: {
        current: currentEfficiency,
        previous: previousEfficiency,
      },
      rob: {
        current: avgROBCurrent,
        previous: avgROBPrevious,
      },
    };
  }, [reports]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Tableau de Bord</h2>
        <div className="flex space-x-4">
          <select
            className="border-gray-300 rounded-md p-2 border text-sm"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7days">7 derniers jours</option>
            <option value="30days">30 derniers jours</option>
            <option value="90days">90 derniers jours</option>
            <option value="year">Cette année</option>
          </select>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center text-sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Ship className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Navires</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalShips}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Clipboard className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rapports</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalReports}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Navires actifs
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.activeShips}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Efficacité Moyenne
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.avgFuelEfficiency.toFixed(2)} L/km
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consommation de fuel dans le temps */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Consommation de Fuel dans le Temps
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="fuelConsumed"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                  name="Consommé (L)"
                />
                <Area
                  type="monotone"
                  dataKey="fuelReceived"
                  stackId="2"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.6}
                  name="Reçu (L)"
                />
                <Area
                  type="monotone"
                  dataKey="fuelDelivered"
                  stackId="3"
                  stroke="#ffc658"
                  fill="#ffc658"
                  fillOpacity={0.6}
                  name="Livré (L)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Répartition des types d'opérations */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Répartition des Types d'Opérations
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={operationsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {operationsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<SimpleTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Consommation par navire */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Consommation de Fuel par Navire
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={fuelByShipData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Fuel Consommé (L)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Évolution du ROB */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Évolution du ROB (Remaining On Board)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="fuelROB"
                  stroke="#ff8042"
                  strokeWidth={2}
                  name="ROB (L)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tableau des statistiques détaillées avec tendances réelles */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Statistiques Globales
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Mise à jour: {new Date().toLocaleDateString("fr-FR")}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Métrique
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valeur Actuelle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tendance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Fuel Total Consommé
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {stats.totalFuelConsumed.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Litres
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <TrendIndicator
                    currentValue={trends.fuelConsumed?.current || 0}
                    previousValue={trends.fuelConsumed?.previous || 0}
                  />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Fuel Total Reçu
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {stats.totalFuelReceived.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Litres
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <TrendIndicator
                    currentValue={trends.fuelReceived?.current || 0}
                    previousValue={trends.fuelReceived?.previous || 0}
                  />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Fuel Total Livré
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {stats.totalFuelDelivered.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Litres
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <TrendIndicator
                    currentValue={trends.fuelDelivered?.current || 0}
                    previousValue={trends.fuelDelivered?.previous || 0}
                  />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Efficacité Moyenne
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {stats.avgFuelEfficiency.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  L/km
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <TrendIndicator
                    currentValue={trends.efficiency?.current || 0}
                    previousValue={trends.efficiency?.previous || 0}
                  />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ROB Moyen
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {stats.avgROB.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Litres
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <TrendIndicator
                    currentValue={trends.rob?.current || 0}
                    previousValue={trends.rob?.previous || 0}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
