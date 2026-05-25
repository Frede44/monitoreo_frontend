import { useState, useEffect } from "react";
import Button from "../Button";
import View from "../View";
import { editarDispositivoApi } from "../../services/guardarDispositivo";

export default function DialogDispositivosEdit({isOpen, onClose, onDispositivoAgregado, id, dispositivo}) {
    const [nombre, setNombre] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (dispositivo && dispositivo.dispositivo) {
            setNombre(dispositivo.dispositivo.nombre || '');
            setUbicacion(dispositivo.dispositivo.ubicacion || '');
        }
    }, [dispositivo]);

    if (!isOpen) return null;
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {

            
            const respuesta = await editarDispositivoApi(id, { nombre, ubicacion });

            onClose();
            if (onDispositivoAgregado) {
                onDispositivoAgregado();
            }
        } catch (error) {
            console.error("Error al editar dispositivo:", error);
            alert("Ocurrió un error al editar el dispositivo.");
        } finally {
            setIsLoading(false);
            setNombre('');
            setUbicacion('');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center " onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()}>
                <View title="Editar Dispositivo" text="Ingrese los detalles del dispositivo" estilos="w-96 p-6" >
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="nombre" className="block text-gray-700 font-bold ">Nombre del Dispositivo</label>
                                <input type="text" id="nombre" name="nombre" placeholder="Ej: Sensor Oficina 1" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full px-3 py-2 border rounded" required />
                            </div>
                        <div className="mb-4">
                            <label htmlFor="ubicacion" className="block text-gray-700 font-bold">Ubicación</label>
                            <input type="text" id="ubicacion" name="ubicacion" placeholder="Ej: Piso 3, Sala de Reuniones" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} className="w-full px-3 py-2 border rounded" required />
                        </div>
                        <div className="flex justify-end gap-2 mb-4">
                            <button type="button" onClick={onClose} className="bg-white hover:bg-gray-200 text-gray-800  py-2 px-4 rounded border" disabled={isLoading}>Cancelar</button>
                            <Button type="submit" children={isLoading ? "Guardando..." : "Editar "} estile={`${isLoading ? 'bg-gray-500' : 'bg-black hover:bg-gray-700'} text-white  py-2 px-4 rounded`} disabled={isLoading} />
                        </div>
                    </form>
                </View>
            </div>
        </div>
    )
}