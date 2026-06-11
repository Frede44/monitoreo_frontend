import { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Bell, AlertTriangle, X, Menu } from 'lucide-react';
import { AlertContext } from '../context/AlertContext';

const formatTime = (isoString) => {
    try {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch (e) {
        return '';
    }
};

export default function Headers({ onMenuToggle }) {
    const { alerts, removeAlert, clearAlerts } = useContext(AlertContext);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const navigate = useNavigate();
    const popoverRef = useRef(null);
    const buttonRef = useRef(null);

    const hasAlerts = alerts.length > 0;

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                popoverRef.current && 
                !popoverRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setPopoverOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="header flex justify-between items-center px-4 py-2 bg-white text-black w-full border-b border-zinc-200 relative">
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes bell-ring {
                    0%, 100% { transform: rotate(0deg); }
                    15% { transform: rotate(15deg) scale(1.1); }
                    30% { transform: rotate(-15deg) scale(1.1); }
                    45% { transform: rotate(10deg) scale(1.1); }
                    60% { transform: rotate(-10deg) scale(1.1); }
                    75% { transform: rotate(4deg) scale(1.05); }
                    85% { transform: rotate(-4deg) scale(1.05); }
                }
                .animate-bell-ring {
                    animation: bell-ring 1.5s infinite ease-in-out;
                    transform-origin: top center;
                }
            `}} />

            <div className='flex items-center gap-2 flex-row'>
                <button 
                    onClick={onMenuToggle}
                    className="md:hidden p-1 rounded hover:bg-gray-100 cursor-pointer mr-1 text-zinc-700"
                    aria-label="Menu"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <Activity className='text-black'/>
                <h1 className="header__title text-black font-bold text-lg">IoT Monitor</h1>
            </div>

            {/* Botón de Alertas y Popover */}
            <div className="relative">
                <button
                    ref={buttonRef}
                    onClick={() => setPopoverOpen(!popoverOpen)}
                    className={`flex items-center gap-3 px-3 py-1.5 border rounded-lg shadow-xs transition-all duration-200 cursor-pointer select-none ${
                        hasAlerts
                            ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                            : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                    }`}
                >
                    <div className="relative flex items-center justify-center">
                        <Bell className={`w-5 h-5 shrink-0 ${
                            hasAlerts ? 'text-red-500 animate-bell-ring' : 'text-zinc-400'
                        }`} />
                        {hasAlerts && (
                            <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full text-[9px] w-4.5 h-4.5 flex items-center justify-center font-bold border border-white shadow-xs">
                                {alerts.length}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col items-start leading-tight">
                        <span className={`text-xs font-bold ${hasAlerts ? 'text-red-700' : 'text-zinc-800'}`}>
                            {hasAlerts ? 'Alertas Activas' : 'Sin Alertas'}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-medium">
                            {alerts.length} {alerts.length === 1 ? 'activa' : 'activas'}
                        </span>
                    </div>
                </button>

                {/* Popover */}
                {popoverOpen && (
                    <div
                        ref={popoverRef}
                        className="absolute right-0 mt-2 w-96 bg-white border border-zinc-200 rounded-lg shadow-xl z-50 overflow-hidden flex flex-col"
                    >
                        {/* Popover Header */}
                        <div className="flex items-center justify-between p-3 border-b border-zinc-100 bg-zinc-50/70">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="text-red-500 w-4.5 h-4.5" />
                                <span className="font-bold text-sm text-zinc-900">Alertas en Tiempo Real</span>
                            </div>
                            {hasAlerts && (
                                <button
                                    onClick={clearAlerts}
                                    className="text-xs text-zinc-500 hover:text-red-600 hover:underline font-semibold cursor-pointer"
                                >
                                    Limpiar todo
                                </button>
                            )}
                        </div>

                        {/* Popover Body */}
                        <div className="flex-1 max-h-80 overflow-y-auto">
                            {!hasAlerts ? (
                                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                                    <div className="p-3 bg-zinc-100 rounded-full mb-3">
                                        <Bell className="w-8 h-8 text-zinc-400" />
                                    </div>
                                    <p className="font-bold text-sm text-zinc-700">No hay alertas activas</p>
                                    <p className="text-xs text-zinc-400 mt-1">Todos los valores están dentro de los rangos normales</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-zinc-100">
                                    {alerts.map((alert) => (
                                        <div
                                            key={alert.id}
                                            className="p-3 hover:bg-zinc-50 transition-colors flex items-start gap-2.5 relative group"
                                        >
                                            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-xs text-zinc-800 truncate">
                                                        {alert.dispositivo}
                                                    </span>
                                                    <span className="text-[10px] text-zinc-400 font-medium shrink-0">
                                                        {formatTime(alert.timestamp)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider">
                                                        {alert.metrica}
                                                    </span>
                                                    <span className="text-[10px] text-zinc-500 font-semibold">
                                                        Valor: {alert.valor}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-zinc-600 mt-1 leading-normal font-normal">
                                                    {alert.mensaje}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => removeAlert(alert.id)}
                                                className="text-zinc-400 hover:text-zinc-700 cursor-pointer p-1 shrink-0 -mr-1"
                                                title="Descartar alerta"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Popover Footer */}
                        <div className="p-3 border-t border-zinc-100 bg-white">
                            <button
                                onClick={() => {
                                    setPopoverOpen(false);
                                    navigate('/panel/alertas');
                                }}
                                className="w-full py-2 px-4 border border-zinc-300 rounded-lg text-sm text-zinc-700 font-bold hover:bg-zinc-50 active:bg-zinc-100 transition-colors cursor-pointer text-center"
                            >
                                Gestionar Alertas
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}