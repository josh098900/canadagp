import React, { useState } from 'react';
import { Clock, Settings, TrendingUp, TrendingDown, Play, RotateCcw } from 'lucide-react';

// Types
interface TireCompound {
  id: string;
  color: string;
  label: string;
  degradation: number; // degradation per lap in seconds
  lapTime: number; // base lap time offset in seconds
  maxLaps: number; // optimal stint length
}

interface TrackConditions {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  visibility: number;
  trackTemp: number;
  airPressure: number;
  rainProbability: number;
}

interface LapTimeFactors {
  baseTime: number;
  temperatureImpact: number;
  windImpact: number;
  tireImpact: number;
  fuelImpact: number;
  rainImpact: number;
  estimatedLapTime: number;
}

interface SimulationResult {
  lapNumber: number;
  lapTime: number;
  tireDegradation: number;
  fuel: number;
  conditions: string;
  delta: number; // delta to best lap
}

// More realistic tire compounds with proper degradation rates
const tireCompounds: Record<string, TireCompound> = {
  soft: { 
    id: 'soft',
    color: 'bg-red-500', 
    label: 'C5 Soft', 
    degradation: 0.08, // 0.08s per lap
    lapTime: -0.6, // 0.6s faster than medium
    maxLaps: 15
  },
  medium: { 
    id: 'medium',
    color: 'bg-yellow-500', 
    label: 'C4 Medium', 
    degradation: 0.04, // 0.04s per lap
    lapTime: 0, // baseline
    maxLaps: 25
  },
  hard: { 
    id: 'hard',
    color: 'bg-gray-300', 
    label: 'C3 Hard', 
    degradation: 0.02, // 0.02s per lap
    lapTime: 0.8, // 0.8s slower than medium
    maxLaps: 35
  },
  intermediate: {
    id: 'intermediate',
    color: 'bg-green-500',
    label: 'Intermediate',
    degradation: 0.06,
    lapTime: 3.5, // much slower in dry
    maxLaps: 20
  },
  wet: {
    id: 'wet',
    color: 'bg-blue-500',
    label: 'Full Wet',
    degradation: 0.05,
    lapTime: 8.0, // very slow in dry
    maxLaps: 25
  }
};

