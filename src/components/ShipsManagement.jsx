import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Download as DownloadIcon,
  List,
  Grid,
  Eye,
  ShipIcon,
} from "lucide-react";

import { useShipsStore } from "../store/ships";
import ShipFormModal from "./ShipFormModal";

const ShipsManagement = () => {
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShip, setEditingShip] = useState(null);

  const {
    ships,
    loading,
    error,
    fetchShips,
    createShip,
    updateShip,
    deleteShip,
  } = useShipsStore();

  useEffect(() => {
    fetchShips();
  }, [fetchShips]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-EN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCreateShip = () => {
    setEditingShip(null);
    setIsModalOpen(true);
  };

  const handleEditShip = (ship) => {
    setEditingShip(ship);
    setIsModalOpen(true);
  };

  const handleDeleteShip = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce navire ?")) {
      try {
        await deleteShip(id);
      } catch (error) {
        alert(`Erreur lors de la suppression: ${error.message}`);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingShip) {
        await updateShip(editingShip.id, formData);
      } else {
        await createShip(formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erreur:", error);
      // L'erreur est déjà gérée dans le store
    }
  };

  if (loading && ships.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Erreur! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Gestion des Navires
        </h2>
        <div className="flex space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md ${
                viewMode === "grid" ? "bg-white shadow-sm" : "text-gray-500"
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md ${
                viewMode === "list" ? "bg-white shadow-sm" : "text-gray-500"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <button 
            onClick={handleCreateShip}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau navire
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ships.map((ship) => (
            <div key={ship.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShipIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEditShip(ship)}
                    className="text-orange-600 hover:text-orange-800"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDeleteShip(ship.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900">{ship.name}</h3>
              <p className="text-sm text-gray-500 capitalize">{ship.type}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Login</p>
                  <p className="text-sm font-medium">
                    {ship.username}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Password</p>
                  <p className="text-sm font-medium">{ship.password}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Master</p>
                  <p className="text-sm font-medium capitalize">
                    {ship.captain}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="text-sm font-medium">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        ship.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {(ship.status = true ? "Active" : "Inactive")}
                    </span>
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Crew</p>
                  <p className="text-sm font-medium">{ship.crew}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last login</p>
                  <p className="text-sm font-medium">
                    {formatDate(ship.last_login)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Master
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ships.map((ship) => (
                <tr key={ship.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 uppercase">
                    {ship.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {ship.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {ship.captain}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        ship.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {(ship.status = true ? "Actif" : "Inactif")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEditShip(ship)}
                        className="text-orange-600 hover:text-orange-800"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteShip(ship.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ShipFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingShip}
        loading={loading}
      />
    </div>
  );
};

export default ShipsManagement;
