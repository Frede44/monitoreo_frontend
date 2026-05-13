import Button from "../components/Button";

export default function Dispositivos() {
    return (
        <div className="w-full h-full flex flex-col gap-4">
            <div className="flex flex-row justify-between p-4">
                <div >
                    <h1 className="text-3xl font-bold">Gestionar Dispositivos</h1>
                    <p>Administrar los dispositivos loT conectados</p>
                </div>
                <div>
                    <Button children="Ingresar Dispositivo" estile="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" />
                </div>
            </div>

        </div>
    );
}