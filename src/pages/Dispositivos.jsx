import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import CardsDispositivos from "../components/CardsDispositivos";
import { getDispositivosApi } from "../services/getDispositivos";
import DialogDispositivos from "../components/DialogDispositivos";
import DialogDispositivosEdit from "../components/DialogDispositivoEdit";

export default function Dispositivos() {
    const [dispositivos, setDispositivos] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDialogOpenEdit, setIsDialogOpenEdit] = useState(false);
    const [dispositivoId, setDispositivoId] = useState(null);
    const [dispositivoSeleccionado, setDispositivoSeleccionado] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDispositivos();
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

    const handleAgregarDispositivo = () => {
        setIsDialogOpen(true);
    }
    const handleEditarDispositivo = (dispositivo) => {
        setIsDialogOpenEdit(true);
        setDispositivoSeleccionado(dispositivo);
        setDispositivoId(dispositivo.dispositivo.id); // Ajusta esto según la estructura real de tu objeto dispositivo
    }


    return (
        <div className="w-full h-full flex flex-col gap-4">
            <div className="flex flex-row justify-between p-4">
                <div >
                    <h1 className="text-3xl font-bold">Gestionar Dispositivos</h1>
                    <p>Administrar los dispositivos loT conectados</p>
                </div>
                <div>
                    <Button children="Ingresar Dispositivo" estile="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={handleAgregarDispositivo} />
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
                            token={tokenParaMostrar}
                            estado={dispositivo.dispositivo.estado ? "En línea" : "Desconectado"}
                            onClickEditar={() => handleEditarDispositivo(dispositivo)}
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