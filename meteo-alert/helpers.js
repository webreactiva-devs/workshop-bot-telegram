// helpers.js

// Función para almacenar la ubicación del usuario en kvdb.io
// Se guarda también el flag "notifications" para controlar las notificaciones diarias.
export async function storeUserLocation(userId, data, kvdbUrl) {
  try {
    const url = `${kvdbUrl}/${userId}`;
    // Si no se especifica "notifications", se asume que está activado (true)
    if (data.notifications === undefined) {
      data.notifications = true;
    }
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.ok;
  } catch (error) {
    console.error("Error al guardar la ubicación del usuario:", error);
    return false;
  }
}

// Función para recuperar la ubicación del usuario desde kvdb.io
export async function getUserLocation(userId, kvdbUrl) {
  try {
    const url = `${kvdbUrl}/${userId}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al recuperar la ubicación del usuario:", error);
    return null;
  }
}

// Función para obtener la previsión meteorológica usando la API de open‑meteo
export async function getWeatherForecast(latitude, longitude) {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      hourly: "temperature_2m,weathercode",
      forecast_days: "1", // Previsión para 1 día (24 horas)
      timezone: "auto",
    });
    const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener la previsión meteorológica:", error);
    return null;
  }
}

// Función para formatear la previsión en un mensaje legible
export function formatForecastMessage(forecastData) {
  if (
    !forecastData.hourly ||
    !forecastData.hourly.time ||
    !forecastData.hourly.temperature_2m ||
    !forecastData.hourly.weathercode
  ) {
    return "No se pudo obtener la previsión completa.";
  }
  let message = "Previsión meteorológica para las próximas 24 horas:\n\n";
  const times = forecastData.hourly.time;
  const temps = forecastData.hourly.temperature_2m;
  const weathercodes = forecastData.hourly.weathercode;
  const count = Math.min(24, times.length);
  for (let i = 0; i < count; i++) {
    const time = new Date(times[i]);
    // Formato de hora: HH:00
    const hour = time.getHours().toString().padStart(2, "0") + ":00";
    const temp = temps[i];
    const code = weathercodes[i];
    message += `${hour} - Temp: ${temp}°C, Código: ${code}\n`;
  }
  return message;
}

// Función para obtener coordenadas a partir del nombre del lugar usando la API de geocodificación de open‑meteo
export async function getCoordinates(place) {
  try {
    const params = new URLSearchParams({
      name: place,
      count: "1",
      language: "es",
      format: "json",
    });
    const url = `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        latitude: result.latitude,
        longitude: result.longitude,
        name: result.name,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al obtener las coordenadas:", error);
    return null;
  }
}

// Función para obtener la lista de ids de usuario desde kvdb.io
export async function getAllUserIds(kvdbUrl) {
  try {
    // Se utiliza la URL correcta con el formato JSON
    const url = `${kvdbUrl}/?format=json`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Error al obtener la lista de usuarios");
      return [];
    }
    const data = await response.json();
    return data; // Se asume que 'data' es un array de claves
  } catch (error) {
    console.error("Error al recuperar todos los ids de usuario:", error);
    return [];
  }
}
