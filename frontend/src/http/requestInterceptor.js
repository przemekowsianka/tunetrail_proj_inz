import axios from "axios";

// Tworzymy instancję axios z domyślną konfiguracją
const api = axios.create({
  baseURL: "http://localhost:4000/api", // Adres bazowy dla wszystkich żądań
  headers: {
    "Content-Type": "application/json", // Domyślny nagłówek dla wszystkich żądań
  },
  timeout: 600000, // Opcjonalny czas oczekiwania (timeout) na odpowiedź
});

// Interceptor, który dodaje bazowy URL do wszystkich żądań
api.interceptors.request.use(
  (config) => {
    // Możesz dodać dodatkowe nagłówki lub inne ustawienia tutaj, jeśli są potrzebne
    console.log("Request made to:", config.url);
    const token = localStorage.getItem("token"); // Pobieramy token z localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Dodajemy token do nagłówka
    } // Logowanie żądań dla celów debugowania
    return config;
  },
  (error) => {
    // Obsługuje błędy przy konfiguracji żądania
    return Promise.reject(error);
  }
);
let lastErrorResponse = null;
// Możesz dodać interceptor odpowiedzi, jeśli chcesz obsługiwać odpowiedzi globalnie
api.interceptors.response.use(
  (response) => {
    // Tutaj możesz przechwycić odpowiedź, np. logując ją lub wykonując dodatkowe operacje

    return response;
  },
  (error) => {
    if (error.response) {
      lastErrorResponse = error.response.data; // Zapisz pełną odpowiedź błędu
    } else {
      lastErrorResponse = { message: error.message }; // Na wypadek błędu sieciowego
    }

    console.log("📡 Interceptor przechwycił błąd: ", lastErrorResponse);

    return Promise.reject(error);
  }
);
export const getLastErrorResponse = () => lastErrorResponse;
export default api;
