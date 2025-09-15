import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

const api = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
});

export const fetchWeatherByCoords = async (lat: number, lon: number) => {
  try {
    const response = await api.get(`/weather`, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: "metric",
      lang: "en",
    }
  });
  return response.data;
  } catch(e) {
    console.error("Failed to fetch data " + e);
    alert("Failed to fetch data!");
  }
};
