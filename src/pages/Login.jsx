import { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import { Activity } from 'lucide-react';
import Label from "../components/Label";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const { login } = useContext(AuthContext)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await loginApi(email, password);
            const token = response.token || response.access_token;

            

            if (!token) {
                throw new Error('El servidor no devolvió un token válido');
            }
            login(response, token);
            navigate('/panel');
        } catch (error) {
            setError(error.message || 'Error desconocido al iniciar sesión');
        }
    };

return (
    <div className="w-96 h-100 flex flex-col items-center p-4 rounded shadow-md  bg-white">
        <div className="mb-5 flex items-center gap-2">
            <Activity />
            <h1 className="text-2xl font-bold">IoT Monitor</h1>
        </div>
        <h2 className="font-bold">Iniciar Sesión</h2>
        <p className="pb-5">Sistema de Monitorización de Sensores</p>
        <form onSubmit={handleSubmit} className="w-full  flex flex-col gap-4 justify-center items-center">
            <div className="w-full">
                <Label label="Correo Electrónico" />
               <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                />
            </div>
            <div className="w-full">
                <Label label="Contraseña" />
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                />
            </div>
            
            <div className="w-full flex justify-center">
                <Button type="submit" children="Iniciar Sesión" estile="bg-black text-white hover:bg-gray-800 w-full" />
            </div>
            {error &&
            <div className="border border-red-500 w-full flex justify-center item-center rounded bg-red-100 p-2">
                 <p className="text-red-500">{error}</p>
            </div>}
            
        </form>
    </div>
)
}