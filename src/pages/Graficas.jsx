import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cpu, FlaskConical, Calendar, TrendingUp, TrendingDown, Database, Activity, Download, AlertCircle } from 'lucide-react';
import { getDispositivosApi } from "../services/getDispositivos";
import { metricasApi } from "../services/metricasService";
import { getLecturasPorFechaApi } from "../services/lecturasService";
import Loader from "../components/Loader";
import View from "../components/View";
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';

export default function Graficas() {
    const navigate = useNavigate();
    const [dispositivos, setDispositivos] = useState([]);
    const [metricas, setMetricas] = useState([]);
    const [lecturas, setLecturas] = useState([]);
    
    // Form States
    const [dispositivoId, setDispositivoId] = useState("");
    const [metricaId, setMetricaId] = useState("");
    
    // Default range dates (last 7 days)
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    const formatDate = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const [fechaInicio, setFechaInicio] = useState(formatDate(sevenDaysAgo));
    const [fechaFin, setFechaFin] = useState(formatDate(today));
    
    // UI States
    const [loadingInit, setLoadingInit] = useState(true);
    const [loadingData, setLoadingData] = useState(false);
    const [searched, setSearched] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [chartType, setChartType] = useState("line"); // 'line' | 'area' | 'bar'

    // Load initial devices and metric types
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [devicesData, metricsData] = await Promise.all([
                    getDispositivosApi(),
                    metricasApi()
                ]);
                
                setDispositivos(devicesData);
                setMetricas(metricsData.data || []);
                
                // Select first items by default if available
                if (devicesData.length > 0) {
                    setDispositivoId(devicesData[0].dispositivo?.id || "");
                }
                if (metricsData.data && metricsData.data.length > 0) {
                    setMetricaId(metricsData.data[0].id || "");
                }
            } catch (error) {
                console.error("Error al cargar datos iniciales:", error);
                if (error.message.includes('401')) {
                    navigate('/login');
                }
            } finally {
                setLoadingInit(false);
            }
        };

        loadInitialData();
    }, [navigate]);

    const handleBuscar = async (e) => {
        if (e) e.preventDefault();
        
        if (!dispositivoId || !metricaId || !fechaInicio || !fechaFin) {
            setErrorMsg("Por favor, complete todos los campos de selección.");
            return;
        }

        if (new Date(fechaInicio) > new Date(fechaFin)) {
            setErrorMsg("La fecha de inicio no puede ser mayor que la fecha de fin.");
            return;
        }

        setErrorMsg("");
        setLoadingData(true);
        setSearched(true);
        
        try {
            const data = await getLecturasPorFechaApi(fechaInicio, fechaFin, metricaId, dispositivoId);
            // Re-map readings from API to handle array structure
            if (data && Array.isArray(data)) {
                setLecturas(data);
            } else if (data && data.data && Array.isArray(data.data)) {
                setLecturas(data.data);
            } else {
                setLecturas([]);
            }
        } catch (error) {
            console.error("Error al consultar lecturas:", error);
            setErrorMsg("Error al conectar con la API para traer el historial.");
        } finally {
            setLoadingData(false);
        }
    };

    // Calculate metrics details
    const selectedMetric = metricas.find(m => String(m.id) === String(metricaId));
    const selectedMetricName = selectedMetric ? selectedMetric.nombre : "Lectura";
    const selectedMetricUnit = selectedMetric ? selectedMetric.unidad : "";

    const totalLecturas = lecturas.length;
    const valoresNumericos = lecturas.map(l => Number(l.valor)).filter(v => !isNaN(v));
    
    const valorPromedio = totalLecturas > 0 
        ? (valoresNumericos.reduce((a, b) => a + b, 0) / totalLecturas).toFixed(2)
        : 0;
        
    const valorMaximo = totalLecturas > 0 
        ? Math.max(...valoresNumericos)
        : 0;
        
    const valorMinimo = totalLecturas > 0 
        ? Math.min(...valoresNumericos)
        : 0;

    // Get chart datasets
    const chartDataset = lecturas.map(item => {
        const dateObj = new Date(item.created_at);
        const timeFormatted = dateObj.toLocaleString([], {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        return {
            time: timeFormatted,
            valor: Number(item.valor)
        };
    }).reverse(); // Reverse to display chronologically from oldest to newest

    const getMetricColor = (id) => {
        const colors = {
            1: '#ef4444', // Monóxido de Carbono: Rojo
            2: '#3b82f6', // Temperatura: Azul
            3: '#10b981', // Humedad: Esmeralda
            4: '#f59e0b', // Presión: Ámbar
        };
        return colors[id] || '#6366f1'; // Por defecto indigo
    };

    const exportToCSV = () => {
        if (lecturas.length === 0) return;
        
        const headers = ["ID", "Fecha_Lectura", "Dispositivo", "Ubicacion", "Metrica", "Valor", "Unidad"];
        const rows = lecturas.map(item => [
            item.id,
            item.created_at,
            item.lectura?.dispositivo?.nombre || `Sensor ${item.lectura?.dispositivo?.id || ''}`,
            item.lectura?.dispositivo?.ubicacion || "",
            item.tipo_metrica?.nombre || "",
            item.valor,
            item.tipo_metrica?.unidad || ""
        ]);
        
        const csvContent = [
            headers.join(","),
            ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
        ].join("\n");
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        
        const deviceName = (lecturas[0]?.lectura?.dispositivo?.nombre || 'sensor').replace(/\s+/g, '_');
        const metricName = (lecturas[0]?.tipo_metrica?.nombre || 'lectura').replace(/\s+/g, '_');
        link.setAttribute("download", `reporte_${deviceName}_${metricName}_${fechaInicio}_a_${fechaFin}.csv`);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loadingInit) {
        return <Loader message="Cargando configuración de gráficos..." />;
    }

    return (
        <div className="w-full h-full flex flex-col gap-5 p-1">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 flex items-center gap-2">
                        <TrendingUp className="text-indigo-600 w-8 h-8" />
                        Historial de Lecturas
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">Grafica, analiza y exporta las métricas de tus sensores en rangos de fechas personalizados.</p>
                </div>
            </div>

            {/* Error alerts */}
            {errorMsg && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-3 shadow-sm">
                    <AlertCircle className="text-red-500 shrink-0" size={20} />
                    <p className="text-sm font-medium text-red-800">{errorMsg}</p>
                </div>
            )}

            {/* Search Filters Card */}
            <form onSubmit={handleBuscar} className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm flex flex-col lg:flex-row gap-4 items-stretch lg:items-end">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                    {/* Device Select */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1.5">
                            <Cpu size={14} className="text-indigo-500" /> Dispositivo
                        </label>
                        <select
                            value={dispositivoId}
                            onChange={(e) => setDispositivoId(e.target.value)}
                            className="w-full border border-zinc-200 hover:border-zinc-300 rounded-xl p-3 bg-zinc-50/50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all text-sm text-zinc-800 focus:outline-none"
                        >
                            <option value="">Seleccione dispositivo</option>
                            {dispositivos.map((item) => (
                                <option key={item.dispositivo?.id} value={item.dispositivo?.id}>
                                    {item.dispositivo?.nombre || `Sensor ${item.dispositivo?.id}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Metric Select */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1.5">
                            <FlaskConical size={14} className="text-indigo-500" /> Métrica
                        </label>
                        <select
                            value={metricaId}
                            onChange={(e) => setMetricaId(e.target.value)}
                            className="w-full border border-zinc-200 hover:border-zinc-300 rounded-xl p-3 bg-zinc-50/50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all text-sm text-zinc-800 focus:outline-none"
                        >
                            <option value="">Seleccione métrica</option>
                            {metricas.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.nombre} ({item.unidad})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date Start */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1.5">
                            <Calendar size={14} className="text-indigo-500" /> Fecha Inicio
                        </label>
                        <input
                            type="date"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            className="w-full border border-zinc-200 hover:border-zinc-300 rounded-xl p-3 bg-zinc-50/50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all text-sm text-zinc-800 focus:outline-none"
                        />
                    </div>

                    {/* Date End */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1.5">
                            <Calendar size={14} className="text-indigo-500" /> Fecha Fin
                        </label>
                        <input
                            type="date"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            className="w-full border border-zinc-200 hover:border-zinc-300 rounded-xl p-3 bg-zinc-50/50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all text-sm text-zinc-800 focus:outline-none"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loadingData}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-md shadow-indigo-100 active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-sm shrink-0"
                >
                    {loadingData ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : (
                        <>
                            <TrendingUp size={16} />
                            <span>Graficar</span>
                        </>
                    )}
                </button>
            </form>

            {/* Results Section */}
            {loadingData ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-zinc-200">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mb-4"></div>
                    <p className="text-zinc-500 text-sm font-semibold">Consultando lecturas históricas...</p>
                </div>
            ) : searched ? (
                lecturas.length > 0 ? (
                    <div className="flex flex-col gap-5">
                        {/* Stats Dashboard */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <Database size={22} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Lecturas</p>
                                    <p className="text-2xl font-extrabold text-zinc-800 mt-0.5">{totalLecturas}</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <Activity size={22} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Valor Promedio</p>
                                    <p className="text-2xl font-extrabold text-zinc-800 mt-0.5">
                                        {valorPromedio} <span className="text-xs font-semibold text-zinc-500">{selectedMetricUnit}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
                                <div className="p-3 bg-red-50 text-red-500 rounded-xl">
                                    <TrendingUp size={22} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Valor Máximo</p>
                                    <p className="text-2xl font-extrabold text-zinc-800 mt-0.5">
                                        {valorMaximo} <span className="text-xs font-semibold text-zinc-500">{selectedMetricUnit}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
                                <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
                                    <TrendingDown size={22} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Valor Mínimo</p>
                                    <p className="text-2xl font-extrabold text-zinc-800 mt-0.5">
                                        {valorMinimo} <span className="text-xs font-semibold text-zinc-500">{selectedMetricUnit}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Chart Container */}
                        <View title={`Tendencia: ${selectedMetricName}`} text={`Datos registrados entre ${fechaInicio} y ${fechaFin}`}>
                            <div className="flex flex-col gap-4 w-full">
                                {/* Chart type selector */}
                                <div className="flex bg-zinc-100/80 border border-zinc-200/55 p-1 rounded-xl gap-1 self-end shadow-inner">
                                    <button
                                        type="button"
                                        onClick={() => setChartType('line')}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${chartType === 'line' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
                                    >
                                        Línea
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setChartType('area')}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${chartType === 'area' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
                                    >
                                        Área
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setChartType('bar')}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${chartType === 'bar' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
                                    >
                                        Barras
                                    </button>
                                </div>

                                {/* Plot area */}
                                <div className="overflow-x-auto w-full min-h-[360px] flex items-center justify-center">
                                    {chartType === 'bar' ? (
                                        <BarChart
                                            dataset={chartDataset}
                                            xAxis={[{ scaleType: 'band', dataKey: 'time' }]}
                                            series={[{ 
                                                dataKey: 'valor', 
                                                label: `${selectedMetricName} (${selectedMetricUnit})`, 
                                                color: getMetricColor(metricaId) 
                                            }]}
                                            height={350}
                                            margin={{ left: 50, right: 20, top: 40, bottom: 40 }}
                                        />
                                    ) : (
                                        <LineChart
                                            dataset={chartDataset}
                                            xAxis={[{ scaleType: 'point', dataKey: 'time' }]}
                                            series={[{ 
                                                dataKey: 'valor', 
                                                label: `${selectedMetricName} (${selectedMetricUnit})`, 
                                                color: getMetricColor(metricaId),
                                                area: chartType === 'area',
                                                showMark: chartDataset.length < 50
                                            }]}
                                            height={350}
                                            margin={{ left: 50, right: 20, top: 40, bottom: 40 }}
                                        />
                                    )}
                                </div>
                            </div>
                        </View>

                        {/* Raw Data List & CSV Export */}
                        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden p-3">
                            <div className="p-5 border-b border-zinc-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <div>
                                    <h3 className="font-bold text-zinc-800 text-lg">Historial de Lecturas Registradas</h3>
                                    <p className="text-xs text-zinc-500 mt-0.5">Mostrando registros detallados en orden cronológico inverso.</p>
                                </div>
                                <button
                                    onClick={exportToCSV}
                                    className="flex items-center gap-2 border border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700 font-semibold py-2 px-4 rounded-xl transition-all shadow-sm cursor-pointer text-sm"
                                >
                                    <Download size={15} />
                                    <span>Exportar CSV</span>
                                </button>
                            </div>

                            <div className="overflow-x-auto w-full max-h-[400px]">
                                <table className="w-full text-sm text-left text-zinc-500">
                                    <thead className="text-xs text-zinc-700 uppercase bg-zinc-50 sticky top-0 shadow-sm z-10">
                                        <tr>
                                            <th scope="col" className="px-6 py-4">ID</th>
                                            <th scope="col" className="px-6 py-4">Fecha/Hora</th>
                                            <th scope="col" className="px-6 py-4">Dispositivo</th>
                                            <th scope="col" className="px-6 py-4">Ubicación</th>
                                            <th scope="col" className="px-6 py-4">Métrica</th>
                                            <th scope="col" className="px-6 py-4">Valor</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-200">
                                        {lecturas.map((item) => (
                                            <tr key={item.id} className="bg-white hover:bg-zinc-50/80 transition-all">
                                                <td className="px-6 py-4 font-semibold text-zinc-950">{item.id}</td>
                                                <td className="px-6 py-4 text-zinc-600">{new Date(item.created_at).toLocaleString()}</td>
                                                <td className="px-6 py-4 font-medium text-zinc-850">
                                                    {item.lectura?.dispositivo?.nombre || `Sensor ${item.lectura?.dispositivo?.id}`}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-zinc-100 text-zinc-600 text-xs px-2.5 py-1 rounded-full font-medium">
                                                        {item.lectura?.dispositivo?.ubicacion || "-"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-zinc-600">{item.tipo_metrica?.nombre || "Lectura"}</td>
                                                <td className="px-6 py-4 font-bold text-zinc-900">
                                                    {item.valor} <span className="text-xs font-normal text-zinc-400">{item.tipo_metrica?.unidad}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-zinc-200">
                        <AlertCircle className="text-zinc-400 mb-3" size={48} />
                        <h3 className="font-bold text-zinc-800 text-lg">No se encontraron datos</h3>
                        <p className="text-zinc-500 text-sm mt-1 text-center max-w-md">No hay lecturas registradas para el dispositivo y métrica seleccionados dentro del rango de fechas especificado.</p>
                    </div>
                )
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-zinc-200 border-dashed">
                    <TrendingUp className="text-zinc-300 mb-3" size={48} />
                    <h3 className="font-bold text-zinc-800 text-lg">Consulta Histórica</h3>
                    <p className="text-zinc-500 text-sm mt-1 text-center max-w-sm">Seleccione sus filtros arriba y presione el botón <strong>Graficar</strong> para visualizar las lecturas del sensor.</p>
                </div>
            )}
        </div>
    );
}
