const API_URL = import.meta.env.VITE_API_URL;

export const getLecturasPorFechaApi = async (fecha_inicio, fecha_fin, tipo_metrica_id, dispositivo_id) => {
    try {
        const token = localStorage.getItem('auth_token');
        const url = `${API_URL}/lecturas/date?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}&tipo_metrica_id=${tipo_metrica_id}&dispositivo_id=${dispositivo_id}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener el historial de lecturas');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en getLecturasPorFechaApi:', error);
        throw error;
    }
};
