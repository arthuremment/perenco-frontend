import { useState } from 'react';
import { 
   Download as DownloadIcon, BarChart2, PieChart
} from 'lucide-react';

const Analytics = ({ reports, ships }) => {
  const [selectedMetric, setSelectedMetric] = useState('fuel_consumption');
  const [timeRange, setTimeRange] = useState('30days');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytique et Statistiques</h2>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <select 
              className="border-gray-300 rounded-md p-2 border"
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
            >
              <option value="fuel_consumption">Consommation de fuel</option>
              <option value="fuel_received">Fuel reçu</option>
              <option value="operations">Opérations</option>
              <option value="rob">ROB moyen</option>
            </select>
            <select 
              className="border-gray-300 rounded-md p-2 border"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="7days">7 derniers jours</option>
              <option value="30days">30 derniers jours</option>
              <option value="90days">90 derniers jours</option>
              <option value="year">Cette année</option>
            </select>
          </div>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Exporter les données
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-4 h-80 flex items-center justify-center">
            <BarChart2 className="h-16 w-16 text-gray-300" />
            <span className="ml-2 text-gray-500">Graphique des tendances</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 h-80 flex items-center justify-center">
            <PieChart className="h-16 w-16 text-gray-300" />
            <span className="ml-2 text-gray-500">Répartition par navire</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-800">Top navires (consommation)</h3>
            <ul className="mt-2 space-y-2">
              {ships.slice(0, 5).map(ship => (
                <li key={ship.id} className="flex justify-between text-sm">
                  <span>{ship.name}</span>
                  <span className="font-medium">1,245 m³</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-green-800">Top opérations</h3>
            <ul className="mt-2 space-y-2">
              <li className="flex justify-between text-sm">
                <span>Transferts fuel</span>
                <span className="font-medium">124</span>
              </li>
              <li className="flex justify-between text-sm">
                <span>Maintenance</span>
                <span className="font-medium">87</span>
              </li>
              <li className="flex justify-between text-sm">
                <span>Chargement cargo</span>
                <span className="font-medium">56</span>
              </li>
            </ul>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-orange-800">Alertes et notifications</h3>
            <ul className="mt-2 space-y-2">
              <li className="text-sm text-orange-700">3 navires avec ROB critique</li>
              <li className="text-sm text-orange-700">2 rapports en attente de validation</li>
              <li className="text-sm text-orange-700">1 navire nécessite maintenance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;