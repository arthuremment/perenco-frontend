import { useState } from 'react';
import { 
  Plus,Trash2, Download as DownloadIcon,
  FileText, Eye
} from 'lucide-react';

const ReportsManagement = ({ reports, ships, onViewReport, onExportReport }) => {
  const [filters, setFilters] = useState({
    ship: '',
    dateFrom: '',
    dateTo: '',
    type: ''
  });

  const filteredReports = Object.values(reports).filter(report => {
    return (
      (!filters.ship || report.ship_id === filters.ship) &&
      (!filters.dateFrom || report.date >= filters.dateFrom) &&
      (!filters.dateTo || report.date <= filters.dateTo) &&
      (!filters.type || report.type === filters.type)
    );
  });

  //console.log(filteredReports)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Rapports</h2>
        {/* <button className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau rapport
        </button> */}
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Navire</label>
            <select 
              className="w-full border-gray-300 rounded-md p-2 border"
              value={filters.ship}
              onChange={(e) => setFilters({...filters, ship: e.target.value})}
            >
              <option value="">Tous les navires</option>
              {ships.map(ship => (
                <option key={ship.id} value={ship.id}>{ship.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
            <input
              type="date"
              className="w-full border-gray-300 rounded-md p-2 border"
              value={filters.dateFrom}
              onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
            <input
              type="date"
              className="w-full border-gray-300 rounded-md p-2 border"
              value={filters.dateTo}
              onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select 
              className="w-full border-gray-300 rounded-md p-2 border"
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
            >
              <option value="">Tous les types</option>
              <option value="fuel">Fuel</option>
              <option value="cargo">Cargaison</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tableau des rapports */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Navire</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 tracking-wider"><span className='uppercase'>Gasoil Reçu</span> (m³)</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 tracking-wider"><span className='uppercase'>Gasoil Livré</span> (m³)</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 tracking-wider"><span className='uppercase'>ROB</span> (m³)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReports.map(report => {
              const ship = ships.find(s => s.id === report.ship_id);
              return (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(report.report_date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">
                    {ship?.name || 'Navire inconnu'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {report.type || 'Fuel'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-green-600">
                    + {parseFloat(report.fuel_oil_received || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-red-600">
                    - {parseFloat(report.fuel_oil_delivered || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                    {parseFloat(report.fuel_oil_rob || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => onViewReport(report)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onExportReport(report)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <DownloadIcon className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No reports match your filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsManagement;