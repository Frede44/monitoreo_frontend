import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';

// --- MOCK DATA ---
const comparisonData = [
  { name: 'Principal', CO2: 420, Temp: 24, PM25: 15 },
  { name: 'Servidores', CO2: 610, Temp: 19, PM25: 35 },
  { name: 'Laboratorio', CO2: 580, Temp: 21, PM25: 25 },
];

const radarData = [
  { subject: 'Temp', A: 60 },
  { subject: 'CO', A: 25 },
  { subject: 'PM2.5', A: 45 },
  { subject: 'PM10', A: 30 },
];

// Generate time series data
const timeSeriesData = Array.from({ length: 24 }).map((_, i) => {
  const time = new Date();
  time.setHours(16, 30 + (i * 15));
  return {
    time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    co2: 400 + Math.random() * 600,
    temp: 18 + Math.random() * 8,
    pm25: 10 + Math.random() * 40,
    pm10: 20 + Math.random() * 120,
    co: 5 + Math.random() * 25,
    voltaje: 4.5 + Math.random() * 1,
    humedad: 40 + Math.random() * 30
  };
});




// 1. Comparación entre Dispositivos (BarChart)
export const ComparacionDispositivosChart = () => (
  <BarChart
    dataset={comparisonData}
    xAxis={[{ scaleType: 'band', dataKey: 'name' }]}
    series={[
      { dataKey: 'CO2', label: 'CO2', color: '#22c55e' },
      { dataKey: 'Temp', label: 'Temp', color: '#3b82f6' },
      { dataKey: 'PM25', label: 'PM2.5', color: '#f59e0b' },
    ]}
    height={300}
    margin={{ left: 40, right: 10, top: 40, bottom: 30 }}
  />
);

// 2. Calidad del Aire (RadarChart)
// MUI X Charts no cuenta con gráfica de Radar, usamos BarChart como alternativa visual
export const CalidadAireChart = () => (
  <BarChart
    dataset={radarData}
    xAxis={[{ scaleType: 'band', dataKey: 'subject' }]}
    series={[
      { dataKey: 'A', label: 'Calidad', color: '#3b82f6' }
    ]}
    height={300}
    margin={{ left: 50, right: 10, top: 40, bottom: 30 }}
  />
);

// 3. Temperatura y CO2 (LineChart with 2 Y-Axes)
export const TemperaturaCO2Chart = () => (
  <LineChart
    dataset={timeSeriesData}
    xAxis={[{ scaleType: 'point', dataKey: 'time' }]}
    series={[
      { dataKey: 'co2', label: 'CO₂ (ppm)', color: '#22c55e', showMark: false },
      { dataKey: 'temp', label: 'Temp (°C)', color: '#3b82f6', showMark: false },
    ]}
    height={300}
    margin={{ left: 50, right: 20, top: 40, bottom: 30 }}
  />
);

// 4. Partículas en suspensión (AreaChart)
export const ParticulasChart = () => (
  <LineChart
    dataset={timeSeriesData}
    xAxis={[{ scaleType: 'point', dataKey: 'time' }]}
    series={[
      { dataKey: 'pm25', label: 'PM2.5 (µg/m³)', color: '#f59e0b', area: true, showMark: false },
      { dataKey: 'pm10', label: 'PM10 (µg/m³)', color: '#ef4444', area: true, showMark: false },
    ]}
    height={300}
    margin={{ left: 50, right: 20, top: 40, bottom: 30 }}
  />
);

// 5. Monóxido de Carbono (LineChart)
export const COChart = () => (
  <LineChart
    dataset={timeSeriesData}
    xAxis={[{ scaleType: 'point', dataKey: 'time' }]}
    series={[
      { dataKey: 'co', label: 'CO (ppm)', color: '#ef4444', showMark: false },
    ]}
    height={300}
    margin={{ left: 50, right: 20, top: 40, bottom: 30 }}
  />
);

// 6. Voltaje y Humedad (LineChart with 2 axes)
export const VoltajeHumedadChart = () => (
  <LineChart
    dataset={timeSeriesData}
    xAxis={[{ scaleType: 'point', dataKey: 'time' }]}
    series={[
      { dataKey: 'voltaje', label: 'Voltaje (V)', color: '#a855f7', showMark: false },
      { dataKey: 'humedad', label: 'Humedad (%)', color: '#06b6d4', showMark: false },
    ]}
    height={300}
    margin={{ left: 40, right: 20, top: 40, bottom: 30 }}
  />
);
