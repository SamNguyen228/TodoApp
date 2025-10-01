import axios from "axios";
import i18n from "@/i18n";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

const api = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
});

export const fetchWeatherByCoords = async (lat: number, lon: number) => {
  try {
    const langMap: Record<string, string> = {
      en: "en",
      vi: "vi",
      ja: "ja",
      de: "de",
    };

    const lang = langMap[i18n.language] || "en";

    const response = await api.get(`/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: "metric",
        lang, 
      },
    });

    return response.data;
  } catch (e) {
    console.error("Failed to fetch weather data: ", e);
    alert("Failed to fetch weather data!");
  }
};
