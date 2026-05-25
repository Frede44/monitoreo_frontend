const API_URL = import.meta.env.VITE_API_URL;

export const metricasApi = async () => {
    try {
        const response = await fetch(`${API_URL}/metricas`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener las métricas');  
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener las métricas:', error);
        throw error;
    }
}

export const postAlertasApi = async (alerta) => {
    try {
        const response = await fetch(`${API_URL}/triggers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify(alerta)
        });
        if (!response.ok) {
            throw new Error('Error al crear la alerta');  
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al crear la alerta:', error);
        throw error;
    }
}
export const getAlertasApi = async () => {
    try {
        const response = await fetch(`${API_URL}/triggers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener las alertas');  
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener las alertas:', error);
        throw error;
    }
}

export const cambiarEstadoAlertaApi = async (id) => {
    try {
        const response = await fetch(`${API_URL}/triggers/estado/${id}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
        });
        if (!response.ok) {
            throw new Error('Error al cambiar el estado de la alerta');  
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al cambiar el estado de la alerta:', error);
        throw error;
    }
}
export const updateAlertasApi = async (id, alerta) => {
    try {
        const response = await fetch(`${API_URL}/triggers/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify(alerta)
        });
        if (!response.ok) {
            throw new Error('Error al actualizar la alerta');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al actualizar la alerta:', error);
        throw error;
    }
}