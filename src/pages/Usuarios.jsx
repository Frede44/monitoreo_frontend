import Button from "../components/Button";
import CardsUsuarios from "../components/Cards/CardsUsuarios";
import View from "../components/View";
import { useNavigate } from "react-router-dom";
import { getUserInfoApi, deleteUserApi } from "../services/userService";
import { useState, useEffect } from "react";
import DialogUsuarios from "../components/Dialog/DialogUsuarios";
import DialogUsuarioEdit from "../components/Dialog/DialogUsuarioEdit";
import Loader from "../components/Loader";

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDialogOpenEdit, setIsDialogOpenEdit] = useState(false);
    const [usuarioId, setUsuarioId] = useState(null);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsuarios();
    }, [navigate]);

    const fetchUsuarios = async () => {
        setLoading(true);
        try {
            const data = await getUserInfoApi();
            setUsuarios(data);
            console.log(data);
        } catch (error) {
            if (error.message.includes('401') || error.message.includes('obtener los dispositivos')) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }

    }

    const handleAgregarUsuario = () => {
        setIsDialogOpen(true);
    }

    const handleEditarUsuario = (id) => {
        const usuarioEdit = usuarios.find(u => u.id === id);
        setUsuarioSeleccionado(usuarioEdit);
        setUsuarioId(id);
        setIsDialogOpenEdit(true);
    }

    const handleEliminarUsuario = async (id) => {
        // Aquí puedes implementar la lógica para eliminar la métrica usando su ID
        console.log("Eliminar usuario con ID:", id);

        if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
            deleteUserApi(id)
                .then(() => {
                    alert("Usuario eliminado exitosamente.");
                    fetchUsuarios(); // Refresca la lista de usuarios después de eliminar
                })
                .catch((error) => {
                    console.error("Error al eliminar el usuario:", error);
                    alert("Ocurrió un error al eliminar el usuario.");
                });
        }
    }

    if (loading) {
        return <Loader message="Cargando usuarios del sistema..." />;
    }

    return (
        <div className="w-full h-full flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Gestionar Usuarios</h1>
                    <p className="text-sm text-gray-500">Administrar los usuarios del sistema</p>
                </div>
                <div className="w-full sm:w-auto">
                    <Button children="Ingresar Usuario" estile="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto" onClick={handleAgregarUsuario} />
                </div>
            </div>

            <View title="Lista de Usuarios" estilos="p-4 gap-4">
                {usuarios.map((usuario) => (
                    <div className="mb-2" key={usuario.id}>


                        <CardsUsuarios
                            nombre={usuario.name}
                            email={usuario.email}
                            rol={usuario.roles[0].name }
                            fechaCreacion={usuario.created_at}
                            onClickEditar={() => handleEditarUsuario(usuario.id)}
                            onClickEliminar={() => handleEliminarUsuario(usuario.id)}
                        />

                    </div>
                ))}
            </View>

            {isDialogOpen && (
                <DialogUsuarios
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    onDispositivoAgregado={fetchUsuarios}
                />
            )}

            {isDialogOpenEdit && (
                <DialogUsuarioEdit
                    isOpen={isDialogOpenEdit}
                    onClose={() => setIsDialogOpenEdit(false)}
                    onUsuarioEditado={fetchUsuarios}
                    id={usuarioId}
                    usuario={usuarioSeleccionado}
                />
            )

            }

        </div>


    )
}