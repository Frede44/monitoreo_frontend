import Button from "../components/Button";
import { FlaskConical, Trash2, Pencil } from 'lucide-react';
import { metricasApi, deleteMetricasApi } from "../services/metricasService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DialogMetricas from "../components/Dialog/DialogMetricas";
import DialogMetricasEdit from "../components/Dialog/DIalogMetricasEdit";

export default function Metricas() {
    const [metricas, setMetricas] = useState([]);
     const [isDialogOpen, setIsDialogOpen] = useState(false);
     const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
     const [metricaSeleccionada, setMetricaSeleccionada] = useState(null);
     const navigate = useNavigate();

    useEffect(() => {
        fetchMetricas();
    }, [navigate]);

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



        const handleAgregarMetrica = () => {
            setIsDialogOpen(true);
        }

        const handleEditarMetrica = (id) => {
            const metricaEdit = metricas.find(m => m.id === id);
            setMetricaSeleccionada(metricaEdit);
            setIsEditDialogOpen(true);
        }

        const handleEliminarMetrica = (id) => {
            // Aquí puedes implementar la lógica para eliminar la métrica usando su ID
                console.log("Eliminar métrica con ID:", id);

            if (window.confirm("¿Estás seguro de que deseas eliminar esta métrica?")) {
                deleteMetricasApi(id)
                    .then(() => {
                        alert("Métrica eliminada exitosamente.");
                        fetchMetricas(); // Refresca la lista de métricas después de eliminar
                    })
                    .catch((error) => {
                        console.error("Error al eliminar la métrica:", error);
                        alert("Ocurrió un error al eliminar la métrica.");
                    });
            }

        }

    return (
        <div className="w-full h-full flex flex-col gap-4">
            <div className="flex flex-row justify-between p-4">
                <div >
                    <h1 className="text-3xl font-bold">Gestionar Metricas</h1>
                    <p>Define las métricas que tus dispositivos IoT van a medir.</p>
                </div>
                <div>
                    <Button children="Ingresar Métrica" estile="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={handleAgregarMetrica} />
                </div>
            </div>

            <div className="flex flex-col p-4 gap-4">
                {metricas.map((metrica) => (
                    <div className="flex w-full justify-between bg-white items-center p-4 rounded border border-gray-300"  key={metrica.id}>
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-gray-200 rounded">
                                <FlaskConical className="w-5" />
                            </div>
                            <div className="flex flex-col">
                                <p className="font-bold">{metrica.nombre}</p>
                                <div className="flex gap-2 items-center">
                                    <p>Unidad: </p>
                                    <p className="bg-gray-200 pt-1 pb-1 pr-2 pl-2 rounded-xl">{metrica.unidad}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button children={<Trash2 className="text-red-500 w-5" />} estile="border border-gray-300 text-red-500 hover:bg-red-100 hover:text-white rounded-xm" onClick={() => {
                                handleEliminarMetrica(metrica.id);
                            }} />
                            <Button children={<Pencil className="text-gray-700 w-5" />} estile="border border-gray-300 text-gray-700 hover:bg-gray-200" onClick={() => {
                               handleEditarMetrica(metrica.id);
                            }} />
                        </div>
                    </div>
                ))}
            </div>

            {isDialogOpen && <DialogMetricas 
            isOpen={isDialogOpen} 
            onClose={() => setIsDialogOpen(false)}
            onDispositivoAgregado={fetchMetricas} />
            }

            {isEditDialogOpen && <DialogMetricasEdit
            isOpen={isEditDialogOpen} 
            onClose={() => setIsEditDialogOpen(false)}
            onDispositivoAgregado={fetchMetricas} 
            id={metricaSeleccionada.id}
            metrica={metricaSeleccionada}
            />
            }
        </div>
    )
}