// store/operationalReports.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../utils/api"

//Fonction pour formater les messages d'erreur
const formatErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.data?.errors) {
    // Gestion des erreurs de validation
    const validationErrors = error.response.data.errors;
    return validationErrors.map(err => `${err.msg} (${err.path})`).join(', ');
  }
  
  if (error.code === 'NETWORK_ERROR') {
    return "Problème de connexion réseau. Vérifiez votre connexion internet.";
  }
  
  if (error.code === 'ECONNABORTED') {
    return "La requête a pris trop de temps. Veuillez réessayer.";
  }
  
  if (error.response?.status === 401) {
    return "Session expirée. Veuillez vous reconnecter.";
  }
  
  if (error.response?.status === 403) {
    return "Accès refusé. Vous n'avez pas les permissions nécessaires.";
  }
  
  if (error.response?.status === 404) {
    return "Ressource non trouvée.";
  }
  
  if (error.response?.status >= 500) {
    return "Erreur serveur. Veuillez réessayer plus tard.";
  }
  
  return error.message || "Une erreur inattendue s'est produite.";
};

export const useReportsStore = create(
  persist(
    (set, get) => ({
      currentReport: null,
      reports: [],
      allReports: [],
      loading: false,
      error: null,
      validationErrors: {},

      // Réinitialiser les erreurs
      clearErrors: () => set({ error: null, validationErrors: {} }),

      // Créer un nouveau rapport opérationnel
      createReport: async (reportData, showToast = true) => {
        set({ loading: true, error: null, validationErrors: {} });
        try {
          const response = await api.post("/reports", reportData);
          set({ loading: false });

          if (showToast) {
            // Le toast sera géré dans le composant pour plus de contrôle
          }

          return response.data;
        } catch (error) {
          const errorMessage = formatErrorMessage(error);
          
          // Extraire les erreurs de validation détaillées
          let validationErrors = {};
          if (error.response?.data?.errors) {
            validationErrors = error.response.data.errors.reduce((acc, err) => {
              acc[err.path] = err.msg;
              return acc;
            }, {});
          }

          set({
            error: errorMessage,
            validationErrors,
            loading: false,
          });

          if (showToast) {
            // Le toast sera géré dans le composant
          }

          throw new Error(errorMessage);
        }
      },

      // Récupérer les rapports d'un navire
      fetchShipReports: async (shipId, page = 1, limit = 10) => {
        set({ loading: true, error: null });
        try {
          const response = await api.get(`/reports/ship/${shipId}`);
          set({ reports: response.data.data, loading: false });
          return response.data;
        } catch (error) {
            const errorMessage = formatErrorMessage(error);
          set({
            error: errorMessage,
            loading: false,
          });
          throw new Error(errorMessage);
        }
      },

      // Récupérer un rapport spécifique
      fetchReportById: async (reportId) => {
        set({ loading: true, error: null });
        try {
          const response = await api.get(`/reports/${reportId}`);
          set({ currentReport: response.data.data, loading: false });
          return response.data;
        } catch (error) {
          const errorMessage = formatErrorMessage(error);
          set({
            error: errorMessage,
            loading: false,
          });
          throw new Error(errorMessage);
        }
      },

      // Mettre à jour un rapport
      updateOperationalReport: async (reportId, reportData, showToast = true) => {
        set({ loading: true, error: null, validationErrors: {} });
        try {
          const response = await api.put(`/reports/${reportId}`, reportData);
          set({ loading: false });
          return response.data;
        } catch (error) {
            const errorMessage = formatErrorMessage(error);
          
          let validationErrors = {};
          if (error.response?.data?.errors) {
            validationErrors = error.response.data.errors.reduce((acc, err) => {
              acc[err.path] = err.msg;
              return acc;
            }, {});
          }

          set({
             error: errorMessage,
            validationErrors,
            loading: false,
          });
          throw new Error(errorMessage);
        }
      },

      // Récupérer un rapport spécifique
      fetchReportById: async (reportId) => {
        set({ loading: true, error: null });
        try {
          const response = await api.get(`/reports/${reportId}`);
          set({ currentReport: response.data.data, loading: false });
          return response.data;
        } catch (error) {
          const errorMessage = formatErrorMessage(error);
          set({
            error: errorMessage,
            loading: false,
          });
          throw new Error(errorMessage);
        }
      },

      // Récupérer tous les rapports
      fetchReports: async () => {
        set({ loading: true, error: null });
        try {
          const response = await api.get(`/reports`);
          set({ allReports: response.data.data, loading: false });
          return response.data;
        } catch (error) {
          const errorMessage = formatErrorMessage(error);
          set({
            error: errorMessage,
            loading: false,
          });
          throw new Error(errorMessage);
        }
      },

      // Effacer le rapport courant
      clearCurrentReport: () => {
        set({ currentReport: null, error: null, validationErrors: {}  });
      }
    }),
    {
      name: "reports-storage",
    }
  )
);