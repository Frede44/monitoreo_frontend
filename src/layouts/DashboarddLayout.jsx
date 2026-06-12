
import { Outlet, useNavigate } from 'react-router-dom';
import Headers from '../components/Headers';
import Nav from '../components/Nav';
import { LayoutPanelLeft, Cpu, User, Bell, FlaskConical, LogOut, Shield, TrendingUp } from 'lucide-react';
import LinkNav from '../components/LinkNav';
import { AuthContext } from '../context/AuthContext';
import { useContext, useState } from 'react';
import { AlertProvider } from '../context/AlertContext';

export default function DashboardLayout() {
    const { user, logout } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div>
            <AlertProvider>
                <div className="h-screen bg-gray-50 flex flex-col">
                    <Headers onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
                    <div className="flex flex-1 overflow-hidden">
                        <Nav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}>
                            <div className="flex flex-col gap-4 flex-1">
                                <LinkNav to="/panel" icon={<LayoutPanelLeft className="w-5" />}>
                                    Panel
                                </LinkNav>
                                <LinkNav to="/panel/dispositivos" icon={<Cpu className="w-5" />}>
                                    Dispositivos
                                </LinkNav>
                                <LinkNav to="/panel/usuarios" icon={<User className="w-5" />}>
                                    Usuarios
                                </LinkNav>
                                <LinkNav to="/panel/alertas" icon={<Bell className="w-5" />}>
                                    Alertas
                                </LinkNav>
                                <LinkNav to="/panel/metricas" icon={<FlaskConical className="w-5" />}>
                                    Métricas
                                </LinkNav>
                                <LinkNav to="/panel/roles" icon={<Shield className="w-5" />}>
                                    Roles
                                </LinkNav>
                                <LinkNav to="/panel/graficas" icon={<TrendingUp className="w-5" />}>
                                    Historial Gráfico
                                </LinkNav>
                            </div>


                            <div className="flex flex-col gap-3 mt-auto border-t border-zinc-100 pt-4">
                                <div className="flex items-center gap-3 p-3 border border-zinc-200 rounded-lg bg-zinc-50/50">
                                    <User className="text-zinc-500 w-5 h-5 shrink-0" />
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-semibold text-zinc-900 truncate">
                                            {user?.user_data?.name || 'Usuario'}
                                        </span>
                                        <span className="text-xs text-zinc-500 truncate">
                                            {user?.role || 'rol'}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full p-3 border border-zinc-200 rounded-lg text-sm text-zinc-700 font-medium hover:bg-zinc-100 transition-colors cursor-pointer"
                                >
                                    <LogOut className="text-zinc-500 w-5 h-5 shrink-0" />
                                    <span>Cerrar Sesión</span>
                                </button>
                            </div>
                        </Nav>
                        <main className="flex-1 overflow-y-auto w-full mx-auto p-2 bg-gray-100">
                            <div className="w-full h-full flex flex-col">
                                <Outlet />
                            </div>
                        </main>
                    </div>
                </div>
            </AlertProvider>
        </div>
    )
}