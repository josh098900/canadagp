// Weather Data Types
export interface WeatherData {
    coord: {
      lon: number;
      lat: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    base: string;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
      sea_level?: number;
      grnd_level?: number;
    };
    visibility: number;
    wind: {
      speed: number;
      deg: number;
      gust?: number;
    };
    rain?: {
      '1h'?: number;
      '3h'?: number;
    };
    clouds: {
      all: number;
    };
    dt: number;
    sys: {
      type: number;
      id: number;
      country: string;
      sunrise: number;
      sunset: number;
    };
    timezone: number;
    id: number;
    name: string;
    cod: number;
  }
  
  // Forecast Data Types
  export interface ForecastData {
    cod: string;
    message: number;
    cnt: number;
    list: Array<{
      dt: number;
      main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        sea_level: number;
        grnd_level: number;
        humidity: number;
      };
      weather: Array<{
        id: number;
        main: string;
        description: string;
        icon: string;
      }>;
      clouds: {
        all: number;
      };
      wind: {
        speed: number;
        deg: number;
        gust?: number;
      };
      visibility: number;
      pop: number;
      rain?: {
        '3h': number;
      };
      sys: {
        pod: string;
      };
      dt_txt: string;
    }>;
    city: {
      id: number;
      name: string;
      coord: {
        lat: number;
        lon: number;
      };
      country: string;
      population: number;
      timezone: number;
      sunrise: number;
      sunset: number;
    };
  }
  
  // Circuit Data Types
  export interface CircuitPoint {
    lat: number;
    lng: number;
  }
  
  export interface CircuitData {
    name: string;
    country: string;
    coordinates: CircuitPoint[];
    center: CircuitPoint;
    sectors: {
      sector1: CircuitPoint[];
      sector2: CircuitPoint[];
      sector3: CircuitPoint[];
    };
  }
  
  // Weather Station Types
  export interface WeatherStation {
    id: string;
    name: string;
    position: CircuitPoint;
    data: WeatherData;
  }
  
  // Map Types
  export interface MapViewport {
    center: [number, number];
    zoom: number;
  }

  // Add these new types to your existing types/index.ts file

// Tire Strategy Types
export interface TireCompound {
    color: string;
    label: string;
    degradation: 'Low' | 'Medium' | 'High' | 'Variable';
    lapTime: string;
    id: string;
  }
  
  export interface RaceStrategy {
    strategy: string;
    tires: string[];
    description: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    color: string;
  }
  
  // Track Conditions Types
  export interface TrackConditions {
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    visibility: number;
    trackTemp: number;
    airPressure: number;
    rainProbability: number;
  }
  
  export interface DRSEffectiveness {
    percentage: number;
    description: string;
  }
  
  // Lap Time Analysis Types
  export interface LapTimeFactors {
    baseTime: string;
    temperatureImpact: number;
    windImpact: number;
    tireImpact: number;
    estimatedLapTime: string;
  }
  
  // Weather Station Data with enhanced info
  export interface EnhancedWeatherStationData {
    id: string;
    name: string;
    weather: WeatherData | null;
    error: string | null;
    position: { lat: number; lng: number };
    trackConditions?: TrackConditions;
  }