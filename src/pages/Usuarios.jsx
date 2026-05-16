import Button from "../components/Button";
import CardsUsuarios from "../components/CardsUsuarios";
import View from "../components/View";
import { useNavigate } from "react-router-dom";
import { getUserInfoApi } from "../services/userService";
import { useState, useEffect } from "react";
import DialogUsuarios from "../components/DialogUsuarios";
import DialogUsuarioEdit from "../components/DialogUsuarioEdit";

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDialogOpenEdit, setIsDialogOpenEdit] = useState(false);
    const [usuarioId, setUsuarioId] = useState(null);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsuarios();
    }, [navigate]);

    const fetchUsuarios = async () => {
        try {
            const data = await getUserInfoApi();
            setUsuarios(data);
            console.log(data);
        } catch (error) {
            if (error.message.includes('401') || error.message.includes('obtener los dispositivos')) {
                navigate('/login');
            }
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

    return (
        <div className="w-full h-full flex flex-col gap-4">
            <div className="flex flex-row justify-between p-4">
                <div >
                    <h1 className="text-3xl font-bold">Gestionar Usuarios</h1>
                    <p>Administrar los usuarios del sistema</p>
                </div>
                <div>
                    <Button children="Ingresar Usuario" estile="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={handleAgregarUsuario} />
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