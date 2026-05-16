const API_URL = import.meta.env.VITE_API_URL;

export const guardarDispositivoApi = async (dispositivoData) => {
    try {
        const response = await fetch(`${API_URL}/dispositivos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify(dispositivoData)
        });
        if (!response.ok) {
            throw new Error('Error al guardar el dispositivo');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al guardar el dispositivo:', error);
        throw error;
    }
}

export const editarDispositivoApi = async (id, dispositivoData) => {
    try {
        const response = await fetch(`${API_URL}/dispositivos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify(dispositivoData)
        });
        if (!response.ok) {
            throw new Error('Error al editar el dispositivo');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al editar el dispositivo:', error);
        throw error;
    }
}