import { Trash2, Shield, SquarePen, Key } from "lucide-react";
import Button from "../Button";

export default function CardsRoles({ nombre, guard, permissions = [], onClickEditar, onClickEliminar }) {
    const isSystemRole = nombre === "administrador";

    return (
        <div className="w-full h-auto flex flex-col md:flex-row justify-between items-start md:items-center p-5 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow gap-4">
            <div className="flex flex-row items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                    <Shield className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-lg text-gray-800 capitalize">{nombre}</p>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md uppercase font-mono">
                            guard: {guard}
                        </span>
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                            <Key className="w-3 h-3" /> PERMISOS ASIGNADOS
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                            {permissions.length > 0 ? (
                                permissions.map((perm) => (
                                    <span 
                                        key={perm.id || perm.name} 
                                        className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 font-medium"
                                    >
                                        {perm.name}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-gray-400 italic">
                                    Sin permisos asignados
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-row gap-2 self-end md:self-center shrink-0">
                <Button 
                    children={<SquarePen className="w-4 h-4" />} 
                    estile="text-zinc-700 font-semibold py-2 px-4 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors" 
                    onClick={onClickEditar} 
                />
                {!isSystemRole ? (
                    <Button 
                        children={<Trash2 className="w-4 h-4" />} 
                        estile="bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 px-4 rounded-lg border border-red-100 transition-colors" 
                        onClick={onClickEliminar} 
                    />
                ) : (
                    <div className="w-[48px] h-[38px] flex items-center justify-center text-xs text-gray-400 font-medium cursor-not-allowed select-none bg-gray-50 border border-gray-100 rounded-lg" title="El rol Administrador no se puede eliminar">
                        N/A
                    </div>
                )}
            </div>
        </div>
    );
}
