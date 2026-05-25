import { Bell, Car, PenBox, Trash } from "lucide-react"
import { Toggle } from "../Toggle"
import Button from "../Button"


export function CardAlertas({ parametro, valMin, valMax, sensor, ubicacion, estado, onToggle, onClickEditar, onClickEliminar }) {
    return(
        <div className="bg-white p-5 rounded shadow flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <div className="flex flex-row item-center gap-4">
                    <div className="flex justify-center items-center w-5 ">
                        <Bell className="w-5" />
                    </div>
                    <div>
                        <p className="font-bold"> {sensor}</p>
                        <p>{ubicacion}</p>
                    </div>
                </div>
                <div>
                    {/* Aquí podrías agregar un toggle switch para cambiar el estado de la alerta */}
                   <Toggle checked={estado === 1 || estado === true} onChange={onToggle} />   
                </div>
            </div>
            <div className="flex flex-col gap-4 bg-gray-100 p-2 rounded">
                <div className="flex flex-row gap-2 justify-between">
                    <p className="text-gray-500">Parametro:</p>

                    <p>{parametro}</p>
                </div>
                <div  className="flex flex-col gap-2">
                    <div className="flex flex-row justify-between gap-2">
                        <p className="text-gray-500">Valor minimo:</p>
                        <p>{valMin}</p>
                    </div>
                    <div className="flex flex-row justify-between gap-2">
                        <p className="text-gray-500">Valor maximo:</p>
                        <p>{valMax}</p>
                    </div>
                </div>
            </div>
            <div className="flex gap-3 ">
                <Button estile="border flex gap-4 justify-center items-center w-5/6 hover:bg-gray-200" onClick={onClickEditar}><PenBox className="" /> Editar</Button>
                <Button estile="bg-red-600 text-white w-1/6 flex justify-center hover:bg-red-700" onClick={onClickEliminar}><Trash/></Button>
            </div>
        </div>
    )
}