import { create } from "zustand";
import axios from "axios";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      type: null,
      error: null,
      loading: false,

      login: async (type, credentials) => {
        set({ loading: true, error: null });
        try {
          const endpoint =
            type === "admin" ? `${import.meta.env.VITE_API_URL}/api/auth/login/admin` : `${import.meta.env.VITE_API_URL}/api/auth/login/ship`;
          const response = await axios.post(endpoint, credentials);

          set({
            token: response.data.data.token,
            user:
              type === "admin"
                ? response.data.data.user
                : response.data.data.ship,
            type: type,
            loading: false,
          });

          return response.data;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Erreur de connexion",
            loading: false,
          });
          throw error;
        }
      },

      // Pour se déconnecter
      logout: () =>
        set({
          token: null,
          user: null,
          type: null,
        }),

      fetchUser: async () => {
        try {
          const { token } = useAuthStore.getState();
          if (!token) return null;

          const response = await axios.get("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });

          set({
            user: response.data.data.user || response.data.data.ship,
            type: response.data.data.type,
          });

          return response.data;
        } catch (error) {
          set({ token: null, user: null, type: null });
          throw error;
        }
      },
    }),
    {
      name: "auth-storage", // Clé locale dans localStorage
    }
  )
);
