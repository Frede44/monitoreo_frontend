import { useState } from "react";
import Button from "../Button";
import View from "../View";
import { guardarDispositivoApi } from "../../services/guardarDispositivo";

export default function DialogDispositivos({isOpen, onClose, onDispositivoAgregado}) {
    const [nombre, setNombre] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const respuesta = await guardarDispositivoApi({ nombre, ubicacion });
            console.log("Respuesta del backend:", respuesta);
            // Guardamos el token en localStorage (ajusta la ruta del token según la respuesta real de tu backend)
            const token = respuesta?.token || respuesta?.dispositivo?.token;
            if (token) {
                localStorage.setItem(`token_dispositivo_${nombre}`, token);
            }

            onClose();
            if (onDispositivoAgregado) {
                onDispositivoAgregado();
            }
        } catch (error) {
            console.error("Error al guardar dispositivo:", error);
            alert("Ocurrió un error al guardar el dispositivo.");
        } finally {
            setIsLoading(false);
            setNombre('');
            setUbicacion('');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs" onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()} className="max-w-md w-full m-4">
                <View title="Agregar Dispositivo" text="Ingrese los detalles del nuevo dispositivo" estilos="p-6" >
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
                            <button type="button" onClick={onClose} className="bg-white hover:bg-gray-200 text-gray-800  py-2 px-4 rounded border text-sm font-medium" disabled={isLoading}>Cancelar</button>
                            <Button type="submit" children={isLoading ? "Guardando..." : "Agregar "} estile={`${isLoading ? 'bg-gray-500' : 'bg-black hover:bg-gray-700'} text-white py-2 px-4 rounded text-sm`} disabled={isLoading} />
                        </div>
                    </form>
                </View>
            </div>
        </div>
    )
}