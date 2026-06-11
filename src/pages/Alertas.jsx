
import { useState } from "react";
import { useEffect } from "react";
import Button from "../components/Button";
import { CardAlertas } from "../components/Cards/CardsAlertas";
import DialogAlertas from "../components/Dialog/DialogAlertas";
import DialogAlertasEdit from "../components/Dialog/DialogAlertasEdit";
import { getAlertasApi, cambiarEstadoAlertaApi, deleteAlertasApi } from "../services/alertaService";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

export function Alertas() {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [alertaSeleccionada, setAlertaSeleccionada] = useState(null);
    const [alertas, setAlertas] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const openDialog = () => {
        setIsOpen(true);
    };

    const fetchAlertas = async (showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            const data = await getAlertasApi();
            setAlertas(data);
            console.log(data);
        } catch (error) {
            if (error.message.includes('401') || error.message.includes('obtener las alertas')) {
                navigate('/login');
            }
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    const handleDeleteAlerta = async (alertaId) => {
        try {
            await deleteAlertasApi(alertaId);
            setAlertas((prevAlertas) =>
                prevAlertas.filter((alerta) => (alerta.trigger?.id || alerta.id) !== alertaId)
            );
        } catch (error) {
            console.error("Error al eliminar la alerta:", error);
        }
    };

    useEffect(() => {
        fetchAlertas(true);
    }, []);

    const handleToggleEstado = async (alertaId) => {
        try {
            await cambiarEstadoAlertaApi(alertaId);
            setAlertas((prevAlertas) =>
                prevAlertas.map((alerta) => {
                    const currentId = alerta.trigger?.id || alerta.id;
                    if (currentId === alertaId) {
                        if (alerta.trigger && alerta.trigger.estado !== undefined) {
                            return {
                                ...alerta,
                                trigger: {
                                    ...alerta.trigger,
                                    estado: alerta.trigger.estado === 1 ? 0 : 1
                                }
                            };
                        } else {
                            return {
                                ...alerta,
                                estado: alerta.estado === 1 ? 0 : 1
                            };
                        }
                    }
                    return alerta;
                })
            );
        } catch (error) {
            console.error("Error al cambiar el estado de la alerta:", error);
        }
    };

    if (loading) {
        return <Loader message="Cargando configuración de alertas..." />;
    }

    return (
        <div className="w-full h-full flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold ">Gestión de Alertas</h1>
                    <p className="text-sm text-gray-500">Configura alertas y umbrales de monitorización</p>
                </div>
                <Button estile="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto" onClick={openDialog}>
					Nueva Alerta
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
                {alertas.map((alerta) => (
                    <CardAlertas 
                        key={alerta.id}
                        parametro={alerta.trigger.nombre}
                        valMin={alerta.trigger.cantidad_min}
                        valMax={alerta.trigger.cantidad_max}
                        sensor={alerta.dispositivo.nombre}
                        ubicacion={alerta.dispositivo.ubicacion}
                        estado={alerta.trigger?.estado !== undefined ? alerta.trigger.estado : alerta.estado}
                        onToggle={() => handleToggleEstado(alerta.trigger?.id || alerta.id)}
                        onClickEditar={() => {
                            setAlertaSeleccionada(alerta);
                            setIsEditOpen(true);
                        }}  
                        onClickEliminar={() => handleDeleteAlerta(alerta.trigger?.id || alerta.id)}
                    
                    />
                ))}
            </div>

            {isOpen && (
                <DialogAlertas 
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}  
                    onAlertaCreada={() => fetchAlertas(false)}
                />
            )}

            {isEditOpen && (
                <DialogAlertasEdit 
                    isOpen={isEditOpen}
                    onClose={() => {
                        setIsEditOpen(false);
                        setAlertaSeleccionada(null);
                    }}  
                alerta={alertaSeleccionada}
                    onAlertaEditada={() => fetchAlertas(false)}
                />
            )}
        </div>
    )
}