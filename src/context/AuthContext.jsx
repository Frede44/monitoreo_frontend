import { createContext, useState, useEffect } from "react";

// Crear el contexto de autenticación
export const AuthContext = createContext();

// Crear el proveedor de autenticación
export const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(() => {
        const guardado = localStorage.getItem('user_data');
        return guardado ? JSON.parse(guardado) : null;
    });
    const [token, setToken] = useState(localStorage.getItem('auth_token') || null); 
    // Si hay un token guardado al recargar la página, se mantiene la sesión
    useEffect(() => {
        if(token){
            // Guardar el token en localStorage para mantener la sesión
            localStorage.setItem('auth_token', token);
            //gardar el nombre del usuari y el rol en el estado de usuario
            


        }else{
            // Si no hay token, eliminarlo de localStorage
            localStorage.removeItem('auth_token');

        }
    },  [token]
);

// Función para iniciar sesión, recibe los datos del usuario y el token de autenticación
const login = (userData, authToken) =>{
    setToken(authToken);
    setUser(userData);

    localStorage.setItem('user_data', JSON.stringify(userData));

};

// Función para cerrar sesión, elimina el token y los datos del usuario
const logout = () =>{
    setToken(null);
    setUser(null);  
    localStorage.removeItem('user_data');
    localStorage.removeItem('auth_token');
};
// Proveer el contexto de autenticación a los componentes hijos
return(
    <AuthContext.Provider value={{user, token, login, logout}}>
        {children}
    </AuthContext.Provider>
);
};