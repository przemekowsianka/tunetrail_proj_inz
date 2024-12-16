import axios from "axios";

const translateText = async (text) => {
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";
  const url = "https://libretranslate.de/translate";

  try {
    const response = await axios.post(proxyUrl + url, {
      q: text,
      source: "en",
      target: "pl",
      format: "text",
    });
    return response.data.translatedText;
  } catch (error) {
    console.error("Błąd tłumaczenia:", error);
    return text; // W razie błędu zwracamy oryginalny tekst
  }
};
export default translateText;
