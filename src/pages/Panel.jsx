import { useEffect, useState, useRef } from 'react';
import { ComparacionDispositivosChart, CalidadAireChart, TemperaturaCO2Chart, ParticulasChart, COChart, VoltajeHumedadChart } from '../components/DashboardCharts';
import { Activity, Thermometer, Wind, CloudOff, Zap, AlertTriangle } from "lucide-react";
import { Cards } from "../components/Cards";
import View from "../components/View";
import Monitor from "../components/Monitor";
import { getCountDispositivosApi, getDispositivosApi } from '../services/getDispositivos';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';


export function Panel() {
    const [loading, setLoading] = useState(true);
    const [datosSensores, setDatosSensores] = useState({
        1: 0, // Temperatura
        2: 0, // Humedad
        3: 0, // Presión
        4: 0  // Calidad del Aire
    });

    const [datos, setDatos] = useState([]);
    const [historialLecturas, setHistorialLecturas] = useState([]);
    const [datosDispositivos, setDatosDispositivos] = useState([]);
    const [countDispositivos, setCountDispositivos] = useState(0);
    const [dispositivo, setDispositivo] = useState(null);
    const dispositivoRef = useRef(dispositivo);
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem('auth_token');

    useEffect(() => {
        dispositivoRef.current = dispositivo;
    }, [dispositivo]);
    

    // 👇 1. Importar Echo y Pusher

    useEffect(() => {
        if (!token || !user?.user_data?.id) return;

        console.log('Usuario autenticado:', user.user_data.id);

        // 👇 2. Asignar Pusher a window
        window.Pusher = Pusher;

        // 👇 3. Configurar la conexión hacia tu Laravel Reverb si no está ya creada
        if (!window.Echo) {
            window.Echo = new Echo({
                broadcaster: 'reverb',
                key: import.meta.env.VITE_REVERB_APP_KEY, 
                wsHost: import.meta.env.VITE_REVERB_HOST,
                wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
                wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
                forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
                enabledTransports: ['ws', 'wss'],
                authEndpoint: import.meta.env.VITE_API_URL_BRO,
                auth: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    }
                }
            });
        }

        const channel = window.Echo.private(`user.${user.user_data.id}`);

        // Escuchamos el canal
        channel.listen('.nuevos-datos', (e) => {
                console.log('Datos recibidos del backend:', e);
                
                // Actualizamos los datos para la gráfica (mantenemos array de dispositivos)
                setDatos((prevDatos) => {
                    const idNuevo = e.datos?.dispositivo?.id;
                    const index = prevDatos.findIndex(item => item.datos?.dispositivo?.id === idNuevo);
                    if (index !== -1) {
                        const nuevosDatos = [...prevDatos];
                        nuevosDatos[index] = e;
                        return nuevosDatos;
                    }
                    return [...prevDatos, e];
                });
               
                // Actualizamos los monitores y cards con el último dato recibido
                if( e.datos?.dispositivo?.id === parseInt(dispositivoRef.current)) {
                    if (e.datos?.metricas) {
                        const nuevosValores = {};
                        e.datos.metricas.forEach(m => {
                            nuevosValores[m.tipo_metrica_id] = m.valor;
                        });

                        // comprobar que dispositivo seleccionado es el mismo que el del dato recibido
                        setDatosSensores(nuevosValores);

                        // Agregamos al historial de las últimas 10 lecturas
                        setHistorialLecturas((prev) => {
                            const now = new Date();
                            const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                            
                            const nuevaLectura = {
                                time: formattedTime,
                                temp: nuevosValores[1] ?? 0,
                                humedad: nuevosValores[2] ?? 0,
                                presion: nuevosValores[3] ?? 0,
                                aqi: nuevosValores[4] ?? 0,
                                co2: 400 + (nuevosValores[4] ?? 0) * 3,
                                pm25: nuevosValores[4] ? Math.round(nuevosValores[4] * 0.15) : 0,
                                pm10: nuevosValores[4] ? Math.round(nuevosValores[4] * 0.4) : 0,
                                co: nuevosValores[4] ? Math.round(nuevosValores[4] * 0.2) : 0,
                                voltaje: 5.0 + (Math.random() * 0.1 - 0.05)
                            };

                            const nuevoHistorial = [...prev, nuevaLectura];
                            if (nuevoHistorial.length > 10) {
                                return nuevoHistorial.slice(nuevoHistorial.length - 10);
                            }
                            return nuevoHistorial;
                        });
                    }
                }
            });

        return () => {
            if (window.Echo) {
                window.Echo.private(`user.${user.user_data.id}`).stopListening('.nuevos-datos');
            }
        };
    }, [user, token]);

    console.log('Datos actuales del sensor:', datosSensores);
        
    
    const fetchCount = async () => {
            try {
                const count = await getCountDispositivosApi();
                setCountDispositivos(count);
                console.log('Conteo de dispositivos obtenido:', count);
            } catch (error) {
                console.error('Error al obtener el conteo de dispositivos:', error);
            }
        };

    const fetchDispostivos = async () => {
        try {
            const data = await getDispositivosApi();
            console.log('Dispositivos obtenidos:', data);
            setDatosDispositivos(data);
        } catch (error) {
            console.error('Error al obtener los dispositivos:', error);
        }
    };


    useEffect(() => {
        const loadInitialData = async () => {
            try {
                await Promise.all([fetchCount(), fetchDispostivos()]);
            } catch (error) {
                console.error('Error al cargar datos del panel:', error);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    const handleDispositivoChange = (e) => {
        const idSeleccionado = e.target.value;
        setDispositivo(idSeleccionado); 
        setHistorialLecturas([]); // Limpiamos el historial al cambiar de dispositivo
        console.log('Dispositivo seleccionado:', idSeleccionado);
    }

   

    return (
        <div className="w-full h-full flex flex-col ">
            <div className="flex justify-between items-center p-3">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard de Monitorización</h1>
                    <p>Vista en tiempo real de todos los sensores</p>
                </div>
                <div className="flex gap-2">
                   <select name="" id="" className="border border-gray-300 p-2 bg-white" onChange={handleDispositivoChange}>
                        <option value="">Seleccionar dispositivo</option>
                        {datosDispositivos.map((item) => (
                            <option key={item.dispositivo?.id} value={item.dispositivo?.id}>
                                {item.dispositivo?.nombre || `Sensor ${item.dispositivo?.id}`}
                            </option>
                        ))}
                   </select>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-4 p-3">
                {/* Aquí puedes agregar más tarjetas con diferentes métricas o información relevante */}
                <Cards title="Dispositivos" value={countDispositivos.count} icon={<Activity />} text="Dispositivos en funcionamiento" color="text-green-500" />
                <Cards title="Temperatura" value={`${datosSensores[1] ?? 0} °C`} icon={<Thermometer />} text="Promedio de temperatura" color="text-yellow-500" />
                <Cards title="Humedad" value={`${datosSensores[2] ?? 0} %`} icon={<Wind />} text="Nivel de humedad" color="text-blue-500" />
                <Cards title="Presión" value={`${datosSensores[3] ?? 0} hPa`} icon={<CloudOff />} text="Presión atmosférica" color="text-orange-500" />
                <Cards title="Calidad del Aire" value={`${datosSensores[4] ?? 0} AQI`} icon={<Zap />} text="Índice de calidad del aire" color="text-red-500" />

            </div>

            <View title="Monitoreo en tiempo real" text="Valores actuales del dispositivo seleccionado" estilos="   flex flex-row justify-between">
                {/* Aquí puedes agregar gráficos o tablas para mostrar datos más detallados */}
                <Monitor valor={datosSensores[1] ?? 0} maxValor={100} unidad="°C" magnitud="Temperatura" />
                <Monitor valor={datosSensores[2] ?? 0} maxValor={100} unidad="%" magnitud="Humedad" />
                <Monitor valor={datosSensores[3] ?? 0} maxValor={100} unidad="hPa" magnitud="Presión" />
                <Monitor valor={datosSensores[4] ?? 0} maxValor={100} unidad="AQI" magnitud="Calidad del Aire" />
            </View>

            <div className="grid grid-cols-2 gap-4 p-3">
                <View title="Comparación entre Dispositivos" text="Valores actuales de todos los sensores activos">
                    <ComparacionDispositivosChart datos={datos} />
                </View>

                <View title="Calidad del Aire" text="Análisis radar de parámetros ambientales">
                    <CalidadAireChart datos={datosSensores} />
                </View>
            </div>

            <div className="grid grid-cols-2 gap-4 p-3">
                <View title="Temperatura y CO₂ - Tendencia" text="Evolución temporal de variables">
                    <TemperaturaCO2Chart datos={historialLecturas} />
                </View>

                <View title="Partículas en Suspensión" text="PM2.5 y PM10 en el tiempo">
                    <ParticulasChart datos={historialLecturas} />
                </View>
            </div>

            <div className="grid grid-cols-2 gap-4 p-3">
                <View title="Monóxido de Carbono (CO)" text="Niveles de CO en partes por millón">
                    <COChart datos={historialLecturas} />
                </View>

                <View title="Voltaje y Humedad" text="Monitoreo de energía y humedad relativa">
                    <VoltajeHumedadChart datos={historialLecturas} />
                </View>
            </div>

            <div className="p-3">
                <View title="Estado de Dispositivos" text="Lecturas actuales de todos los sensores">
                    <div className="flex flex-col gap-4 mt-4">
                        {/* Device 1 */}

                        {datosDispositivos.map(dispositivos => {
                            const matchingDato = datos.find(d => d.datos?.dispositivo?.id === dispositivos.dispositivo?.id);
                            const temp = matchingDato?.datos?.metricas?.find(m => m.tipo_metrica_id === 1)?.valor;
                            const humedad = matchingDato?.datos?.metricas?.find(m => m.tipo_metrica_id === 2)?.valor;
                            const presion = matchingDato?.datos?.metricas?.find(m => m.tipo_metrica_id === 3)?.valor;
                            const aqi = matchingDato?.datos?.metricas?.find(m => m.tipo_metrica_id === 4)?.valor;

                            return (
                                <div key={dispositivos.id} className="border rounded-lg p-4 flex justify-between items-center shadow-sm">
                                    <div className="flex flex-col">
                                        <h3 className="font-bold text-lg">{dispositivos.dispositivo?.nombre}</h3>
                                        <p className="text-sm text-gray-500">{dispositivos.dispositivo?.ubicacion}</p>
                                        <div className="flex gap-6 mt-3">
                                            {temp !== undefined && (
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Thermometer size={16} className="text-blue-500" /> Temp: <span className="font-bold">{temp ? temp : "No disponible"}°C</span>
                                                </div>
                                            )}
                                            {humedad !== undefined && (
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Wind size={16} className="text-blue-400" /> Hum: <span className="font-bold">{humedad ? humedad : "No disponible"}%</span>
                                                </div>
                                            )}
                                            {presion !== undefined && (
                                                <div className="flex items-center gap-1 text-sm">
                                                    <CloudOff size={16} className="text-orange-500" /> Presión: <span className="font-bold">{presion ? presion : "No disponible"} hPa</span>
                                                </div>
                                            )}
                                            {aqi !== undefined && (
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Zap size={16} className="text-red-500" /> AQI: <span className="font-bold">{aqi}</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2">Última lectura: {dispositivos.dispositivo?.updated_at}</p>
                                    </div>
                                    <div>
                                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">online</span>
                                    </div>
                                </div>
                            );
                        })}
                        {/* Device 2 
                        <div className="border rounded-lg p-4 flex justify-between items-center shadow-sm">
                            <div className="flex flex-col">
                                <h3 className="font-bold text-lg">Sensor Sala de Servidores</h3>
                                <p className="text-sm text-gray-500">Sótano - Datacenter</p>
                                <div className="flex gap-6 mt-3">
                                    <div className="flex items-center gap-1 text-sm"><Thermometer size={16} className="text-blue-500" /> Temp: <span className="font-bold">22.6°C</span></div>
                                    <div className="flex items-center gap-1 text-sm"><Wind size={16} className="text-green-500" /> CO₂: <span className="font-bold">734 ppm</span></div>
                                    <div className="flex items-center gap-1 text-sm"><AlertTriangle size={16} className="text-red-500" /> CO: <span className="font-bold">10 ppm</span></div>
                                    <div className="flex items-center gap-1 text-sm"><CloudOff size={16} className="text-orange-500" /> PM2.5: <span className="font-bold">9 µg/m³</span></div>
                                    <div className="flex items-center gap-1 text-sm"><CloudOff size={16} className="text-pink-500" /> PM10: <span className="font-bold">68 µg/m³</span></div>
                                    <div className="flex items-center gap-1 text-sm"><Activity size={16} className="text-blue-400" /> Humedad: <span className="font-bold">52%</span></div>
                                    <div className="flex items-center gap-1 text-sm"><Zap size={16} className="text-purple-500" /> Voltaje: <span className="font-bold">5.09V</span></div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Última lectura: 01/06/2026, 22:00</p>
                            </div>
                            <div>
                                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">warning</span>
                            </div>
                        </div>

                        
                        <div className="border rounded-lg p-4 flex justify-between items-center shadow-sm">
                            <div className="flex flex-col">
                                <h3 className="font-bold text-lg">Sensor Laboratorio</h3>
                                <p className="text-sm text-gray-500">Planta 2 - Lab A</p>
                                <div className="flex gap-6 mt-3">
                                    <div className="flex items-center gap-1 text-sm"><Thermometer size={16} className="text-blue-500" /> Temp: <span className="font-bold">18.8°C</span></div>
                                    <div className="flex items-center gap-1 text-sm"><Wind size={16} className="text-green-500" /> CO₂: <span className="font-bold">638 ppm</span></div>
                                    <div className="flex items-center gap-1 text-sm"><AlertTriangle size={16} className="text-red-500" /> CO: <span className="font-bold">10.4 ppm</span></div>
                                    <div className="flex items-center gap-1 text-sm"><CloudOff size={16} className="text-orange-500" /> PM2.5: <span className="font-bold">3 µg/m³</span></div>
                                    <div className="flex items-center gap-1 text-sm"><CloudOff size={16} className="text-pink-500" /> PM10: <span className="font-bold">68 µg/m³</span></div>
                                    <div className="flex items-center gap-1 text-sm"><Activity size={16} className="text-blue-400" /> Humedad: <span className="font-bold">69%</span></div>
                                    <div className="flex items-center gap-1 text-sm"><Zap size={16} className="text-purple-500" /> Voltaje: <span className="font-bold">4.95V</span></div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Última lectura: 01/06/2026, 22:14</p>
                            </div>
                            <div>
                                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">online</span>
                            </div>
                        </div> */}
                        
                        {/* Offline devices message */}
                        <div className="bg-red-50 text-red-500 border border-red-200 rounded-lg p-3 w-full">
                            <h4 className="font-bold">Dispositivos Fuera de Línea</h4>
                            <p className="text-sm">Sensor Almacén - Planta Baja - Almacén</p>
                        </div>
                    </div>
                </View>
            </div>
        </div>
    )
}