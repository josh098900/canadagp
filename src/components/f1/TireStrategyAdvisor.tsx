'use client';

import React from 'react';
import { Zap } from 'lucide-react';
import { TrackConditions, RaceStrategy, TireCompound } from '@/types';
import { tireCompounds, getRaceStrategy } from '@/lib/f1-utils';

interface TireStrategyAdvisorProps {
  conditions: TrackConditions;
  selectedTire: string;
  onTireSelect: (tireId: string) => void;
}

export default function TireStrategyAdvisor({ 
  conditions, 
  selectedTire, 
  onTireSelect 
}: TireStrategyAdvisorProps) {
  const strategy = getRaceStrategy(conditions);

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-bold mb-4 flex items-center text-white">
        <Zap className="mr-2 text-yellow-500" />
        Tire Strategy Advisor
      </h3>
      
      <div className={`border-2 ${strategy.color} rounded-lg p-4 mb-4`}>
        <h4 className="font-semibold text-lg mb-2 text-white">{strategy.strategy}</h4>
        <p className="text-gray-300 mb-3">{strategy.description}</p>
        <div className="flex items-center mb-3">
          <span className="text-sm text-gray-400 mr-2">Risk Level:</span>
          <span className={`px-2 py-1 rounded text-xs font-bold ${
            strategy.riskLevel === 'High' ? 'bg-red-600 text-white' :
            strategy.riskLevel === 'Medium' ? 'bg-orange-600 text-white' :
            'bg-green-600 text-white'
          }`}>
            {strategy.riskLevel}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-400">Recommended:</span>
          {strategy.tires.map((tireId) => (
            <span 
              key={tireId}
              className={`px-3 py-1 rounded-full text-sm font-medium text-black ${tireCompounds[tireId]?.color || 'bg-gray-500'}`}
            >
              {tireCompounds[tireId]?.label || tireId}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h5 className="font-semibold text-white">Available Tire Compounds:</h5>
        {Object.entries(tireCompounds).map(([key, tire]) => (
          <div 
            key={key}
            className={`flex items-center justify-between p-3 rounded cursor-pointer transition-colors ${
              selectedTire === key ? 
                'bg-gray-700 border border-gray-600' : 
                'bg-gray-900 hover:bg-gray-700'
            }`}
            onClick={() => onTireSelect(key)}
          >
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full ${tire.color} mr-3`}></div>
              <div>
                <span className="font-medium text-white">{tire.label}</span>
                <p className="text-xs text-gray-400">Degradation: {tire.degradation}</p>
              </div>
            </div>
            <div className="text-right text-sm">
              <p className="text-gray-300">Est. Lap Time</p>
              <p className="font-mono text-white">{tire.lapTime}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}