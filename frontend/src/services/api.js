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
    localStorage.setItem("token", response.data.token);
    console.log(localStorage.getItem("token"));
    return response.data; // Zwróć odpowiedź backendu
  } catch (error) {
    alert(error.response?.data?.error);
  }
};
