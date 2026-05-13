import { Activity, Thermometer, Wind, CloudOff,Zap } from "lucide-react";
import { Cards } from "../components/Cards";
import View from "../components/View";
import Monitor from "../components/Monitor";

export function Panel() {
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
                <Cards title="Sensores Activos" value="15" icon={<Activity />} text="Sensores en funcionamiento" color="text-green-500" />
                <Cards title="Alertas" value="3" icon={<Thermometer />} text="Alertas pendientes" color="text-yellow-500" />
                <Cards title="Uptime" value="99.8%" icon={<Wind />} text="Tiempo de actividad" color="text-blue-500" />
                <Cards title="Mantenimiento" value="2" icon={<CloudOff />} text="Equipos en mantenimiento" color="text-orange-500" />
                <Cards title="Error Rate" value="0.2%" icon={<Zap />} text="Tasa de error" color="text-red-500" />

            </div>

            <View title="Monitoreo en tiempo real" text="Valores actuales del dispositivo seleccionado" estilos="   flex flex-row justify-between">
                {/* Aquí puedes agregar gráficos o tablas para mostrar datos más detallados */}
                <Monitor valor={100} maxValor={100} unidad="°C" magnitud="Temperatura" />
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