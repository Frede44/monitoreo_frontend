import { useState, useEffect } from "react";
import View from "../View";
import { editMetricasApi } from "../../services/metricasService";

export default function DialogMetricasEdit({isOpen, onClose, onDispositivoAgregado, id, metrica}) {
const [isLoading, setIsLoading] = useState(false);
const [nombre, setNombre] = useState('');
const [unidad, setUnidad] = useState('');

    

    useEffect(() => {
        
        if (metrica) {
            setNombre(metrica.nombre || '');
            setUnidad(metrica.unidad || '');
        }
    }, [metrica]);

    if (!isOpen) return null;

    const handleSubmit = async (e) =>{
        e.preventDefault();
            setIsLoading(true);
            
            try{
                const respuesta = await editMetricasApi(id, { nombre, unidad });
                console.log("Respuesta del backend:", respuesta);
                onClose();

                 if (onDispositivoAgregado) {
                onDispositivoAgregado();
            }
            }catch(error){
                console.error("Error al guardar métrica:", error);
            }finally{
                setIsLoading(false);
                setNombre('');
                setUnidad('');
            }

            // Aquí puedes agregar la lógica para enviar los datos al backend o actualizar el estado de tu aplicación

    }

        return(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div>
                    <View title="Editar Métrica" text="Ingresa los detalles de la métrica que deseas editar" estilos="w-96 p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                    Nombre de la Métrica
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="nombre"
                                    type="text"
                                    placeholder="Ej: Temperatura"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="unidad">
                                    Unidad de Medida
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="unidad"
                                    type="text"
                                    placeholder="Ej: °C"
                                    value={unidad}
                                    onChange={(e) => setUnidad(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button children={isLoading ? "Guardando..." : "Guardar "} className={`${isLoading ? 'bg-gray-500' : 'bg-black hover:bg-gray-700'} text-white  py-2 px-4 rounded`} disabled={isLoading} type="submit">
                                    Guardar Métrica
                                </button>
                                <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={onClose} >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </View>
                </div>
            </div>  
        )
}