const LapTimeSimulator: React.FC = () => {
  const [selectedTire, setSelectedTire] = useState('medium');
  const [fuelLoad, setFuelLoad] = useState(50);
  const [baseTrackTime, setBaseTrackTime] = useState(73.5); // Monaco base time ~1:13.5
  const [trackConditions, setTrackConditions] = useState<TrackConditions>({
    temperature: 22,
    humidity: 65,
    windSpeed: 8,
    windDirection: 'NE',
    visibility: 10,
    trackTemp: 28,
    airPressure: 1013,
    rainProbability: 15
  });
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [stintLength, setStintLength] = useState(25);

  // More accurate lap time calculation
  const calculateLapTimeFactors = (conditions: TrackConditions, tire: string, fuel: number): LapTimeFactors => {
    const compound = tireCompounds[tire];
    
    // Temperature impact (optimal around 20-25°C air, 30-35°C track)
    const airTempOptimal = 22;
    const trackTempOptimal = 32;
    const airTempDelta = Math.abs(conditions.temperature - airTempOptimal);
    const trackTempDelta = Math.abs(conditions.trackTemp - trackTempOptimal);
    
    const temperatureImpact = (airTempDelta * 0.012) + (trackTempDelta * 0.008);
    
    // Wind impact (headwind vs tailwind, crosswind)
    const windImpact = conditions.windSpeed > 10 ? 
      (conditions.windSpeed - 10) * 0.006 : 0;
    
    // Tire compound impact
    const tireImpact = compound.lapTime;
    
    // Fuel impact (more realistic - 0.035s per kg)
    const fuelImpact = fuel * 0.035;
    
    // Rain impact (much more significant)
    let rainImpact = 0;
    if (conditions.rainProbability > 70) {
      rainImpact = 12 + (conditions.rainProbability - 70) * 0.1; // Heavy rain
    } else if (conditions.rainProbability > 30) {
      rainImpact = 2 + (conditions.rainProbability - 30) * 0.25; // Light rain
    }
    
    // Adjust rain impact based on tire choice
    if (tire === 'intermediate' && conditions.rainProbability > 30) {
      rainImpact = Math.max(0, rainImpact - 8); // Inters are better in wet
    } else if (tire === 'wet' && conditions.rainProbability > 70) {
      rainImpact = Math.max(0, rainImpact - 12); // Wets are best in heavy rain
    }
    
    const estimatedLapTime = baseTrackTime + temperatureImpact + windImpact + tireImpact + fuelImpact + rainImpact;
    
    return {
      baseTime: baseTrackTime,
      temperatureImpact,
      windImpact,
      tireImpact,
      fuelImpact,
      rainImpact,
      estimatedLapTime
    };
  };

  const formatLapTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(3);
    return `${minutes}:${remainingSeconds.padStart(6, '0')}`;
  };

  const getCurrentLapTime = (): LapTimeFactors => {
    return calculateLapTimeFactors(trackConditions, selectedTire, fuelLoad);
  };

  // Enhanced simulation with more realistic degradation
  const simulateStint = () => {
    setIsSimulating(true);
    const results: SimulationResult[] = [];
    const compound = tireCompounds[selectedTire];
    let bestLapTime = Infinity;
    
    for (let lap = 1; lap <= stintLength; lap++) {
      // Fuel consumption (2.2kg per lap average)
      const currentFuel = Math.max(5, fuelLoad - (lap * 2.2));
      
      // Tire degradation (non-linear - gets worse over time)
      const baseDegradation = compound.degradation * lap;
      const degradationMultiplier = lap > compound.maxLaps ? 
        1 + ((lap - compound.maxLaps) * 0.15) : 1; // Rapid degradation beyond optimal stint
      const tireDegradation = baseDegradation * degradationMultiplier;
      
      // Calculate base lap time
      const baseLapTime = calculateLapTimeFactors(trackConditions, selectedTire, currentFuel);
      const finalLapTime = baseLapTime.estimatedLapTime + tireDegradation;
      
      // Track best lap for delta calculation
      if (finalLapTime < bestLapTime) {
        bestLapTime = finalLapTime;
      }
      
      // Dynamic conditions
      let conditionsDesc = 'Stable';
      let conditionModifier = 0;
      
      if (lap > 10 && trackConditions.rainProbability > 40 && Math.random() > 0.7) {
        conditionsDesc = 'Light Rain';
        conditionModifier = 2.5;
      } else if (lap > 15 && trackConditions.trackTemp > 40) {
        conditionsDesc = 'Track Overheating';
        conditionModifier = 0.3;
      } else if (lap > 20 && tireDegradation > 2) {
        conditionsDesc = 'High Tire Wear';
      } else if (lap < 5) {
        conditionsDesc = 'Warming Up';
        conditionModifier = 0.5;
      }
      
      const adjustedLapTime = finalLapTime + conditionModifier;
      
      results.push({
        lapNumber: lap,
        lapTime: adjustedLapTime,
        tireDegradation,
        fuel: Math.round(currentFuel * 10) / 10,
        conditions: conditionsDesc,
        delta: 0 // Will be calculated after finding best lap
      });
    }
    
    // Calculate deltas
    results.forEach(result => {
      result.delta = result.lapTime - bestLapTime;
    });
    
    setTimeout(() => {
      setSimulationResults(results);
      setIsSimulating(false);
    }, 1000);
  };

  const resetSimulation = () => {
    setSimulationResults([]);
  };

  const currentLapTime = getCurrentLapTime();

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Clock className="text-red-500" size={28} />
          <h2 className="text-3xl font-bold text-white">F1 Lap Time Simulator</h2>
        </div>
        <div className="text-sm text-gray-400">
          Monaco GP 2025
        </div>
      </div>

      {/* Track Configuration */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Tire & Setup */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Settings size={20} />
            Car Setup
          </h3>
          
          <div>
            <label className="block text-sm text-gray-400 mb-3">Tire Compound</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(tireCompounds).map(([key, tire]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTire(key)}
                  className={`p-3 rounded-lg border transition-all text-left ${
                    selectedTire === key 
                      ? 'border-red-500 bg-red-500/10' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-3 h-3 rounded-full ${tire.color}`}></div>
                    <div className="text-xs text-white font-medium">{tire.label}</div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {tire.degradation}s/lap • {tire.maxLaps} laps
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Base Track Time: {formatLapTime(baseTrackTime)}
            </label>
            <input
              type="range"
              min="70"
              max="80"
              step="0.1"
              value={baseTrackTime}
              onChange={(e) => setBaseTrackTime(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Fuel Load: {fuelLoad}kg
            </label>
            <input
              type="range"
              min="10"
              max="110"
              value={fuelLoad}
              onChange={(e) => setFuelLoad(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Stint Length: {stintLength} laps
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={stintLength}
              onChange={(e) => setStintLength(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>

        {/* Weather Conditions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Weather Conditions</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Air Temp: {trackConditions.temperature}°C</label>
              <input
                type="range"
                min="10"
                max="40"
                value={trackConditions.temperature}
                onChange={(e) => setTrackConditions(prev => ({...prev, temperature: parseInt(e.target.value)}))}
                className="w-full h-1 bg-gray-700 rounded slider"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Track Temp: {trackConditions.trackTemp}°C</label>
              <input
                type="range"
                min="15"
                max="60"
                value={trackConditions.trackTemp}
                onChange={(e) => setTrackConditions(prev => ({...prev, trackTemp: parseInt(e.target.value)}))}
                className="w-full h-1 bg-gray-700 rounded slider"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Wind: {trackConditions.windSpeed}km/h</label>
              <input
                type="range"
                min="0"
                max="30"
                value={trackConditions.windSpeed}
                onChange={(e) => setTrackConditions(prev => ({...prev, windSpeed: parseInt(e.target.value)}))}
                className="w-full h-1 bg-gray-700 rounded slider"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Rain: {trackConditions.rainProbability}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={trackConditions.rainProbability}
                onChange={(e) => setTrackConditions(prev => ({...prev, rainProbability: parseInt(e.target.value)}))}
                className="w-full h-1 bg-gray-700 rounded slider"
              />
            </div>
          </div>
        </div>

        {/* Current Estimate */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Lap Time Breakdown</h3>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-green-400 mb-1">
                {formatLapTime(currentLapTime.estimatedLapTime)}
              </div>
              <div className="text-sm text-gray-400">Estimated Lap Time</div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Base:</span>
                <span className="text-white">{formatLapTime(currentLapTime.baseTime)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Temperature:</span>
                <span className={`flex items-center gap-1 ${
                  currentLapTime.temperatureImpact > 0 ? 'text-red-400' : 'text-green-400'
                }`}>
                  {currentLapTime.temperatureImpact > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  +{currentLapTime.temperatureImpact.toFixed(3)}s
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Wind:</span>
                <span className="flex items-center gap-1 text-red-400">
                  {currentLapTime.windImpact > 0 && <TrendingUp size={12} />}
                  +{currentLapTime.windImpact.toFixed(3)}s
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Tires:</span>
                <span className={`flex items-center gap-1 ${
                  currentLapTime.tireImpact > 0 ? 'text-red-400' : 'text-green-400'
                }`}>
                  {currentLapTime.tireImpact > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {currentLapTime.tireImpact > 0 ? '+' : ''}{currentLapTime.tireImpact.toFixed(3)}s
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Fuel:</span>
                <span className="flex items-center gap-1 text-red-400">
                  <TrendingUp size={12} />
                  +{currentLapTime.fuelImpact.toFixed(3)}s
                </span>
              </div>
              {currentLapTime.rainImpact > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Rain:</span>
                  <span className="flex items-center gap-1 text-red-400">
                    <TrendingUp size={12} />
                    +{currentLapTime.rainImpact.toFixed(3)}s
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Simulation Controls */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={simulateStint}
          disabled={isSimulating}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          {isSimulating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Simulating...
            </>
          ) : (
            <>
              <Play size={20} />
              Simulate {stintLength}-Lap Stint
            </>
          )}
        </button>
        
        {simulationResults.length > 0 && (
          <button
            onClick={resetSimulation}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <RotateCcw size={20} />
            Reset
          </button>
        )}
      </div>

      {/* Simulation Results */}
      {simulationResults.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Stint Results - {tireCompounds[selectedTire].label}
          </h3>
          <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-600">
            <div className="max-h-80 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-700 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-gray-300">Lap</th>
                    <th className="px-3 py-2 text-left text-gray-300">Time</th>
                    <th className="px-3 py-2 text-left text-gray-300">Delta</th>
                    <th className="px-3 py-2 text-left text-gray-300">Deg</th>
                    <th className="px-3 py-2 text-left text-gray-300">Fuel</th>
                    <th className="px-3 py-2 text-left text-gray-300">Conditions</th>
                  </tr>
                </thead>
                <tbody>
                  {simulationResults.map((result, index) => (
                    <tr key={index} className="border-t border-gray-700 hover:bg-gray-750">
                      <td className="px-3 py-2 text-white font-medium">{result.lapNumber}</td>
                      <td className="px-3 py-2 text-green-400 font-mono text-xs">
                        {formatLapTime(result.lapTime)}
                      </td>
                      <td className={`px-3 py-2 font-mono text-xs ${
                        result.delta === 0 ? 'text-purple-400' : 'text-red-400'
                      }`}>
                        {result.delta === 0 ? 'BEST' : `+${result.delta.toFixed(3)}`}
                      </td>
                      <td className="px-3 py-2 text-yellow-400 text-xs">
                        +{result.tireDegradation.toFixed(3)}s
                      </td>
                      <td className="px-3 py-2 text-blue-400 text-xs">{result.fuel}kg</td>
                      <td className="px-3 py-2 text-gray-300 text-xs">{result.conditions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Summary Stats */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-lg font-bold text-green-400">
                {formatLapTime(Math.min(...simulationResults.map(r => r.lapTime)))}
              </div>
              <div className="text-xs text-gray-400">Best Lap</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-lg font-bold text-yellow-400">
                {formatLapTime(simulationResults.reduce((sum, r) => sum + r.lapTime, 0) / simulationResults.length)}
              </div>
              <div className="text-xs text-gray-400">Average</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-lg font-bold text-red-400">
                +{Math.max(...simulationResults.map(r => r.delta)).toFixed(3)}s
              </div>
              <div className="text-xs text-gray-400">Worst Delta</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-lg font-bold text-blue-400">
                {simulationResults[simulationResults.length - 1]?.fuel}kg
              </div>
              <div className="text-xs text-gray-400">Final Fuel</div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: 2px solid #ffffff;
        }
        .slider::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: 2px solid #ffffff;
        }
      `}</style>
    </div>
  );
};

export default LapTimeSimulator;