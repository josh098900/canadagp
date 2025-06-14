'use client';

import { useEffect, useState, useRef } from 'react';
import { WeatherData } from '@/types';
import { getCurrentWeather } from '@/lib/weather';
import { circuitGillesVilleneuve, weatherStations } from '@/data/circuit';

interface WeatherStationData {
  id: string;
  name: string;
  weather: WeatherData | null;
  error: string | null;
  position: { lat: number; lng: number };
}

export default function F1WeatherMap() {
  const [weatherData, setWeatherData] = useState<WeatherStationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Load Leaflet resources
  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window === 'undefined') return;

      try {
        // Load CSS first
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const cssLink = document.createElement('link');
          cssLink.rel = 'stylesheet';
          cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          cssLink.onload = () => console.log('Leaflet CSS loaded');
          document.head.appendChild(cssLink);
        }

        // Wait a bit for CSS to load
        await new Promise(resolve => setTimeout(resolve, 500));

        // Import Leaflet
        const L = await import('leaflet');
        console.log('Leaflet loaded:', L);

        // Fix marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        if (mapRef.current && !mapInstanceRef.current) {
          console.log('Creating map...');
          
          // Create map
          const map = L.map(mapRef.current, {
            center: [circuitGillesVilleneuve.center.lat, circuitGillesVilleneuve.center.lng],
            zoom: 14,
            scrollWheelZoom: true,
            dragging: true,
            zoomControl: true
          });

          // Add base layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
          }).addTo(map);

          // Store map instance
          mapInstanceRef.current = map;

          // Add circuit data
          try {
            // Main circuit track
            const circuitCoords = circuitGillesVilleneuve.coordinates.map(
              point => [point.lat, point.lng] as [number, number]
            );
            L.polyline(circuitCoords, { 
              color: '#1a1a1a', 
              weight: 8, 
              opacity: 0.9 
            }).addTo(map);

            // Sector lines
            const sectors = [
              { coords: circuitGillesVilleneuve.sectors.sector1, color: '#00ff00' },
              { coords: circuitGillesVilleneuve.sectors.sector2, color: '#ffff00' },
              { coords: circuitGillesVilleneuve.sectors.sector3, color: '#ff0000' }
            ];

            sectors.forEach(sector => {
              const coords = sector.coords.map(point => [point.lat, point.lng] as [number, number]);
              L.polyline(coords, { 
                color: sector.color, 
                weight: 4, 
                opacity: 0.7 
              }).addTo(map);
            });

          } catch (trackError) {
            console.warn('Error adding track data:', trackError);
          }

          // Wait for map to be ready
          map.whenReady(() => {
            console.log('Map is ready');
            setTimeout(() => {
              map.invalidateSize();
              setMapReady(true);
            }, 100);
          });

          // Force resize after short delay
          setTimeout(() => {
            map.invalidateSize();
          }, 1000);
        }

      } catch (err) {
        console.error('Error loading Leaflet:', err);
        setError('Failed to load map library');
      }
    };

    loadLeaflet();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        console.log('Cleaning up map');
        markersRef.current.forEach(marker => {
          if (marker && marker.remove) marker.remove();
        });
        markersRef.current = [];
        
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn('Error removing map:', e);
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Add weather markers when data is available
  useEffect(() => {
    const addWeatherMarkers = async () => {
      if (!mapInstanceRef.current || !mapReady || !weatherData.length) return;

      try {
        const L = await import('leaflet');
        
        // Clear existing markers
        markersRef.current.forEach(marker => {
          if (marker && marker.remove) marker.remove();
        });
        markersRef.current = [];

        console.log('Adding weather markers:', weatherData.length);

        // Add new markers
        weatherData.forEach((station) => {
          if (!station.position || !station.position.lat || !station.position.lng) return;

          const marker = L.marker([station.position.lat, station.position.lng]);
          
          let popupContent = `<div style="padding: 12px; min-width: 250px; font-family: system-ui;">
            <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: bold; color: #1f2937;">${station.name}</h3>`;
          
          if (station.weather && station.weather.weather && station.weather.weather[0]) {
            popupContent += `
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                <img src="https://openweathermap.org/img/wn/${station.weather.weather[0].icon}@2x.png" 
                     alt="${station.weather.weather[0].description}" 
                     style="width: 50px; height: 50px;">
                <div>
                  <div style="font-size: 24px; font-weight: bold; color: #1f2937;">${Math.round(station.weather.main.temp)}°C</div>
                  <div style="text-transform: capitalize; color: #6b7280;">${station.weather.weather[0].description}</div>
                </div>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 14px; color: #374151;">
                <div><strong>Feels like:</strong> ${Math.round(station.weather.main.feels_like)}°C</div>
                <div><strong>Humidity:</strong> ${station.weather.main.humidity}%</div>
                <div><strong>Wind:</strong> ${Math.round(station.weather.wind?.speed * 3.6 || 0)} km/h</div>
                <div><strong>Pressure:</strong> ${station.weather.main.pressure} hPa</div>
              </div>`;
          } else {
            popupContent += `<div style="color: #dc2626; font-style: italic;">Weather data unavailable</div>`;
          }
          
          popupContent += `</div>`;
          
          marker.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'custom-popup'
          });
          
          marker.addTo(mapInstanceRef.current);
          markersRef.current.push(marker);
        });

        console.log('Added', markersRef.current.length, 'markers');

      } catch (err) {
        console.error('Error adding weather markers:', err);
      }
    };

    addWeatherMarkers();
  }, [weatherData, mapReady]);

  // Fetch weather data
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        console.log('Fetching weather data for', weatherStations.length, 'stations');
        
        const promises = weatherStations.map(async (station) => {
          try {
            const weather = await getCurrentWeather(station.position.lat, station.position.lng);
            return {
              id: station.id,
              name: station.name,
              position: station.position,
              weather,
              error: null
            };
          } catch (err) {
            console.warn(`Failed to get weather for ${station.name}:`, err);
            return {
              id: station.id,
              name: station.name,
              position: station.position,
              weather: null,
              error: err instanceof Error ? err.message : 'Unknown error'
            };
          }
        });

        const results = await Promise.all(promises);
        console.log('Weather data fetched:', results);
        setWeatherData(results);
        
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
    
    const interval = setInterval(fetchWeatherData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gray-100 rounded-lg border-2 border-red-200">
        <div className="text-center text-red-600 p-6">
          <div className="text-xl font-bold mb-2">Map Error</div>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              window.location.reload();
            }} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg border border-gray-300">
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading weather data...</p>
          </div>
        </div>
      )}
      <div 
        ref={mapRef} 
        className="w-full h-full bg-gray-200"
        style={{ minHeight: '600px' }}
      />
      {!mapReady && !error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-600">
            <div className="animate-pulse text-lg">Initializing map...</div>
          </div>
        </div>
      )}
    </div>
  );
}