import { useEffect, useState } from "react";
import Button from "../Button";
import View from "../View";
import { editarRolApi, getPermissionsApi } from "../../services/roleService";
import { Shield, Key } from "lucide-react";

export default function DialogRolesEdit({ isOpen, onClose, onRolEditado, id, rol }) {
    const [name, setName] = useState('');
    const [availablePermissions, setAvailablePermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && rol) {
            setName(rol.name || '');
            const initialPerms = (rol.permissions || []).map(p => p.name);
            setSelectedPermissions(initialPerms);

            const fetchPermissions = async () => {
                try {
                    const data = await getPermissionsApi();
                    setAvailablePermissions(data.permissions || []);
                } catch (error) {
                    console.error("Error al obtener los permisos en modal edit:", error);
                }
            };
            fetchPermissions();
        }
    }, [isOpen, rol]);

    if (!isOpen) return null;

    const handleCheckboxChange = (permissionName) => {
        if (selectedPermissions.includes(permissionName)) {
            setSelectedPermissions(selectedPermissions.filter(p => p !== permissionName));
        } else {
            setSelectedPermissions([...selectedPermissions, permissionName]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsLoading(true);
        try {
            await editarRolApi({ 
                id, 
                name: name.toLowerCase(), 
                permissions: selectedPermissions 
            });
            onClose();
            if (onRolEditado) {
                onRolEditado();
            }
        } catch (error) {
            console.error("Error al editar rol:", error);
            alert("Ocurrió un error al editar el rol.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs" onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()} className="max-w-md w-full m-4">
                <View title="Editar Rol" text="Modifique los detalles del rol y sus permisos" estilos="p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="role-name-edit" className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-1">
                                <Shield className="w-4 h-4 text-gray-500" /> Nombre del Rol
                            </label>
                            <input 
                                type="text" 
                                id="role-name-edit" 
                                name="name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" 
                                required 
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
                                <Key className="w-4 h-4 text-gray-500" /> Permisos del Sistema
                            </label>
                            <div className="border border-gray-200 rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50 flex flex-col gap-2">
                                {availablePermissions.length > 0 ? (
                                    availablePermissions.map((perm) => (
                                        <label key={perm.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedPermissions.includes(perm.name)} 
                                                onChange={() => handleCheckboxChange(perm.name)} 
                                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                            <span>{perm.name}</span>
                                        </label>
                                    ))
                                ) : (
                                    <span className="text-xs text-gray-400 italic">No hay permisos disponibles</span>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button 
                                type="button" 
                                onClick={onClose} 
                                className="bg-white hover:bg-gray-100 text-gray-800 py-2 px-4 rounded-lg border text-sm font-medium transition-colors" 
                                disabled={isLoading}
                            >
                                Cancelar
                            </button>
                            <Button 
                                type="submit" 
                                children={isLoading ? "Guardando..." : "Guardar Cambios"} 
                                estile={`${isLoading ? 'bg-gray-500' : 'bg-black hover:bg-zinc-800'} text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors`} 
                                disabled={isLoading} 
                            />
                        </div>
                    </form>
                </View>
            </div>
        </div>
    );
}
