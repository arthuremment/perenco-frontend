import { useState, useEffect } from 'react';
import { 
  Search, Calendar, Filter, Download, Eye, Edit, 
  Ship, Clock, Fuel, Package, Users, FileText,
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp
} from 'lucide-react';
import { toast } from 'react-toastify';

import { useReportsStore } from '../../store/reports';
import { useShipsStore } from '../../store/ships';
import OperationalReportView from '../../components/OperationalReportView';
import { formatNumber } from '../../utils/formatNumber'
import { filterOperationsWithActivity } from '../../utils/filterOperations';

export default function OperationalReportsList() {
  const { reports, loading, error, fetchShipReports, clearErrors } = useReportsStore();
  const { currentShip } = useShipsStore();
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const [filters, setFilters] = useState({
    search: '',
    startDate: '',
    endDate: '',
    sortBy: 'report_date',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const [expandedReports, setExpandedReports] = useState(new Set());

  useEffect(() => {
    loadReports();
  }, [pagination.page, filters.sortBy, filters.sortOrder]);

  //console.log(reports)

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
  }, [error]);

  const loadReports = async () => {
    try {
      const response = await fetchShipReports(
        currentShip.id, 
        pagination.page, 
        pagination.limit
      );
      
      setPagination(prev => ({
        ...prev,
        //total: response.data.pagination.total,
        total: 1,
        //pages: response.data.pagination.pages
        pages: 1
      }));
    } catch (err) {
      console.error('Erreur chargement rapports:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    loadReports();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      startDate: '',
      endDate: '',
      sortBy: 'report_date',
      sortOrder: 'desc'
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const toggleExpandReport = (reportId) => {
    const newExpanded = new Set(expandedReports);
    if (newExpanded.has(reportId)) {
      newExpanded.delete(reportId);
    } else {
      newExpanded.add(reportId);
    }
    setExpandedReports(newExpanded);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const calculateTotalHours = (timeDistribution) => {
    if (!timeDistribution) return 0;
    return Object.entries(timeDistribution)
      .filter(([key]) => !['total', 'distance'].includes(key))
      .reduce((sum, [_, value]) => sum + (parseFloat(value) || 0), 0);
  };

  const exportToCSV = () => {
    // Implémentation simplifiée d'export CSV
    const headers = ['Date', 'Navire', 'Heures Total', 'Distance (NM)', 'Préparé par'];
    const csvData = reports.map(report => [
      formatDate(report.report_date),
      report.vessel_name || currentShip.name,
      calculateTotalHours(report.time_distribution),
      report.time_distribution?.distance || 0,
      report.report_prepared_by || 'Non spécifié'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rapports-operations-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success('Export CSV généré avec succès');
  };

  if (viewMode === 'detail' && selectedReport) {
    return (
      <OperationalReportView 
        report={selectedReport} 
        onBack={() => setViewMode('list')}
      />
    );
  }

  if (loading && reports.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <FileText className="h-8 w-8 mr-3 text-blue-600" />
                Report History
              </h1>
              <p className="text-gray-600 mt-1">
                View and manage daily reports from the {currentShip.name}
              </p>
            </div>
            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
            >
              <Download className="h-5 w-5 mr-2" />
              Export CSV
            </button>
          </div>

          {/* Filtres */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search..."
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-end space-x-2">
              <button
                onClick={applyFilters}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                Apply
              </button>
              <button
                onClick={clearFilters}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Liste des rapports */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {reports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No reports found
              </h3>
              <p className="text-gray-600">
                {filters.search || filters.startDate || filters.endDate
                  ? "No reports have been created yet."
                  : "No reports match the search criteria."}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Distance (NM)
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gasoil Used (L)
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gasoil Received (L)
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gasoil Delivered (L)
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reports.map((report) => (
                      <>
                        <tr key={report.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {formatDate(report.report_date)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-sm text-gray-900">
                              {formatNumber(report?.distance) || 0}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-sm text-gray-900">
                              {formatNumber(report.fuel_oil_consumed)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-sm text-gray-900">
                              {formatNumber(report.fuel_oil_received )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-sm text-gray-900">
                              {formatNumber(report.fuel_oil_delivered)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-sm text-gray-900">
                              {report.location || "WOURI"} 
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => toggleExpandReport(report.id)}
                                className="text-blue-600 hover:text-blue-800 p-1"
                                title="Détails"
                              >
                                {expandedReports.has(report.id) ? (
                                  <ChevronUp className="h-5 w-5" />
                                ) : (
                                  <ChevronDown className="h-5 w-5" />
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedReport(report);
                                  setViewMode('detail');
                                }}
                                className="text-green-600 hover:text-green-800 p-1"
                                title="Voir en détail"
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedReports.has(report.id) && (
                          <tr>
                            <td colSpan="7" className="px-6 py-4 bg-gray-50">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-15 text-sm">
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2 text-center">
                                    <Clock className="h-4 w-4 inline mr-2" />
                                    Operations
                                  </h4>
                                  {report.operations && report.operations.length > 0 && (
                                    <div className="space-y-2">
                                        {filterOperationsWithActivity(report.operations).map((operation, index) => (
                                        <div key={index} className="border-b border-gray-200 pb-2 last:border-b-0">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 font-medium">Operation {index + 1}</span>
                                                <span className="text-gray-500">
                                                    {operation?.time_from} - {operation?.time_to}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium text-gray-600 ">Location:</span>
                                                <span className="text-gray-500">{operation?.location}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium text-gray-600 ">Activity:</span>
                                                <span className="text-gray-500">{operation?.activity}</span>
                                            </div>
                                            {/* {operation.remarks != "" && (
                                            <div className="text-sm text-gray-500 italic">
                                                {operation?.remarks}
                                            </div>
                                            )} */}
                                        </div>
                                        ))}
                                    </div>
                                    )}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2 text-center">
                                    <Fuel className="h-4 w-4 inline mr-2" />
                                    Fuel & Lub Oil Onboard
                                  </h4>
                                  {report && (
                                    <div className="space-y-1">
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Fuel oil:</span>
                                        <span className="font-medium">
                                          {formatNumber(report.fuel_oil_rob)} m³
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Lub oil:</span>
                                        <span className="font-medium">
                                          {formatNumber(report.lub_oil_rob)} L
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">FW / DW:</span>
                                        <span className="font-medium">
                                          {formatNumber(report.fresh_water_rob)} m³
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2 text-center">
                                    <Users className="h-4 w-4 inline mr-2" />
                                    POB
                                  </h4>
                                  {report && (
                                    <div className="space-y-1">
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Crew:</span>
                                        <span className="font-medium">{report.crew}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Visitors:</span>
                                        <span className="font-medium">{report.visitors}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Total POB:</span>
                                        <span className="font-medium">
                                          {(report.crew) + (report.visitors)}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Affichage de {((pagination.page - 1) * pagination.limit) + 1} à{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} sur{' '}
                  {pagination.total} rapports
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  
                  <span className="text-sm text-gray-700">
                    Page {pagination.page} sur {pagination.pages || 1}
                  </span>
                  
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page >= (pagination.pages || 1)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}