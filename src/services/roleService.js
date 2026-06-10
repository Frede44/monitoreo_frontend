const API_URL = import.meta.env.VITE_API_URL;

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
};

export const getPermissionsApi = async () => {
    try {
        const response = await fetch(`${API_URL}/permissions`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener los permisos');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los permisos:', error);
        throw error;
    }
};

export const guardarRolApi = async ({ name, permissions }) => {
    try {
        const response = await fetch(`${API_URL}/roles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify({ name, permissions, guard_name: 'web' })
        });
        if (!response.ok) {
            throw new Error('Error al guardar el rol');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al guardar el rol:', error);
        throw error;
    }
};

export const editarRolApi = async ({ id, name, permissions }) => {
    try {
        const response = await fetch(`${API_URL}/roles/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify({ name, permissions, guard_name: 'web' })
        });
        if (!response.ok) {
            throw new Error('Error al editar el rol');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al editar el rol:', error);
        throw error;
    }
};

export const deleteRolApi = async (id) => {
    try {
        const response = await fetch(`${API_URL}/roles/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
        });
        if (!response.ok) {
            throw new Error('Error al eliminar el rol');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al eliminar el rol:', error);
        throw error;
    }
};
