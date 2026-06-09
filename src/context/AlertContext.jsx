import { createContext, useState, useEffect, useContext } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { AuthContext } from './AuthContext';

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    const { user, token } = useContext(AuthContext);
    const [alerts, setAlerts] = useState(() => {
        const savedAlerts = localStorage.getItem('active_alerts');
        return savedAlerts ? JSON.parse(savedAlerts) : [];
    });

    useEffect(() => {
        localStorage.setItem('active_alerts', JSON.stringify(alerts));
    }, [alerts]);

    useEffect(() => {
        if (!token || !user?.user_data?.id) return;

        window.Pusher = Pusher;

        // Configurar la conexión hacia tu Laravel Reverb si no está ya configurada
        if (!window.Echo) {
            window.Echo = new Echo({
                broadcaster: 'reverb',
                key: import.meta.env.VITE_REVERB_APP_KEY, 
                wsHost: import.meta.env.VITE_REVERB_HOST,
                wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
                wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
                forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
                enabledTransports: ['ws', 'wss'],
                authEndpoint: 'http://localhost:8000/api/broadcasting/auth',
                auth: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    }
                }
            });
        }

        const channel = window.Echo.private(`user.${user.user_data.id}`);
        
        const handleAlerta = (e) => {
            console.log('Alerta recibida en AlertContext:', e.alerta);
            if (e.alerta) {
                setAlerts((prev) => [
                    {
                        ...e.alerta,
                        id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                        timestamp: new Date().toISOString()
                    },
                    ...prev
                ]);
            }
        };

        channel.listen('.alerta-datos', handleAlerta);

        return () => {
            if (window.Echo) {
                window.Echo.private(`user.${user.user_data.id}`).stopListening('.alerta-datos');
            }
        };
    }, [user, token]);

    const removeAlert = (alertId) => {
        setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    };

    const clearAlerts = () => {
        setAlerts([]);
    };

    return (
        <AlertContext.Provider value={{ alerts, removeAlert, clearAlerts }}>
            {children}
        </AlertContext.Provider>
    );
};
