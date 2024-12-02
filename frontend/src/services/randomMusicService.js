import api from "../http/requestInterceptor";

// Funkcja do pobierania losowego albumu
export const fetchRandomAlbum = async () => {
  try {
    const response = await api.get("/music/random-album");
    return response.data; // Zwróć dane albumu
  } catch (err) {
    console.error("Nie udało się pobrać danych albumu:", err);
    throw new Error(
      "Wystąpił błąd podczas pobierania losowego albumu. Spróbuj ponownie."
    );
  }
};
