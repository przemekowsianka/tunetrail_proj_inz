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

export const fetchRandomArtist = async () => {
  try {
    const response = await api.get("/music/random-artist");
    console.log("Artist object:", response.data);
    return response.data; // Zwróć dane albumu
  } catch (err) {
    console.error("Nie udało się pobrać danych artysty:", err);
    throw new Error(
      "Wystąpił błąd podczas pobierania losowego artysty. Spróbuj ponownie."
    );
  }
};

export const fetchRandomTrack = async () => {
  try {
    const response = await api.get("/music/random-song");
    console.log("Song object:", response.data);
    return response.data; // Zwróć dane albumu
  } catch (err) {
    console.error("Nie udało się pobrać danych utworu:", err);
    throw new Error(
      "Wystąpił błąd podczas pobierania losowego utworu. Spróbuj ponownie."
    );
  }
};
export const fetchRandomTag = async () => {
  try {
    const response = await api.get("/music/random-tag");
    console.log("Tag object:", response.data);
    return response.data; // Zwróć dane albumu
  } catch (err) {
    console.error("Nie udało się pobrać danych utworu:", err);
    throw new Error(
      "Wystąpił błąd podczas pobierania losowego utworu. Spróbuj ponownie."
    );
  }
};
