import axios from "axios";

const TOKEN_KEY = "@helpdesk:token";
const USER_KEY = "@helpdesk:user";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Adiciona automaticamente o JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Trata respostas de erro da API
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url;

    // Evita redirecionar quando o erro é no próprio login
    const isLoginRequest =
      typeof requestUrl === "string" &&
      requestUrl.includes("/auth/login");

    if (status === 401 && !isLoginRequest) {
      console.warn("Sessão expirada. Faça login novamente.");

      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);