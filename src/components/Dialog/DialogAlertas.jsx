import { useState, useEffect } from "react";
import { getDispositivosApi } from "../../services/getDispositivos";
import { useNavigate } from "react-router-dom";
import View from "../View";
import Button from "../Button";
import { metricasApi, postAlertasApi } from "../../services/alertaService";



export default function DialogAlertas({ isOpen, onClose, onAlertaCreada }) {
    const [dispositivos, setDispositivos] = useState([]);
    const [metricas, setMetricas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [nombre, setNombre] = useState('');
    const [dispositivoId, setDispositivoId] = useState('');
    const [metricaId, setMetricaId] = useState('');
    const [cantidad_min, setCantidadMin] = useState('');
    const [cantidad_max, setCantidadMax] = useState('');
    
    const navigate = useNavigate();

    if (!isOpen) return null;

    useEffect(() => {
        fetchDispositivos();
        fetchMetricas();
    }, [navigate]);

    const fetchDispositivos = async () => {
        try {
            const data = await getDispositivosApi();
            setDispositivos(data);
            console.log(data);
        } catch (error) {
            if (error.message.includes('401') || error.message.includes('obtener los dispositivos')) {
                navigate('/login');
            }
        }
    };

    const fetchMetricas = async () => {
        try {
            const data = await metricasApi();
            setMetricas(data.data);
            console.log(data.data);
        } catch (error) {
            if (error.message.includes('401') || error.message.includes('obtener las métricas')) {
                navigate('/login');
            }
        }
    };

    const handleSubmit = async  (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = await postAlertasApi({
                nombre,
                dispositivoId,
                metricaId,
                cantidad_max: Number(cantidad_max),
                cantidad_min: Number(cantidad_min)
            });
            if (onAlertaCreada) {
                onAlertaCreada();
            }
        } catch (error) {
            console.error('Error al crear la alerta:', error);
        } finally {
            setIsLoading(false);
            setNombre('');
            setDispositivoId('');
            setMetricaId('');
            setCantidadMin('');
            setCantidadMax('');
        }
    
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs" onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()} className="max-w-md w-full m-4">
                <View title="Nueva Alerta" text="Configura una nueva alerta de monitorización" estilos="p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="Nombre de la alerta" className="block text-sm font-medium text-black">Nombre de la alerta</label>
                            <input 
                                type="text" 
                                id="Nombre de la alerta" 
                                placeholder="Ej: CO2 Alto - Oficina" 
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className="mt-1 p-2 block w-full border border-gray-400 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                                required
                            />
                        </div >
                        <div className="mb-4">
                            <label htmlFor="Dispositivo" className="block text-sm font-medium text-black">Dispositivo</label>
                            <select 
                                id="Dispositivo" 
                                value={dispositivoId}
                                onChange={(e) => setDispositivoId(e.target.value)}
                                className="mt-1 p-2 block w-full border border-gray-400 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            >
                                <option value="">Seleccionar dispositivo</option>
                                {dispositivos.map((dispositivo) => (
                                    <option key={dispositivo.dispositivo.id} value={dispositivo.dispositivo.id}>{dispositivo.dispositivo.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="Tipo de alerta" className="block text-sm font-medium text-black">Tipo de alerta</label>
                                <select 
                                    id="Tipo de alerta" 
                                    value={metricaId}
                                    onChange={(e) => setMetricaId(e.target.value)}
                                    className="mt-1 p-2 block w-full border border-gray-400 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required
                                >
                                    <option value="">Seleccionar métrica</option>
                                    {metricas.map((metrica) => (
                                        <option key={metrica.id} value={metrica.id}>{metrica.nombre}</option>
                                    ))}
                                </select>
                        </div>
                        <div className="mb-4 grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="cantidad_min " className="block text-sm font-medium text-black   ">Valor minimo</label>
                                <input 
                                    type="number" 
                                    id="cantidad_min" 
                                    placeholder="Ej: 200" 
                                    value={cantidad_min}
                                    onChange={(e) => setCantidadMin(e.target.value)}
                                    className="mt-1 p-2 block w-full border border-gray-400 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                                    required
                                />
                            </div>
                            <div >
                                <label htmlFor="cantidad_max " className="block text-sm font-medium text-black   ">Valor maximo</label>
                                <input 
                                    type="number" 
                                    id="cantidad_max" 
                                    placeholder="Ej: 1000" 
                                    value={cantidad_max}
                                    onChange={(e) => setCantidadMax(e.target.value)}
                                    className="mt-1 p-2 block w-full border border-gray-400 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-2">
                            <Button type="button" onClick={onClose} estile="border ">Cancelar</Button>
                            <Button type="submit"  estile="bg-black text-white ">Crear Alerta</Button>
                        </div>
                    </form>
                </View>
            </div>
        </div>
    )
}