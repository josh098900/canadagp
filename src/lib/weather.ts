import { WeatherData, ForecastData } from '@/types';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
  const response = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }
  
  return response.json();
}

export async function getWeatherForecast(lat: number, lon: number): Promise<ForecastData> {
  const response = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  
  if (!response.ok) {
    throw new Error(`Forecast API error: ${response.status}`);
  }
  
  return response.json();
}

export async function getMultipleWeatherPoints(points: Array<{lat: number, lon: number, id: string}>) {
  const promises = points.map(async (point) => {
    try {
      const weather = await getCurrentWeather(point.lat, point.lon);
      return {
        id: point.id,
        weather,
        error: null
      };
    } catch (error) {
      return {
        id: point.id,
        weather: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });

  return Promise.all(promises);
}

// Utility functions for weather data
export function getWeatherIcon(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export function getWindSpeed(mps: number): { kmh: number; mph: number } {
  return {
    kmh: Math.round(mps * 3.6),
    mph: Math.round(mps * 2.237)
  };
}

export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°C`;
}

export function formatPressure(pressure: number): string {
  return `${pressure} hPa`;
}

export function formatHumidity(humidity: number): string {
  return `${humidity}%`;
}

export function formatVisibility(visibility: number): string {
  return `${(visibility / 1000).toFixed(1)} km`;
}

// Racing-specific weather analysis
export function getRaceConditions(weather: WeatherData): {
  condition: 'Dry' | 'Wet' | 'Intermediate' | 'Extreme';
  description: string;
  riskLevel: 'Low' | 'Medium' | 'High';
} {
  const hasRain = weather.rain && (weather.rain['1h'] || weather.rain['3h']);
  const windSpeed = getWindSpeed(weather.wind.speed).kmh;
  const visibility = weather.visibility / 1000;
  
  if (hasRain) {
    const rainAmount = weather.rain?.['1h'] || weather.rain?.['3h'] || 0;
    if (rainAmount > 10) {
      return {
        condition: 'Extreme',
        description: 'Heavy rain - race may be delayed or stopped',
        riskLevel: 'High'
      };
    } else if (rainAmount > 2) {
      return {
        condition: 'Wet',
        description: 'Wet conditions - full wet tires required',
        riskLevel: 'High'
      };
    } else {
      return {
        condition: 'Intermediate',
        description: 'Light rain - intermediate tires recommended',
        riskLevel: 'Medium'
      };
    }
  }
  
  if (windSpeed > 50) {
    return {
      condition: 'Dry',
      description: 'Strong winds - handling may be affected',
      riskLevel: 'High'
    };
  }
  
  if (visibility < 5) {
    return {
      condition: 'Dry',
      description: 'Reduced visibility - caution advised',
      riskLevel: 'Medium'
    };
  }
  
  return {
    condition: 'Dry',
    description: 'Good racing conditions',
    riskLevel: 'Low'
  };
}