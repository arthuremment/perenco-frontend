import axios from 'axios';

//axios.defaults.baseURL = "http://localhost:3001";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use((config) => {
  const authStorage = localStorage.getItem('auth-storage');
  const token = authStorage ? JSON.parse(authStorage).state.token : null;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  response => {
    console.log("[AXIOS] Réponse:", {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.error("[AXIOS] Erreur:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default api;