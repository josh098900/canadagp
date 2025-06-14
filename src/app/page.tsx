'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { TrackConditions } from '@/types';
import { getCurrentWeather } from '@/lib/weather';
import { getTrackConditions } from '@/lib/f1-utils';

// Dynamically import the map component to avoid SSR issues with Leaflet
const F1WeatherMap = dynamic(() => import('@/components/map/F1WeatherMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>
  )
});

// Dynamically import F1 components
const TireStrategyAdvisor = dynamic(() => import('@/components/f1/TireStrategyAdvisor'), { 
  ssr: false,
  loading: () => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 animate-pulse">
      <div className="h-6 bg-gray-700 rounded mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      </div>
    </div>
  )
});

const TrackConditionsAnalysis = dynamic(() => import('@/components/f1/TrackConditionsAnalysis'), { 
  ssr: false,
  loading: () => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 animate-pulse">
      <div className="h-6 bg-gray-700 rounded mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-700 rounded w-2/3"></div>
      </div>
    </div>
  )
});

const LapTimeSimulator = dynamic(() => import('@/components/f1/LapTimeSimulator'), { 
  ssr: false,
  loading: () => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 animate-pulse">
      <div className="h-6 bg-gray-700 rounded mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  )
});

export default function Home() {
  const [trackConditions, setTrackConditions] = useState<TrackConditions | null>(null);
  const [selectedTire, setSelectedTire] = useState('medium');
  const [loading, setLoading] = useState(true);

  // Fetch weather data for Circuit Gilles Villeneuve
  useEffect(() => {
    const fetchTrackConditions = async () => {
      try {
        setLoading(true);
        // Circuit Gilles Villeneuve coordinates
        const weatherData = await getCurrentWeather(45.5017, -73.5226);
        const conditions = getTrackConditions(weatherData);
        setTrackConditions(conditions);
      } catch (error) {
        console.error('Failed to fetch track conditions:', error);
        // Provide fallback conditions
        setTrackConditions({
          temperature: 25,
          humidity: 60,
          windSpeed: 15,
          windDirection: 'SW',
          visibility: 10,
          trackTemp: 35,
          airPressure: 1013,
          rainProbability: 20
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrackConditions();
    // Refresh every 10 minutes
    const interval = setInterval(fetchTrackConditions, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTireSelect = (tireId: string) => {
    setSelectedTire(tireId);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="text-red-600">F1</span> Weather
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-300 mb-2">
            Circuit Gilles Villeneuve
          </h2>
          <p className="text-gray-400 text-lg">
            Montreal, Canada • Live Weather Conditions & Race Analysis
          </p>
        </div>

        {/* Main Weather Map */}
        <div className="mb-8">
          <F1WeatherMap />
        </div>

        {/* F1 Analysis Components */}
        {!loading && trackConditions && (
          <div className="space-y-8 mb-8">
            {/* Tire Strategy and Track Conditions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TireStrategyAdvisor 
                conditions={trackConditions}
                selectedTire={selectedTire}
                onTireSelect={handleTireSelect}
              />
              <TrackConditionsAnalysis 
                conditions={trackConditions}
              />
            </div>

            {/* Lap Time Simulator - Full Width */}
            <div className="w-full">
              <LapTimeSimulator />
            </div>
          </div>
        )}

        {/* Loading State for F1 Components */}
        {loading && (
          <div className="space-y-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 animate-pulse">
                <div className="h-6 bg-gray-700 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 animate-pulse">
                <div className="h-6 bg-gray-700 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 animate-pulse">
              <div className="h-6 bg-gray-700 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        )}

        {/* Sector Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Sector 1
            </h3>
            <p className="text-gray-400">
              Start/Finish to Turn 6 - High-speed section with technical chicanes
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
              <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
              Sector 2
            </h3>
            <p className="text-gray-400">
              Turn 7 to Turn 10 - Famous hairpin and technical middle section
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              Sector 3
            </h3>
            <p className="text-gray-400">
              Turn 11 to Start/Finish - Wall of Champions and final chicane
            </p>
          </div>
        </div>

        {/* Track Information */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-2xl font-semibold text-white mb-4">
            Track Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-gray-300">
            <div>
              <p className="text-gray-400 text-sm">Length</p>
              <p className="text-xl font-semibold">4.361 km</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Turns</p>
              <p className="text-xl font-semibold">14</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">DRS Zones</p>
              <p className="text-xl font-semibold">3</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Lap Record</p>
              <p className="text-xl font-semibold">1:13.078</p>
              <p className="text-xs text-gray-400">Valtteri Bottas (2019)</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400">
          <p>Weather data provided by OpenWeatherMap • Updates every 10 minutes</p>
        </div>
      </div>
    </main>
  );
}