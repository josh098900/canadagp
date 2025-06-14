'use client';

import React from 'react';
import { TrendingUp, Thermometer, Wind, Eye, Droplets } from 'lucide-react';
import { TrackConditions, DRSEffectiveness } from '@/types';
import { getDRSEffectiveness } from '@/lib/f1-utils';

interface TrackConditionsAnalysisProps {
  conditions: TrackConditions;
}

export default function TrackConditionsAnalysis({ conditions }: TrackConditionsAnalysisProps) {
  const drsEffectiveness = getDRSEffectiveness(conditions);

  const getTemperatureColor = (temp: number) => {
    if (temp > 35) return 'text-red-500';
    if (temp > 25) return 'text-orange-400';
    return 'text-blue-400';
  };

  const getWindColor = (speed: number) => {
    if (speed > 30) return 'text-red-400';
    if (speed > 15) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getRainColor = (probability: number) => {
    if (probability > 70) return 'text-red-400';
    if (probability > 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-bold mb-4 flex items-center text-white">
        <TrendingUp className="mr-2 text-blue-500" />
        Track Conditions Analysis
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
          <div className="flex items-center">
            <Thermometer className="mr-2 text-red-400" />
            <div>
              <span className="text-white">Track Temperature</span>
              <p className="text-xs text-gray-400">Air: {conditions.temperature}°C</p>
            </div>
          </div>
          <span className={`text-xl font-bold ${getTemperatureColor(conditions.trackTemp)}`}>
            {conditions.trackTemp}°C
          </span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
          <div className="flex items-center">
            <Wind className="mr-2 text-blue-400" />
            <div>
              <span className="text-white">Wind Impact</span>
              <p className="text-xs text-gray-400">Direction affects cornering</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-lg font-semibold ${getWindColor(conditions.windSpeed)}`}>
              {conditions.windSpeed} km/h
            </span>
            <p className="text-sm text-gray-400">{conditions.windDirection}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
          <div className="flex items-center">
            <Eye className="mr-2 text-green-400" />
            <div>
              <span className="text-white">Visibility</span>
              <p className="text-xs text-gray-400">Track sight lines</p>
            </div>
          </div>
          <span className="text-lg font-semibold text-green-400">
            {conditions.visibility.toFixed(1)} km
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-900 rounded">
          <div className="flex items-center">
            <Droplets className="mr-2 text-blue-400" />
            <div>
              <span className="text-white">Rain Probability</span>
              <p className="text-xs text-gray-400">Next hour forecast</p>
            </div>
          </div>
          <span className={`text-lg font-semibold ${getRainColor(conditions.rainProbability)}`}>
            {conditions.rainProbability}%
          </span>
        </div>
        
        <div className="p-4 bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg">
          <h4 className="font-semibold mb-2 text-white">DRS Effectiveness</h4>
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    drsEffectiveness.percentage > 80 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                    drsEffectiveness.percentage > 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                    'bg-gradient-to-r from-red-500 to-red-400'
                  }`}
                  style={{ width: `${drsEffectiveness.percentage}%` }}
                ></div>
              </div>
            </div>
            <span className="ml-4 font-bold text-white text-lg">
              {drsEffectiveness.percentage}%
            </span>
          </div>
          <p className="text-sm text-gray-300">{drsEffectiveness.description}</p>
          <p className="text-xs text-gray-400 mt-1">
            Wind speed affects DRS efficiency on straights
          </p>
        </div>

        {/* Additional insights */}
        <div className="bg-gray-900 rounded-lg p-3">
          <h5 className="font-semibold text-white mb-2">Track Insights</h5>
          <div className="space-y-1 text-sm">
            {conditions.trackTemp > 40 && (
              <p className="text-orange-400">⚠️ High track temps - expect increased tire degradation</p>
            )}
            {conditions.windSpeed > 25 && (
              <p className="text-yellow-400">💨 Strong winds - may affect braking stability</p>
            )}
            {conditions.rainProbability > 50 && (
              <p className="text-blue-400">🌧️ Rain likely - consider wet weather setup</p>
            )}
            {conditions.humidity > 80 && (
              <p className="text-purple-400">💧 High humidity - affects aerodynamics</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}