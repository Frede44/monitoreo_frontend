
import { Outlet, } from 'react-router-dom';
import Headers from '../components/Headers';
import Nav from '../components/Nav';
import { LayoutPanelLeft, Cpu, User } from 'lucide-react';
import LinkNav from '../components/LinkNav';






export default function DashboardLayout() {
   

    

    return(
        <div className="h-screen bg-gray-50 flex flex-col">
            <Headers />
            <div className="flex flex-1 overflow-hidden">
                <Nav>
                    <LinkNav to="/panel" icon={<LayoutPanelLeft className="w-5" />}>
                        Panel
                    </LinkNav>
                    <LinkNav to="/panel/dispositivos" icon={<Cpu className="w-5" />}>
                        CPU
                    </LinkNav>
                    <LinkNav to="/panel/usuarios" icon={<User className="w-5" />}>
                        User
                    </LinkNav>
                </Nav>
                <main className="flex-1 overflow-y-auto w-full mx-auto p-2 bg-gray-100">
                    <div className="w-full h-full flex flex-col">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )


}