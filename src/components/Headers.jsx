import { Activity, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Headers() {
    const { user } = useContext(AuthContext);
    const { logout } = useContext(AuthContext);
    const Navigate = useNavigate();
    const handleLogout = () => {
        logout();
        Navigate('/login');
    }


    return (
        <header className="header flex justify-between items-center p-2 text-white text-black w-full border-b border-zinc-200">
            <div className='flex items-center gap-2  flex-row'>
                <Activity className='text-black'/>
                <h1 className="header__title text-black">IoT Monitor</h1>
            </div>

            <div className='flex flex-row justify-center items-center gap-4 '>
                <div className='text-black text-right'>
                    <p>
                        {user?.user_data?.name}
                    </p>
                    <p>
                         {user.role}
                    </p>
                </div>
                <div className='rounded border border-gray-300 p-2 cursor-pointer' onClick={handleLogout}>
                    <LogOut className='text-black'/>
                </div>
            </div>
        </header>
    )
}