//aqui se llaa a el link del backend para hacer el login
const API_URL = import.meta.env.VITE_API_URL;

//funcion para hacer el login, recibe el email y password del usuario
export const loginApi = async (email, password)=>{
    try{

        //hacemos la peticion al backend para hacer el login
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers:{
                'content-type': 'application/json',
                'Accept': 'application/json'
            },
            //enviamos el email y password del usuario en el body de la peticion
            body: JSON.stringify({email, password})
        });
        
        if(!response.ok){
            throw new Error('Credenciales invalidas');
        }
        //si la respuesta es ok, retornamos los datos del usuario
        const data = await response.json();
        return data;
    }catch(error){
        console.error('Error en el login:', error);
        throw error;

    }
}