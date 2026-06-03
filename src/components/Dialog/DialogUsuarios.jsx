import { useEffect, useState } from "react";
import Button from "../Button";
import View from "../View";
import { guardarUsuarioApi, getRolesApi } from "../../services/userService";

export default function DialogUsuarios({isOpen, onClose, onDispositivoAgregado}) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [getRole, setGetRole] = useState([]);
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const respuesta = await guardarUsuarioApi({ name, email, role, password });
            console.log("Respuesta del backend:", respuesta);
          
            onClose();
            if (onDispositivoAgregado) {
                onDispositivoAgregado();
            }
        } catch (error) {
            console.error("Error al guardar usuario:", error);
            alert("Ocurrió un error al guardar el usuario.");
        } finally {
            setIsLoading(false);
            setName('');
            setEmail('');
            setRole('');
            setPassword('');
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
        <div className="fixed inset-0 z-50 flex items-center justify-center " onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()}>
                <View title="Agregar Dispositivo" text="Ingrese los detalles del nuevo dispositivo" estilos="w-96 p-6" >
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
                            <label htmlFor="password" className="block text-gray-700 font-bold">Contraseña</label>
                            <input type="password" id="password" name="password" placeholder="Ingrese la contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded" required />
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-gray-700 font-bold">Rol</label>
                            <select id="role" name="role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 border rounded" required>
                                <option value="">Seleccione un rol</option>
                                {getRole.map((rol) => (
                                    <option key={rol.id} value={rol.name}>{rol.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end gap-2 mb-4">
                            <button type="button" onClick={onClose} className="bg-white hover:bg-gray-200 text-gray-800  py-2 px-4 rounded border" disabled={isLoading}>Cancelar</button>
                            <Button type="submit" children={isLoading ? "Guardando..." : "Agregar "} estile={`${isLoading ? 'bg-gray-500' : 'bg-black hover:bg-gray-700'} text-white  py-2 px-4 rounded`} disabled={isLoading} />
                        </div>
                    </form>
                </View>
            </div>
        </div>
    )
}