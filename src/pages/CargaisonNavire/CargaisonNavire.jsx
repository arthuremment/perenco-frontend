import React, { useState } from 'react'
import { Package, Plus, Upload, Download, Weight, Box } from 'lucide-react'

export default function ShipCargo() {
  const ship = "BL212"
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    operation_type: 'loading',
    product_type: '',
    quantity: '',
    weight: '',
    destination: '',
    notes: ''
  })

  if (!ship) {
    return <div>Erreur: Aucun navire connecté</div>
  }

  const cargoOperations = [{
    id: '1',
    shipId: '1',
    date: '2024-12-14',
    operation_type: 'loading',
    product_type: 'Pétrole brut',
    quantity: 52000,
    weight: 45000,
    destination: 'Raffinerie de Limbe',
    notes: 'Chargement complet - qualité vérifiée'
  }]

  const handleSubmit = (e) => {
    e.preventDefault()
    // Ici on ajouterait normalement l'opération à la base de données
    console.log('Nouvelle opération cargaison:', formData)
    setShowAddForm(false)
    setFormData({
      date: new Date().toISOString().split('T')[0],
      operation_type: 'loading',
      product_type: '',
      quantity: '',
      weight: '',
      destination: '',
      notes: ''
    })
  }

  const cargoPercentage = 45000 > 0 ? (45000 / 50000) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion de la Cargaison</h1>
          <p className="text-gray-600 mt-2">BL212 - Suivi des chargements et déchargements</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter une opération
        </button>
      </div>

      {/* Current Cargo Status */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-semibold mb-4">État actuel de la cargaison</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-green-100 text-sm">Type de cargaison</p>
            <p className="text-xl font-bold">{"Pétrole brut" || 'Aucune cargaison'}</p>
          </div>
          <div>
            <p className="text-green-100 text-sm">Poids total</p>
            <p className="text-xl font-bold">45000 tonnes</p>
          </div>
          <div>
            <p className="text-green-100 text-sm">Volume</p>
            <p className="text-xl font-bold">52000 m³</p>
          </div>
        </div>
        {['Pétrole brut Bonny Light', 'Condensat'].length > 0 && (
          <div className="mt-4">
            <p className="text-green-100 text-sm mb-2">Produits transportés</p>
            <div className="flex flex-wrap gap-2">
              {['Pétrole brut Bonny Light', 'Condensat'].map((product, index) => (
                <span key={index} className="bg-white/20 bg-opacity-20 text-white text-sm px-3 py-1 rounded-full">
                  {product}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="mt-4">
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="h-3 rounded-full bg-white"
              style={{ width: `${cargoPercentage}%` }}
            ></div>
          </div>
          <p className="text-green-100 text-sm mt-1">{cargoPercentage.toFixed(1)}% de la capacité de charge</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Poids actuel</p>
              <p className="text-2xl font-bold text-gray-900">45000</p>
              <p className="text-xs text-gray-500">tonnes</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Weight className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Volume actuel</p>
              <p className="text-2xl font-bold text-gray-900">50000</p>
              <p className="text-xs text-gray-500">m³</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Box className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Chargements</p>
              <p className="text-2xl font-bold text-gray-900">
                {cargoOperations.filter(op => op.operation_type === 'loading').length}
              </p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Upload className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Déchargements</p>
              <p className="text-2xl font-bold text-gray-900">
                {cargoOperations.filter(op => op.operation_type === 'unloading').length}
              </p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Download className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter une opération de cargaison</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type d'opération</label>
              <select
                value={formData.operation_type}
                onChange={(e) => setFormData({ ...formData, operation_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="loading">Chargement</option>
                <option value="unloading">Déchargement</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type de produit</label>
              <input
                type="text"
                required
                value={formData.product_type}
                onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: Pétrole brut, Équipements industriels..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantité (m³)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Poids (tonnes)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Destination/Origine</label>
              <input
                type="text"
                required
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: Terminal pétrolier, Zone industrielle..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
                placeholder="Observations, remarques..."
              />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
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

      {/* Cargo Operations History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Historique des opérations de cargaison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Opération
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Poids
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destination
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cargoOperations.map((operation) => (
                <tr key={operation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(operation.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {operation.operation_type === 'loading' ? (
                        <Upload className="h-4 w-4 text-green-600 mr-2" />
                      ) : (
                        <Download className="h-4 w-4 text-red-600 mr-2" />
                      )}
                      <span className={`text-sm font-medium ${
                        operation.operation_type === 'loading' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {operation.operation_type === 'loading' ? 'Chargement' : 'Déchargement'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {operation.product_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {operation.quantity.toLocaleString()} m³
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {operation.weight.toLocaleString()} T
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {operation.destination}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {operation.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {cargoOperations.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune opération</h3>
            <p className="mt-1 text-sm text-gray-500">
              Commencez par ajouter une opération de cargaison.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}