import { useEffect, useState } from 'react';
import { Activity, Thermometer, Wind, CloudOff, Zap } from "lucide-react";
import { Cards } from "../components/Cards";
import View from "../components/View";
import Monitor from "../components/Monitor";

export function Panel() {

    const [datosSensores, setDatosSensores] = useState({
        1: 0, // Temperatura
        2: 0, // Humedad
        3: 0, // Presión
        4: 0  // Calidad del Aire
    });



       useEffect(() => {
        // Escuchamos el canal
        window.Echo.channel('dashboard-ambiental')
            // 👇 AGREGA EL PUNTO AQUÍ 👇
            .listen('.nuevos-datos', (e) => {
                console.log('Datos recibidos del backend:', e);
                if (e.metricas && Array.isArray(e.metricas)) {
                    setDatosSensores(prevDatos => {
                        const nuevosDatos = { ...prevDatos };
                        e.metricas.forEach(metrica => {
                            nuevosDatos[metrica.tipo_metrica_id] = Number(metrica.valor);
                        });
                        return nuevosDatos;
                    });
                }
            });

        // Escuchamos el canal de alertas
        window.Echo.channel('channel-alerta')
            .listen('.alerta-datos', (e) => {
                console.log('Alerta recibida del backend:', e.alerta);
            });

        return () => {
            window.Echo.leaveChannel('dashboard-ambiental');
            window.Echo.leaveChannel('channel-alerta');
        };
    }, []);

    console.log('Datos actuales del sensor:', datosSensores);

     

    return (
        <div className="w-full h-full flex flex-col ">
            <div className="flex justify-between items-center p-3">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard de Monitorización</h1>
                    <p>Vista en tiempo real de todos los sensores</p>
                </div>
                <div className="flex gap-2">
                    <Activity className=" text-gray-500" />
                    <p>Actualizacion en vivo</p>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-4 p-3">
                {/* Aquí puedes agregar más tarjetas con diferentes métricas o información relevante */}
                <Cards title="Dispositivos" value="15" icon={<Activity />} text="Dispositivos en funcionamiento" color="text-green-500" />
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

            <div className="flex flex-row">
                <View title="Comparación entre Dispositivos" text="Valores actuales de todos los sensores activos">

                </View>

                <View title="Calidad del Aire" text="Análisis radar de parámetros ambientales">

                </View>
            </div>
            <div className="flex flex-row">
                <View title="Comparación entre Dispositivos" text="Valores actuales de todos los sensores activos">

                </View>

                <View title="Calidad del Aire" text="Análisis radar de parámetros ambientales">

                </View>
            </div>
            <div className="flex flex-row">
                <View title="Comparación entre Dispositivos" text="Valores actuales de todos los sensores activos">

                </View>

                <View title="Calidad del Aire" text="Análisis radar de parámetros ambientales">

                </View>
            </div>

            <View title="Comparación entre Dispositivos" text="Valores actuales de todos los sensores activos">

            </View>
        </div>
    )
}