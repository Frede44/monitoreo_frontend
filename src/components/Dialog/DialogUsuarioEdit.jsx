import { useState, useEffect } from "react";
import { editarUsuarioApi, getRolesApi } from "../../services/userService";
import Button from "../Button";
import View from "../View";

export default function DialogUsuarioEdit({ isOpen, onClose, onUsuarioEditado, id, usuario }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [getRole, setGetRole] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (usuario) {
            setName(usuario.name || '');
            setEmail(usuario.email || '');
            setRole(usuario.roles && usuario.roles.length > 0 ? usuario.roles[0].name : '');
        }
    }, [usuario]);
    if (!isOpen) return null;

     const handleSubmit = async (e) => {
            e.preventDefault();
            setIsLoading(true);
            try {
    
                
                const respuesta = await editarUsuarioApi({ id, name, email, role });
    
                onClose();
                if (onUsuarioEditado) {
                    onUsuarioEditado();
                }
            } catch (error) {
                console.error("Error al editar usuario:", error);
                alert("Ocurrió un error al editar el usuario.");
            } finally {
                setIsLoading(false);
                setName('');
                setEmail('');
                setRole('');
            }
        };

      useEffect(() => {
            const fetchRoles = async () => {
                const response = await getRolesApi();
                console.log("Roles obtenidos:", response);
                setGetRole(response.roles);
    
            };
            fetchRoles();
       }, []);


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs" onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()} className="max-w-md w-full m-4">
                <View title="Editar Usuario" text="Ingrese los detalles del usuario" estilos="p-6" >
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700 font-bold ">Nombre</label>
                                <input type="text" id="name" name="name" placeholder="Antonio Herrera" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded" required />
                            </div>
                            <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 font-bold ">Email</label>
                                <input type="email" id="email" name="email" placeholder="antonio.herrera@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded" required />
                            </div>
                        <div className="mb-4">
                            <label htmlFor="role" className="block text-gray-700 font-bold">Rol</label>
                            <select id="role" name="role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 border rounded" required>
                                <option value="">Seleccione un rol</option>
                                {getRole.map((rol) => (
                                    <option key={rol.id} value={rol.name}>{rol.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end gap-2 mb-4">
                            <button type="button" onClick={onClose} className="bg-white hover:bg-gray-200 text-gray-800  py-2 px-4 rounded border text-sm font-medium" disabled={isLoading}>Cancelar</button>
                            <Button type="submit" children={isLoading ? "Guardando..." : "Editar"} estile={`${isLoading ? 'bg-gray-500' : 'bg-black hover:bg-gray-700'} text-white py-2 px-4 rounded text-sm`} disabled={isLoading} />
                        </div>
                    </form>
                </View>
            </div>
        </div>
    );
}