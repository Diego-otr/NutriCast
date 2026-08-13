import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

// Base URL configurada desde las variables de entorno (.env.local) - Puerto 3001
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptor de Peticiones: Manejo automático de Tokens JWT
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      // Obtener el token guardado en el navegador (localStorage o cookie)
      const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Respuestas: Manejo global de errores (ej. 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Manejar expiración de token o sesión no autorizada en el futuro
      console.warn("Sesión expirada o no autorizada. Redirigiendo a login...");
    }
    return Promise.reject(error);
  }
);

// Utilidades auxiliares para gestionar tokens en el frontend
export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token);
  }
};

export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("token");
  }
};

export default apiClient;
