import React from 'react'
import { Settings, Calendar, AlertTriangle, CheckCircle, Clock, FileText } from 'lucide-react'

export default function MaintenanceNavire() {
  const ship = "BL212"

  if (!ship) {
    return <div>Erreur: Aucun navire connecté</div>
  }

  const getMaintenanceStatusColor = (status) => {
    const colors = {
      'good': 'bg-green-100 text-green-800',
      'warning': 'bg-yellow-100 text-yellow-800',
      'critical': 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getMaintenanceStatusIcon = (status) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-6 w-6 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />
      case 'critical':
        return <AlertTriangle className="h-6 w-6 text-red-600" />
      default:
        return <Clock className="h-6 w-6 text-gray-600" />
    }
  }

  const getMaintenanceStatusLabel = (status) => {
    const labels = {
      'good': 'Bon état',
      'warning': 'Attention requise',
      'critical': 'Maintenance urgente'
    }
    return labels[status] || status
  }

  const daysSinceLastMaintenance = Math.floor(
    (new Date().getTime() - new Date("2024-11-15T00:00:00Z").getTime()) / (1000 * 60 * 60 * 24)
  )

  const daysUntilNextMaintenance = Math.floor(
    (new Date("2025-02-15T00:00:00Z").getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  // Données fictives pour les équipements
  const equipmentStatus = [
    { name: 'Moteur principal', status: 'good', lastCheck: '2024-12-10', nextCheck: '2025-01-10' },
    { name: 'Système de navigation', status: 'good', lastCheck: '2024-12-05', nextCheck: '2025-01-05' },
    { name: 'Système de communication', status: 'warning', lastCheck: '2024-11-20', nextCheck: '2024-12-20' },
    { name: 'Système de sécurité', status: 'good', lastCheck: '2024-12-01', nextCheck: '2025-01-01' },
    { name: 'Pompes de cargaison', status: 'critical', lastCheck: '2024-10-15', nextCheck: '2024-12-15' },
    { name: 'Système électrique', status: 'good', lastCheck: '2024-12-08', nextCheck: '2025-01-08' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Maintenance du Navire</h1>
        <p className="text-gray-600 mt-2">BL212 - Suivi de la maintenance et des équipements</p>
      </div>

      {/* Status Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">État général de maintenance</h3>
          <div className="flex items-center">
            {getMaintenanceStatusIcon("good")}
            <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${getMaintenanceStatusColor('good')}`}>
              {getMaintenanceStatusLabel('good')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Dernière maintenance</p>
            <p className="text-lg font-bold text-gray-900">
              {new Date("2024-11-15T00:00:00Z").toLocaleDateString('fr-FR')}
            </p>
            <p className="text-xs text-gray-500">Il y a {daysSinceLastMaintenance} jours</p>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Prochaine maintenance</p>
            <p className="text-lg font-bold text-gray-900">
              {new Date("2025-02-15T00:00:00Z").toLocaleDateString('fr-FR')}
            </p>
            <p className={`text-xs ${daysUntilNextMaintenance < 30 ? 'text-red-500' : 'text-gray-500'}`}>
              Dans {daysUntilNextMaintenance} jours
            </p>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Settings className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Équipements OK</p>
            <p className="text-lg font-bold text-gray-900">
              {equipmentStatus.filter(eq => eq.status === 'good').length}/{equipmentStatus.length}
            </p>
            <p className="text-xs text-gray-500">
              {Math.round((equipmentStatus.filter(eq => eq.status === 'good').length / equipmentStatus.length) * 100)}% opérationnels
            </p>
          </div>
        </div>
      </div>

      {/* Equipment Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">État des équipements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {equipmentStatus.map((equipment, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{equipment.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getMaintenanceStatusColor(equipment.status)}`}>
                  {getMaintenanceStatusLabel(equipment.status)}
                </span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Dernière vérification: {new Date(equipment.lastCheck).toLocaleDateString('fr-FR')}</p>
                <p>Prochaine vérification: {new Date(equipment.nextCheck).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documents and Certificates */}
      {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents et certificats</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <FileText className="h-5 w-5 text-blue-600 mr-2" />
              Certificats
            </h4>
            <div className="space-y-2">
              {ship.documents.certificates.map((cert, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">{cert}</span>
                  <span className="text-xs text-green-600 font-medium">Valide</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <FileText className="h-5 w-5 text-green-600 mr-2" />
              Permis et autorisations
            </h4>
            <div className="space-y-2">
              {ship.documents.permits.map((permit, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">{permit}</span>
                  <span className="text-xs text-green-600 font-medium">Valide</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div> */}

      {/* Maintenance History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique de maintenance</h3>
        <div className="space-y-4">
          {[
            {
              date: '2024-12-10',
              type: 'Maintenance préventive',
              description: 'Vérification complète du moteur principal',
              status: 'Terminé',
              technician: 'Jean Dupont'
            },
            {
              date: '2024-11-15',
              type: 'Réparation',
              description: 'Remplacement des filtres à carburant',
              status: 'Terminé',
              technician: 'Marie Martin'
            },
            {
              date: '2024-10-20',
              type: 'Inspection',
              description: 'Contrôle de sécurité annuel',
              status: 'Terminé',
              technician: 'Pierre Durand'
            }
          ].map((maintenance, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-green-500 rounded-full mr-3"></div>
                  <h4 className="font-medium text-gray-900">{maintenance.type}</h4>
                </div>
                <span className="text-sm text-gray-500">{new Date(maintenance.date).toLocaleDateString('fr-FR')}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{maintenance.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Technicien: {maintenance.technician}</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">{maintenance.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      {"bad" !== 'good' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
            <div>
              <h4 className="font-medium text-yellow-800">Attention requise</h4>
              <p className="text-sm text-yellow-700 mt-1">
                {"bad" === 'critical' 
                  ? 'Une maintenance urgente est requise. Contactez immédiatement l\'équipe technique.'
                  : 'Certains équipements nécessitent une attention particulière lors de la prochaine maintenance.'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}