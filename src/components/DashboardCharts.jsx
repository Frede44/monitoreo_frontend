import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';

// --- MOCK DATA ---
const comparisonData = [
  { name: 'Principal', CO2: 420, Temp: 24, PM25: 15 },
  { name: 'Servidores', CO2: 610, Temp: 19, PM25: 35 },
  { name: 'Laboratorio', CO2: 580, Temp: 21, PM25: 25 },
];

// Generate time series data
const timeSeriesData = [];
/*const timeSeriesData = Array.from({ length: 24 }).map((_, i) => {
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
});*/




// 1. Comparación entre Dispositivos (BarChart)
export function ComparacionDispositivosChart({ datos }) {

  console.log('Datos recibidos en ComparacionDispositivosChart:', datos);

  if (!Array.isArray(datos) || datos.length === 0) {
    return <p className="text-center text-gray-500 w-full h-full flex items-center justify-center">No hay datos disponibles para mostrar.</p>;
  } else {
    // Transformar los datos recibidos para que coincidan con el formato esperado por el gráfico

    const datosSensores = datos.map((item, index) => {
      const metricas = item?.datos?.metricas || [];
      // Buscamos cada valor por su tipo_metrica_id
      const getVal = (id) => metricas.find(m => m.tipo_metrica_id === id)?.valor || 0;

      return {
        name: item?.datos?.dispositivo?.nombre || `Sensor ${index + 1}`,
        CO: getVal(1),
        Temp: getVal(2),
        Hum: getVal(3),
        Pres: getVal(4),
      };
    });

    return (
      <BarChart
        dataset={datosSensores}
        xAxis={[{ scaleType: 'band', dataKey: 'name' }]}
        series={[
          { dataKey: 'CO', label: 'CO (ppm)', color: '#ef4444' },
          { dataKey: 'Temp', label: 'Temp (°C)', color: '#3b82f6' },
          { dataKey: 'Hum', label: 'Hum (%)', color: '#10b981' },
          { dataKey: 'Pres', label: 'Pres (hPa)', color: '#f59e0b' },
        ]}
        height={300}
        margin={{ left: 40, right: 10, top: 40, bottom: 30 }}
      />
    );

  }

}

// 2. Calidad del Aire (RadarChart)
// MUI X Charts no cuenta con gráfica de Radar, usamos BarChart como alternativa visual
export function CalidadAireChart({ datos }) {
  // Si los datos aún no están listos o cargados
  if (!datos || Object.keys(datos).length === 0) {
    return <p className="text-center text-gray-500 py-10">Cargando datos...</p>;
  }

  // Mapeamos los datos reales usando los IDs de métrica (tipo_metrica_id)
  // 1 = Temperatura, 2 = Humedad, 3 = Presión, 4 = Calidad del Aire
  // Si tienes otras métricas como CO (ej: ID 5), PM2.5 (ej: ID 6), PM10 (ej: ID 7), puedes agregarlas aquí
  const radarData = [
    { subject: 'CO', A: datos[1] ?? 0 },
    { subject: 'Temp', A: datos[2] ?? 0 },
    { subject: 'Hum', A: datos[3] ?? 0 },
    { subject: 'Pres', A: datos[4] ?? 0 },
  ];

  return (
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
}

// 3. Temperatura y CO2 (LineChart with 2 Y-Axes)
export function TemperaturaCO2Chart ({ datos }) {
  if (!datos || datos.length === 0) {
    return <p className="text-center text-gray-500 py-10">Esperando lecturas en tiempo real...</p>;
  }

  return (
    <LineChart
      dataset={datos}
      xAxis={[{ scaleType: 'point', dataKey: 'time' }]}
      yAxis={[
        { id: 'co2Axis', position: 'left' },
        { id: 'tempAxis', position: 'right' },
      ]}
      series={[
        { dataKey: 'co2', label: 'CO₂ (ppm)', color: '#22c55e', showMark: true, yAxisId: 'co2Axis' },
        { dataKey: 'temp', label: 'Temp (°C)', color: '#3b82f6', showMark: true, yAxisId: 'tempAxis' },
      ]}
      height={300}
      margin={{ left: 50, right: 50, top: 40, bottom: 30 }}
    />
  );
}

// 4. Partículas en suspensión (AreaChart)
export const ParticulasChart = ({ datos }) => {
  if (!datos || datos.length === 0) {
    return <p className="text-center text-gray-500 py-10">Esperando lecturas en tiempo real...</p>;
  }
  return (
    <LineChart
      dataset={datos}
      xAxis={[{ scaleType: 'point', dataKey: 'time' }]}
      series={[
        { dataKey: 'pm25', label: 'PM2.5 (µg/m³)', color: '#f59e0b', area: true, showMark: true },
        { dataKey: 'pm10', label: 'PM10 (µg/m³)', color: '#ef4444', area: true, showMark: true },
      ]}
      height={300}
      margin={{ left: 50, right: 20, top: 40, bottom: 30 }}
    />
  );
};

// 5. Monóxido de Carbono (LineChart)
export const COChart = ({ datos }) => {
  if (!datos || datos.length === 0) {
    return <p className="text-center text-gray-500 py-10">Esperando lecturas en tiempo real...</p>;
  }
  return (
    <LineChart
      dataset={datos}
      xAxis={[{ scaleType: 'point', dataKey: 'time' }]}
      series={[
        { dataKey: 'co', label: 'CO (ppm)', color: '#ef4444', showMark: true },
      ]}
      height={300}
      margin={{ left: 50, right: 20, top: 40, bottom: 30 }}
    />
  );
};

// 6. Voltaje y Humedad (LineChart with 2 axes)
export const VoltajeHumedadChart = ({ datos }) => {
  if (!datos || datos.length === 0) {
    return <p className="text-center text-gray-500 py-10">Esperando lecturas en tiempo real...</p>;
  }
  return (
    <LineChart
      dataset={datos}
      xAxis={[{ scaleType: 'point', dataKey: 'time' }]}
      yAxis={[
        { id: 'voltAxis', position: 'left' },
        { id: 'humAxis', position: 'right' },
      ]}
      series={[
        { dataKey: 'voltaje', label: 'Voltaje (V)', color: '#a855f7', showMark: true, yAxisId: 'voltAxis' },
        { dataKey: 'humedad', label: 'Humedad (%)', color: '#06b6d4', showMark: true, yAxisId: 'humAxis' },
      ]}
      height={300}
      margin={{ left: 40, right: 50, top: 40, bottom: 30 }}
    />
  );
};
