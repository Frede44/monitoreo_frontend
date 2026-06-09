const API_URL = import.meta.env.VITE_API_URL;

export const getUserInfoApi = async () => {
    try {
        const response = await fetch(`${API_URL}/usuarios`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener la información del usuario');
        }
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
        throw error;
    }
}

export const getRolesApi = async () => {
    try {
        const response = await fetch(`${API_URL}/roles`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener los roles');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los roles:', error);
        throw error;
    }
}   

    export const guardarUsuarioApi = async ({ name, email, role, password }) => {
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify({ name, email, role, password })
            });
            if (!response.ok) {
                throw new Error('Error al guardar el usuario');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al guardar el usuario:', error);
            throw error;
        }
 }


  export const editarUsuarioApi = async ({ name, email, role, id }) => {
        try {

           
            const response = await fetch(`${API_URL}/usuarios/edit/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify({ name, email, role })
            });
            if (!response.ok) {
                throw new Error('Error al editar el usuario');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al editar el usuario:', error);
            throw error;
        }
 }

 export const deleteUserApi = async (id) => {
    try {
        const response = await fetch(`${API_URL}/usuarios/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
        });
        if (!response.ok) {
            throw new Error('Error al eliminar el usuario');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        throw error;
    }
 }
