// components/ShipFormModal.jsx
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ShipFormModal = ({ isOpen, onClose, onSubmit, initialData, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    captain: '',
    username: '',
    password: '',
    status: true,
    crew: '',
    small_name: '',
    position: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        type: initialData.type || '',
        captain: initialData.captain || '',
        username: initialData.username || '',
        password: initialData.password || '',
        status: true,
        crew: initialData.crew || '',
        small_name: initialData.small_name || '',
        position: initialData.position || ''
      });
    } else {
      setFormData({
        name: '',
        type: '',
        captain: '',
        username: '',
        password: '',
        status: true,
        crew: '',
        small_name: '',
        position: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Nom requis';
    if (!formData.type) newErrors.type = 'Type requis';
    if (!formData.captain) newErrors.captain = 'Capitaine requis';
    if (!formData.username) newErrors.username = "Nom d'utilisateur requis";
    if (!initialData && !formData.password) newErrors.password = 'Mot de passe requis';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {initialData ? 'Modifier le navire' : 'Nouveau navire'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.type ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Sélectionner un type</option>
              <option value="PETROLIER">Pétrolier</option>
              <option value="CARGO">Cargo</option>
              <option value="TANKER">Tanker</option>
              <option value="REMORQUEUR">Remorqueur</option>
            </select>
            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capitaine *</label>
            <input
              type="text"
              name="captain"
              value={formData.captain}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.captain ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.captain && <p className="text-red-500 text-xs mt-1">{errors.captain}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {initialData ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe *'}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Équipage</label>
            <input
              type="number"
              name="crew"
              value={formData.crew}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom abrégé</label>
            <input
              type="text"
              name="small_name"
              value={formData.small_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Ex: 45.123,-12.456"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? 'En cours...' : (initialData ? 'Modifier' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShipFormModal;