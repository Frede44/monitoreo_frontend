import React from 'react';
import { Activity } from 'lucide-react';

export default function Loader({ message = 'Cargando datos del sistema...' }) {
    return (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center p-6">
            <div className="relative flex flex-col items-center justify-center p-8 rounded-2xl bg-white/60 backdrop-blur-md border border-white/20 shadow-xl max-w-sm w-full transition-all duration-300">
                {/* Loader animation container */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                    {/* Outer Ring - Spins clockwise */}
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 border-r-violet-600 animate-spin"></div>
                    
                    {/* Inner Ring - Spins counter-clockwise */}
                    <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-pink-500 border-l-purple-500 animate-[spin_1.5s_linear_infinite_reverse]"></div>
                    
                    {/* Center Icon - Pulsing glow */}
                    <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-indigo-50 to-purple-50 rounded-full shadow-inner animate-pulse">
                        <Activity className="w-6 h-6 text-indigo-600 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                    </div>
                </div>
                
                {/* Message & Status */}
                <div className="mt-6 text-center">
                    <p className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse tracking-wide">
                        {message}
                    </p>
                    <div className="flex justify-center gap-1 mt-2">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce"></span>
                    </div>
                </div>
            </div>
        </div>
    );
}
