import { CircuitData } from '@/types';

// Circuit Gilles Villeneuve (Montreal) track coordinates
export const circuitGillesVilleneuve: CircuitData = {
  name: "Circuit Gilles Villeneuve",
  country: "Canada",
  center: {
    lat: 45.5048,
    lng: -73.5280
  },
  coordinates: [
    // Start/Finish straight
    { lat: 45.5048, lng: -73.5280 },
    { lat: 45.5055, lng: -73.5285 },
    { lat: 45.5065, lng: -73.5290 },
    
    // Turn 1 (Virage Senna)
    { lat: 45.5075, lng: -73.5295 },
    { lat: 45.5080, lng: -73.5300 },
    { lat: 45.5085, lng: -73.5310 },
    
    // Backstraight to Turn 2
    { lat: 45.5090, lng: -73.5320 },
    { lat: 45.5095, lng: -73.5335 },
    { lat: 45.5100, lng: -73.5350 },
    
    // Turn 2 complex
    { lat: 45.5105, lng: -73.5365 },
    { lat: 45.5108, lng: -73.5375 },
    { lat: 45.5110, lng: -73.5385 },
    
    // Turn 3-4 chicane
    { lat: 45.5110, lng: -73.5395 },
    { lat: 45.5108, lng: -73.5405 },
    { lat: 45.5105, lng: -73.5415 },
    { lat: 45.5100, lng: -73.5425 },
    
    // Turn 5-6 section
    { lat: 45.5095, lng: -73.5435 },
    { lat: 45.5090, lng: -73.5445 },
    { lat: 45.5085, lng: -73.5450 },
    { lat: 45.5080, lng: -73.5455 },
    
    // Turn 7-8 (Epingle/Hairpin)
    { lat: 45.5075, lng: -73.5460 },
    { lat: 45.5070, lng: -73.5465 },
    { lat: 45.5065, lng: -73.5470 },
    { lat: 45.5060, lng: -73.5475 },
    { lat: 45.5055, lng: -73.5480 },
    { lat: 45.5050, lng: -73.5485 },
    { lat: 45.5045, lng: -73.5490 },
    { lat: 45.5040, lng: -73.5485 },
    { lat: 45.5035, lng: -73.5480 },
    { lat: 45.5030, lng: -73.5475 },
    
    // Turn 9-10 complex
    { lat: 45.5025, lng: -73.5470 },
    { lat: 45.5020, lng: -73.5460 },
    { lat: 45.5015, lng: -73.5450 },
    { lat: 45.5010, lng: -73.5440 },
    
    // Turn 11-12 chicane
    { lat: 45.5005, lng: -73.5430 },
    { lat: 45.5000, lng: -73.5420 },
    { lat: 45.4995, lng: -73.5410 },
    { lat: 45.4990, lng: -73.5400 },
    { lat: 45.4985, lng: -73.5390 },
    
    // Turn 13-14 (Wall of Champions area)
    { lat: 45.4980, lng: -73.5380 },
    { lat: 45.4975, lng: -73.5370 },
    { lat: 45.4970, lng: -73.5360 },
    { lat: 45.4968, lng: -73.5350 },
    { lat: 45.4965, lng: -73.5340 },
    { lat: 45.4963, lng: -73.5330 },
    { lat: 45.4960, lng: -73.5320 },
    
    // Final sector back to start/finish
    { lat: 45.4958, lng: -73.5310 },
    { lat: 45.4955, lng: -73.5300 },
    { lat: 45.4960, lng: -73.5290 },
    { lat: 45.4970, lng: -73.5285 },
    { lat: 45.4980, lng: -73.5280 },
    { lat: 45.4990, lng: -73.5278 },
    { lat: 45.5000, lng: -73.5276 },
    { lat: 45.5010, lng: -73.5275 },
    { lat: 45.5020, lng: -73.5274 },
    { lat: 45.5030, lng: -73.5273 },
    { lat: 45.5040, lng: -73.5275 },
    { lat: 45.5048, lng: -73.5280 } // Back to start
  ],
  sectors: {
    // Sector 1: Start to Turn 6
    sector1: [
      { lat: 45.5048, lng: -73.5280 },
      { lat: 45.5055, lng: -73.5285 },
      { lat: 45.5065, lng: -73.5290 },
      { lat: 45.5075, lng: -73.5295 },
      { lat: 45.5080, lng: -73.5300 },
      { lat: 45.5085, lng: -73.5310 },
      { lat: 45.5090, lng: -73.5320 },
      { lat: 45.5095, lng: -73.5335 },
      { lat: 45.5100, lng: -73.5350 },
      { lat: 45.5105, lng: -73.5365 },
      { lat: 45.5108, lng: -73.5375 },
      { lat: 45.5110, lng: -73.5385 },
      { lat: 45.5110, lng: -73.5395 },
      { lat: 45.5108, lng: -73.5405 },
      { lat: 45.5105, lng: -73.5415 },
      { lat: 45.5100, lng: -73.5425 },
      { lat: 45.5095, lng: -73.5435 },
      { lat: 45.5090, lng: -73.5445 },
      { lat: 45.5085, lng: -73.5450 },
      { lat: 45.5080, lng: -73.5455 }
    ],
    // Sector 2: Turn 7 to Turn 10
    sector2: [
      { lat: 45.5075, lng: -73.5460 },
      { lat: 45.5070, lng: -73.5465 },
      { lat: 45.5065, lng: -73.5470 },
      { lat: 45.5060, lng: -73.5475 },
      { lat: 45.5055, lng: -73.5480 },
      { lat: 45.5050, lng: -73.5485 },
      { lat: 45.5045, lng: -73.5490 },
      { lat: 45.5040, lng: -73.5485 },
      { lat: 45.5035, lng: -73.5480 },
      { lat: 45.5030, lng: -73.5475 },
      { lat: 45.5025, lng: -73.5470 },
      { lat: 45.5020, lng: -73.5460 },
      { lat: 45.5015, lng: -73.5450 },
      { lat: 45.5010, lng: -73.5440 }
    ],
    // Sector 3: Turn 11 to Start/Finish
    sector3: [
      { lat: 45.5005, lng: -73.5430 },
      { lat: 45.5000, lng: -73.5420 },
      { lat: 45.4995, lng: -73.5410 },
      { lat: 45.4990, lng: -73.5400 },
      { lat: 45.4985, lng: -73.5390 },
      { lat: 45.4980, lng: -73.5380 },
      { lat: 45.4975, lng: -73.5370 },
      { lat: 45.4970, lng: -73.5360 },
      { lat: 45.4968, lng: -73.5350 },
      { lat: 45.4965, lng: -73.5340 },
      { lat: 45.4963, lng: -73.5330 },
      { lat: 45.4960, lng: -73.5320 },
      { lat: 45.4958, lng: -73.5310 },
      { lat: 45.4955, lng: -73.5300 },
      { lat: 45.4960, lng: -73.5290 },
      { lat: 45.4970, lng: -73.5285 },
      { lat: 45.4980, lng: -73.5280 },
      { lat: 45.4990, lng: -73.5278 },
      { lat: 45.5000, lng: -73.5276 },
      { lat: 45.5010, lng: -73.5275 },
      { lat: 45.5020, lng: -73.5274 },
      { lat: 45.5030, lng: -73.5273 },
      { lat: 45.5040, lng: -73.5275 },
      { lat: 45.5048, lng: -73.5280 }
    ]
  }
};

// Weather monitoring points around the circuit
export const weatherStations = [
  {
    id: 'start-finish',
    name: 'Start/Finish Line',
    position: { lat: 45.5048, lng: -73.5280 }
  },
  {
    id: 'turn-1',
    name: 'Virage Senna (Turn 1)',
    position: { lat: 45.5080, lng: -73.5300 }
  },
  {
    id: 'hairpin',
    name: 'Épingle (Hairpin)',
    position: { lat: 45.5045, lng: -73.5490 }
  },
  {
    id: 'wall-champions',
    name: 'Wall of Champions',
    position: { lat: 45.4970, lng: -73.5360 }
  },
  {
    id: 'pits',
    name: 'Pit Lane',
    position: { lat: 45.5040, lng: -73.5270 }
  }
];