// store/ships.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../utils/api";

export const useShipsStore = create(
  persist(
    (set, get) => ({
      currentShip: null,
      ships: [],
      loading: false,
      error: null,

      // Récupérer les infos du navire connecté
      fetchCurrentShip: async () => {
        set({ loading: true, error: null });
        try {
          const response = await api.get("api/ships/me/profile");
          if (!response.data?.data) {
            throw new Error("Structure de réponse invalide");
          }

          set({ currentShip: response.data.data, loading: false });

          return response.data;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Erreur de chargement",
            loading: false,
          });
          throw error;
        }
      },

      // Récupérer la liste des navires (pour admin)
      fetchShips: async (page = 1, limit = 10) => {
        set({ loading: true, error: null });
        try {
          const response = await api.get(`api/ships?page=${page}&limit=${limit}`);
          set({ ships: response.data.data.ships, loading: false });
          return response.data;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Erreur de chargement",
            loading: false,
          });
          throw error;
        }
      },

      // Créer un nouveau navire
      createShip: async (shipData) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post("api/ships", shipData);

          // Mettre à jour la liste des navires
          const { ships } = get();
          set({
            ships: [...ships, response.data.data],
            loading: false,
          });

          return response.data;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Erreur de création",
            loading: false,
          });
          throw error;
        }
      },

      // Mettre à jour un navire
      updateShip: async (id, shipData) => {
        set({ loading: true, error: null });
        try {
          const response = await api.put(`api/ships/${id}`, shipData);

          // Mettre à jour la liste des navires
          const { ships } = get();
          const updatedShips = ships.map(ship => 
            ship.id === id ? { ...ship, ...response.data.data } : ship
          );

          set({ 
            ships: updatedShips,
            loading: false 
          });
          return response.data;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Erreur de mise à jour",
            loading: false,
          });
          throw error;
        }
      },

      // Supprimer un navire
      deleteShip: async (id) => {
        set({ loading: true, error: null });
        try {
          await api.delete(`api/ships/${id}`);
          
          // Mettre à jour la liste des navires
          const { ships } = get();
          const filteredShips = ships.filter(ship => ship.id !== id);
          
          set({ 
            ships: filteredShips,
            loading: false 
          });
          
          return { success: true, message: "Navire supprimé avec succès" };
        } catch (error) {
          set({
            error: error.response?.data?.message || "Erreur de suppression",
            loading: false,
          });
          throw error;
        }
      },
    }),
    {
      name: "ships-strorage",
    }
  )
);
