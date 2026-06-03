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

export const postMetricasApi = async (metricaData) => {
    try {
        const response = await fetch(`${API_URL}/metricas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify(metricaData)
        });
        if (!response.ok) {
            throw new Error('Error al crear la métrica');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al crear la métrica:', error);
        throw error;
    }
};

export const editMetricasApi = async (id, metricaData) => {
    try {
        const response = await fetch(`${API_URL}/metricas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify(metricaData)
        });
        if (!response.ok) {
            throw new Error('Error al actualizar la métrica');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al actualizar la métrica:', error);
        throw error;
    }
};

export const deleteMetricasApi = async (id) => {
    try {
        const response = await fetch(`${API_URL}/metricas/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
        });
        if (!response.ok) {
            throw new Error('Error al eliminar la métrica');
        }
        return true;
    } catch (error) {
        console.error('Error al eliminar la métrica:', error);
        throw error;
    }
};


