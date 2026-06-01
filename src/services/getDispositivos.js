const API_URL = import.meta.env.VITE_API_URL;

export const getDispositivosApi = async () => {
    try {
        const response = await fetch(`${API_URL}/dispositivos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener los dispositivos');  
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los dispositivos:', error);
        throw error;
    }
}

export const getCountDispositivosApi = async () => {
    try {
        const response = await fetch(`${API_URL}/dispositivos/count`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener el conteo de dispositivos');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener el conteo de dispositivos:', error);
        throw error;
    }
}
