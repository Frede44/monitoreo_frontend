import { useEffect, useState } from 'react';
import { Activity, Thermometer, Wind, CloudOff, Zap } from "lucide-react";
import { Cards } from "../components/Cards";
import View from "../components/View";
import Monitor from "../components/Monitor";
import Echo from "laravel-echo";
import Pusher from 'pusher-js';

window.Pusher = Pusher;

// Configuración de Echo (apuntando a tu servidor Reverb o Pusher)
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true
});

export function Panel() {

    const [datosSensores, setDatosSensores] = useState({
        valor: 0,
        tipo_metrica_id: 0,
    });


       useEffect(() => {
        // Escuchamos el canal
        window.Echo.channel('dashboard-ambiental')
            // 👇 AGREGA EL PUNTO AQUÍ 👇
            .listen('.nuevos-datos', (e) => {
                setDatosSensores(prevDatos => {
                    let nuevosDatos = { ...prevDatos };

                    // Aquí debes mapear los datos que recibes del evento a tu estado
                    // Por ejemplo, si el evento tiene un campo 'valor' y 'tipo_metrica_id':
                    nuevosDatos.valor = e.valor; // Ajusta esto según la estructura de tu evento
                    nuevosDatos.tipo_metrica_id = e.tipo_metrica_id; // Ajusta esto según la estructura de tu evento
                    
                    console.log('Datos actualizados:', e);
                    return nuevosDatos;
                });
            });

        return () => {
            window.Echo.leaveChannel('dashboard-ambiental');
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
                <Cards title="Temperatura" value={datosSensores.valor} icon={<Thermometer />} text="Promedio de temperatura" color="text-yellow-500" />
                <Cards title="CO2" value="99.8%" icon={<Wind />} text="Nivel de dióxido de carbono" color="text-blue-500" />
                <Cards title="PM2.5" value="2" icon={<CloudOff />} text="Partículas en suspensión" color="text-orange-500" />
                <Cards title="Voltaje" value="0.2%" icon={<Zap />} text="Tasa de error eléctrico" color="text-red-500" />

            </div>

            <View title="Monitoreo en tiempo real" text="Valores actuales del dispositivo seleccionado" estilos="   flex flex-row justify-between">
                {/* Aquí puedes agregar gráficos o tablas para mostrar datos más detallados */}
                <Monitor valor={datosSensores.valor} maxValor={100} unidad="°C" magnitud="Temperatura" />
                <Monitor valor={100} maxValor={100} unidad="°C" magnitud="Temperatura" />
                <Monitor valor={100} maxValor={100} unidad="°C" magnitud="Temperatura" />
                <Monitor valor={100} maxValor={100} unidad="°C" magnitud="Temperatura" />
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