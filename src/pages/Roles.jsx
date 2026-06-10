import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import View from "../components/View";
import CardsRoles from "../components/Cards/CardsRoles";
import DialogRoles from "../components/Dialog/DialogRoles";
import DialogRolesEdit from "../components/Dialog/DialogRolesEdit";
import { getRolesApi, deleteRolApi } from "../services/roleService";
import Loader from "../components/Loader";

export default function Roles() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDialogOpenEdit, setIsDialogOpenEdit] = useState(false);
    const [rolId, setRolId] = useState(null);
    const [rolSeleccionado, setRolSeleccionado] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRoles();
    }, [navigate]);

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const data = await getRolesApi();
            setRoles(data.roles || []);
        } catch (error) {
            console.error("Error al obtener los roles:", error);
            if (error.message.includes('401')) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAgregarRol = () => {
        setIsDialogOpen(true);
    };

    const handleEditarRol = (id) => {
        const rolEdit = roles.find(r => r.id === id);
        setRolSeleccionado(rolEdit);
        setRolId(id);
        setIsDialogOpenEdit(true);
    };

    const handleEliminarRol = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este rol? Se quitará a los usuarios asignados.")) {
            try {
                await deleteRolApi(id);
                alert("Rol eliminado exitosamente.");
                fetchRoles();
            } catch (error) {
                console.error("Error al eliminar el rol:", error);
                alert("Ocurrió un error al eliminar el rol.");
            }
        }
    };

    if (loading) {
        return <Loader message="Cargando roles y permisos..." />;
    }

    return (
        <div className="w-full h-full flex flex-col gap-4">
            <div className="flex flex-row justify-between p-4 items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Gestionar Roles y Permisos</h1>
                    <p className="text-gray-500 text-sm mt-1">Cree y configure los roles y permisos del sistema</p>
                </div>
                <div>
                    <Button 
                        children="Agregar Rol" 
                        estile="bg-black hover:bg-zinc-800 text-white font-semibold py-2.5 px-5 rounded-lg text-sm transition-colors cursor-pointer" 
                        onClick={handleAgregarRol} 
                    />
                </div>
            </div>

            <View  estilos="p-4 gap-4 flex flex-col bg-gray-50/50">
                {roles.length > 0 ? (
                    roles.map((rol) => (
                        <div key={rol.id} className="w-full">
                            <CardsRoles
                                nombre={rol.name}
                                guard={rol.guard_name}
                                permissions={rol.permissions}
                                onClickEditar={() => handleEditarRol(rol.id)}
                                onClickEliminar={() => handleEliminarRol(rol.id)}
                            />
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-400 italic bg-white border border-gray-200 rounded-xl">
                        No hay roles registrados en el sistema.
                    </div>
                )}
            </View>

            {isDialogOpen && (
                <DialogRoles
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    onRolAgregado={fetchRoles}
                />
            )}

            {isDialogOpenEdit && (
                <DialogRolesEdit
                    isOpen={isDialogOpenEdit}
                    onClose={() => setIsDialogOpenEdit(false)}
                    onRolEditado={fetchRoles}
                    id={rolId}
                    rol={rolSeleccionado}
                />
            )}
        </div>
    );
}
