import { Trash2, Users,SquarePen, Shield } from "lucide-react";
import Button from "../Button";

export default function CardsUsuarios({ nombre, email, rol, fechaCreacion, onClickEditar, onClickEliminar }) {

    const estilorol = rol === "administrador" ?  "bg-red-700 p-1 text-xs rounded-xl flex justify-center items-center gap-1 text-white" : "bg-black p-1 text-xs rounded-xl text-white flex justify-center items-center gap-1" ;
    return (
        <div className="w-full h-auto flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-300 rounded shadow-sm bg-white gap-4">
            <div className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2 shrink-0">
                    <Users />
                </div>
                <div className="gap-4 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 pb-1">
                        <p className="font-bold truncate">{nombre}</p>
                        <div className={`${estilorol} shrink-0`}><Shield className="w-4" /> <p>{rol}</p></div>
                    </div>
                    <div className="pb-1">
                        <p className="text-gray-500 truncate">{email}</p>
                    </div>
                    <div className="pb-1">
                        <p className="text-sm text-gray-500">Creado: {fechaCreacion}</p>
                    </div>
                </div>


            </div>
            <div className="flex flex-row gap-2 w-full sm:w-auto justify-end">
                <Button children={<SquarePen className="w-4 h-4"  />} estile=" text-black font-bold py-2 px-4 rounded border border-black hover:bg-gray-200" onClick={onClickEditar} />
                <Button children={<Trash2 className="w-4 h-4" />} estile="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={onClickEliminar} />
            </div>
        </div>
    )
}