import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import CardsDispositivos from "../components/Cards/CardsDispositivos";
import { getDispositivosApi } from "../services/getDispositivos";
import { eliminarDispositivoApi } from "../services/guardarDispositivo";
import DialogDispositivos from "../components/Dialog/DialogDispositivos";
import DialogDispositivosEdit from "../components/Dialog//DialogDispositivoEdit";
import Loader from "../components/Loader";

export default function Dispositivos() {
    const [dispositivos, setDispositivos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDialogOpenEdit, setIsDialogOpenEdit] = useState(false);
    const [dispositivoId, setDispositivoId] = useState(null);
    const [dispositivoSeleccionado, setDispositivoSeleccionado] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDispositivos();
    }, [navigate]);

    const fetchDispositivos = async () => {
        setLoading(true);
        try {
            const data = await getDispositivosApi();
            setDispositivos(data);
            console.log(data);
        } catch (error) {
            if (error.message.includes('401') || error.message.includes('obtener los dispositivos')) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAgregarDispositivo = () => {
        setIsDialogOpen(true);
    }
    const handleEditarDispositivo = (dispositivo) => {
        setIsDialogOpenEdit(true);
        setDispositivoSeleccionado(dispositivo);
        setDispositivoId(dispositivo.dispositivo.id); // Ajusta esto según la estructura real de tu objeto dispositivo
    }

    const handleEliminarDispositivo = async (id) => {
        // Aquí puedes implementar la lógica para eliminar la métrica usando su ID
        console.log("Eliminar métrica con ID:", id);

        if (window.confirm("¿Estás seguro de que deseas eliminar esta métrica?")) {
            eliminarDispositivoApi(id)
                .then(() => {
                    alert("Dispositivo eliminado exitosamente.");
                    fetchDispositivos(); // Refresca la lista de dispositivos después de eliminar
                })
                .catch((error) => {
                    console.error("Error al eliminar el dispositivo:", error);
                    alert("Ocurrió un error al eliminar el dispositivo.");
                });
                    }
    }


    if (loading) {
        return <Loader message="Cargando dispositivos IoT..." />;
    }

    return (
        <div className="w-full h-full flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Gestionar Dispositivos</h1>
                    <p className="text-sm text-gray-500">Administrar los dispositivos IoT conectados</p>
                </div>
                <div className="w-full sm:w-auto">
                    <Button children="Ingresar Dispositivo" estile="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto" onClick={handleAgregarDispositivo} />
                </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dispositivos.map((dispositivo) => {
                    const tokenParaMostrar = dispositivo.dispositivo.token || localStorage.getItem(`token_dispositivo_${dispositivo.dispositivo.nombre}`) || "Sin token";

                
                    return (
                        <CardsDispositivos
                            key={dispositivo.dispositivo.nombre}
                            nombre={dispositivo.dispositivo.nombre}
                            ubicacion={dispositivo.dispositivo.ubicacion}
                            mac={dispositivo.dispositivo.MAC}
                            token={dispositivo.dispositivo.token_id}
                            estado={dispositivo.dispositivo.estado ? "En línea" : "Desconectado"}
                            onClickEditar={() => handleEditarDispositivo(dispositivo)}
                            onClickEliminar={() => handleEliminarDispositivo(dispositivo.dispositivo.id)}
                        />
                    );
                })}
            </div>

            {isDialogOpen && (
                <DialogDispositivos
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    onDispositivoAgregado={fetchDispositivos}
                />
            )}

            {isDialogOpenEdit && (
                <DialogDispositivosEdit
                    isOpen={isDialogOpenEdit}
                    onClose={() => setIsDialogOpenEdit(false)}
                    onDispositivoAgregado={fetchDispositivos}
                    id={dispositivoId} // Assuming each dispositivo has an 'id' property
                    dispositivo={dispositivoSeleccionado}
                />
            )}

        </div>
    );
}