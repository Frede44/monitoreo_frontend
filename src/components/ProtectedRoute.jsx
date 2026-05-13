import {  useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// creamos un componente de ruta protegida que verifica si el usuario tiene un token de autenticación válido antes de permitir el acceso a la ruta. Si no tiene un token, se redirige al usuario a la página de inicio de sesión.
export default function ProtectedRoute({ children }) {
    const { token} = useContext(AuthContext);
// Si no hay token, lo mandamos al login inmediatamente
    if(!token){
        return <Navigate to="/login" replace />

    }
 // Si hay token, renderizamos el componente hijo (ej. el Dashboard)
    return children;
}