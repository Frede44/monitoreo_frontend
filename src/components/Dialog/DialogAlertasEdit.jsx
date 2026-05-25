import { useState, useEffect } from "react";
import { getDispositivosApi } from "../../services/getDispositivos";
import { useNavigate } from "react-router-dom";
import View from "../View";
import Button from "../Button";
import { metricasApi, updateAlertasApi } from "../../services/alertaService";

export default function DialogAlertasEdit({ isOpen, onClose, alerta, onAlertaEditada }) {
    const [dispositivos, setDispositivos] = useState([]);
    const [metricas, setMetricas] = useState([]);
    
    const [nombre, setNombre] = useState('');
    const [dispositivoId, setDispositivoId] = useState('');
    const [metricaId, setMetricaId] = useState('');
    const [valorMin, setValorMin] = useState('');
    const [valorMax, setValorMax] = useState('');
    
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            fetchDispositivos();
            fetchMetricas();
        }
    }, [isOpen, navigate]);

    useEffect(() => {
        if (alerta) {
            setNombre(alerta.trigger?.nombre || alerta.nombre || '');
            setDispositivoId(alerta.dispositivo?.id || alerta.trigger?.dispositivo_id || alerta.dispositivoId || '');
            setMetricaId(alerta.trigger?.tipo_metrica_id || alerta.trigger?.metrica_id || alerta.trigger?.metricaId || alerta.metricaId || '');
            setValorMin(alerta.trigger?.cantidad_min !== undefined ? alerta.trigger.cantidad_min : (alerta.cantidad_min !== undefined ? alerta.cantidad_min : ''));
            setValorMax(alerta.trigger?.cantidad_max !== undefined ? alerta.trigger.cantidad_max : (alerta.cantidad_max !== undefined ? alerta.cantidad_max : ''));
        }
    }, [alerta]);

    if (!isOpen) return null;

    const fetchDispositivos = async () => {
        try {
            const data = await getDispositivosApi();
            setDispositivos(data);
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
        } catch (error) {
            if (error.message.includes('401') || error.message.includes('obtener las métricas')) {
                navigate('/login');
            }
        }
    };

    const handleSubmit = async(e) => {
      e.preventDefault();
      
      try {
         await updateAlertasApi(alerta.trigger?.id || alerta.id, {
            nombre,
            dispositivoId,
            metricaId,
            cantidad_min: Number(valorMin),
            cantidad_max: Number(valorMax),
         });
         
         if (onAlertaEditada) {
            onAlertaEditada();
         }
         onClose();
      } catch (error) {
         console.error("Error al editar la alerta:", error);
         if (error.message.includes('401')) {
            navigate('/login');
         }
      }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()}>
                <View title="Editar Alerta" text="Modifica los detalles de la alerta de monitorización" estilos="w-96 p-6">
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
                        </div>

                        <div className="mb-4">
                            <label htmlFor="Dispositivo" className="block text-sm font-medium text-black">Dispositivo</label>
                            <select 
                                id="Dispositivo" 
                                value={dispositivoId}
                                onChange={(e) => setDispositivoId(e.target.value)}
                                className="mt-1 p-2 block w-full border border-gray-400 bg-gray-100 cursor-not-allowed rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                                disabled
                            >
                                <option value="">Seleccionar dispositivo</option>
                                {dispositivos.map((dispositivo) => (
                                    <option key={dispositivo.dispositivo.id} value={dispositivo.dispositivo.id}>
                                        {dispositivo.dispositivo.nombre}
                                    </option>
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
                                    <option key={metrica.id} value={metrica.id}>
                                        {metrica.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4 grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="ValorMin" className="block text-sm font-medium text-black">Valor mínimo</label>
                                <input 
                                    type="number" 
                                    id="ValorMin" 
                                    placeholder="Ej: 200" 
                                    value={valorMin}
                                    onChange={(e) => setValorMin(e.target.value)}
                                    className="mt-1 p-2 block w-full border border-gray-400 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="cantidad_max" className="block text-sm font-medium text-black">Valor máximo</label>
                                <input 
                                    type="number" 
                                    id="cantidad_max" 
                                    placeholder="Ej: 1000" 
                                    value={valorMax}
                                    onChange={(e) => setValorMax(e.target.value)}
                                    className="mt-1 p-2 block w-full border border-gray-400 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" onClick={onClose} estile="border">Cancelar</Button>
                            <Button type="submit" estile="bg-black text-white">Editar Alerta</Button>
                        </div>
                    </form>
                </View>
            </div>
        </div>
    );
}
