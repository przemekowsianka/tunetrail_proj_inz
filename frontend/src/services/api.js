import api from "../http/requestInterceptor";

export const registerUser = async (userData) => {
  try {
    const response = await api.post(`/auth/register`, userData);
    return response.data; // Zwróć odpowiedź backendu
  } catch (error) {
    alert(error.response?.data?.error);
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await api.post(`/auth/login`, userData);
    return response.data; // Zwróć odpowiedź backendu
  } catch (error) {
    alert(error.response?.data?.error);
  }
};
