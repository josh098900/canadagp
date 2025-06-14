import { WeatherData, TireCompound, RaceStrategy, TrackConditions, DRSEffectiveness, LapTimeFactors } from '@/types';

// Tire compounds available for the Canadian GP
export const tireCompounds: Record<string, TireCompound> = {
  soft: { 
    id: 'soft',
    color: 'bg-red-500', 
    label: 'C5 Soft', 
    degradation: 'High', 
    lapTime: '1:12.800' 
  },
  medium: { 
    id: 'medium',
    color: 'bg-yellow-500', 
    label: 'C4 Medium', 
    degradation: 'Medium', 
    lapTime: '1:13.200' 
  },
  hard: { 
    id: 'hard',
    color: 'bg-gray-300', 
    label: 'C3 Hard', 
    degradation: 'Low', 
    lapTime: '1:13.800' 
  },
  intermediate: { 
    id: 'intermediate',
    color: 'bg-green-500', 
    label: 'Intermediate', 
    degradation: 'Variable', 
    lapTime: '1:18.500' 
  },
  wet: { 
    id: 'wet',
    color: 'bg-blue-500', 
    label: 'Full Wet', 
    degradation: 'High', 
    lapTime: '1:25.000' 
  }
};

// Convert weather data to track conditions
export function getTrackConditions(weatherData: WeatherData): TrackConditions {
  const windSpeed = Math.round(weatherData.wind.speed * 3.6); // Convert m/s to km/h
  const windDirection = getWindDirection(weatherData.wind.deg);
  
  // Estimate track temperature (usually higher than air temperature)
  const trackTemp = Math.round(weatherData.main.temp + (weatherData.main.temp * 0.4));
  
  // Simple rain probability calculation based on humidity and clouds
  const rainProbability = Math.min(
    Math.round((weatherData.main.humidity * 0.3) + (weatherData.clouds.all * 0.2)), 
    100
  );

  return {
    temperature: Math.round(weatherData.main.temp),
    humidity: weatherData.main.humidity,
    windSpeed,
    windDirection,
    visibility: weatherData.visibility / 1000, // Convert to km
    trackTemp,
    airPressure: weatherData.main.pressure,
    rainProbability
  };
}

// Get wind direction from degrees
function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

// Generate race strategy based on conditions
export function getRaceStrategy(conditions: TrackConditions): RaceStrategy {
  const { temperature, humidity, windSpeed, rainProbability } = conditions;
  
  if (rainProbability > 50) {
    return {
      strategy: 'Wet Weather Strategy',
      tires: ['intermediate', 'wet'],
      description: 'High rain probability - prepare for changing conditions',
      riskLevel: 'High',
      color: 'border-red-500'
    };
  } else if (temperature > 30 && humidity < 40) {
    return {
      strategy: 'Hot & Dry Strategy',
      tires: ['hard', 'medium'],
      description: 'High degradation expected - extend stint lengths',
      riskLevel: 'Medium',
      color: 'border-orange-500'
    };
  } else if (windSpeed > 25) {
    return {
      strategy: 'Windy Conditions Strategy',
      tires: ['medium', 'hard'],
      description: 'Strong winds - focus on stability over speed',
      riskLevel: 'Medium',
      color: 'border-blue-500'
    };
  } else {
    return {
      strategy: 'Optimal Strategy',
      tires: ['medium', 'soft'],
      description: 'Good conditions for aggressive strategy',
      riskLevel: 'Low',
      color: 'border-green-500'
    };
  }
}

// Calculate DRS effectiveness
export function getDRSEffectiveness(conditions: TrackConditions): DRSEffectiveness {
  const effectiveness = Math.max(0, Math.min(100, 100 - (conditions.windSpeed * 1.5)));
  
  return {
    percentage: Math.round(effectiveness),
    description: effectiveness > 80 ? 'Highly Effective' : 
                effectiveness > 60 ? 'Moderately Effective' : 
                'Limited Effectiveness'
  };
}

// Calculate lap time factors
export function calculateLapTimeFactors(conditions: TrackConditions, selectedTire: string): LapTimeFactors {
  const baseTime = 73.078; // 1:13.078 in seconds
  
  // Temperature impact (higher temp = slower lap times due to tire degradation)
  const tempImpact = conditions.temperature > 25 ? 
    (conditions.temperature - 25) * 0.01 : 0;
  
  // Wind impact (headwind/crosswind affects lap time)
  const windImpact = conditions.windSpeed > 15 ? 
    (conditions.windSpeed - 15) * 0.005 : 0;
  
  // Tire compound impact
  const baseTireTime = parseFloat(tireCompounds.medium.lapTime.replace('1:', '').replace('.', '.'));
  const selectedTireTime = parseFloat(tireCompounds[selectedTire]?.lapTime.replace('1:', '').replace('.', '.') || '73.200');
  const tireImpact = selectedTireTime - baseTireTime;
  
  const totalTime = baseTime + tempImpact + windImpact + tireImpact;
  
  return {
    baseTime: '1:13.078',
    temperatureImpact: tempImpact,
    windImpact: windImpact,
    tireImpact: tireImpact,
    estimatedLapTime: `1:${(totalTime - 60).toFixed(3).padStart(6, '0')}`
  };
}

// Format lap time
export function formatLapTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toFixed(3);
  return `${minutes}:${remainingSeconds.padStart(6, '0')}`;
}