import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 👇 1. Importar Echo y Pusher
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// 👇 2. Asignar Pusher a window
window.Pusher = Pusher;

// 👇 3. Configurar la conexión hacia tu Laravel Reverb
window.Echo = new Echo({
    broadcaster: 'reverb',
    // Usamos las variables que vi en tu foto del .env de React
    key: import.meta.env.VITE_PUSHER_APP_KEY, 
    wsHost: import.meta.env.VITE_PUSHER_HOST,
    wsPort: import.meta.env.VITE_PUSHER_PORT ?? 8080,
    wssPort: import.meta.env.VITE_PUSHER_PORT ?? 8080,
    forceTLS: import.meta.env.VITE_PUSHER_SCHEME === 'https',
    enabledTransports: ['ws', 'wss'],
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
    
      <App />
    
  </StrictMode>,
)
