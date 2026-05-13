export default function LinkNav({ to, children, icon }) {
    return (
        <a href={to} className="text-gray-700 hover:text-gray-900">
            <li className="nav-item  flex items-center gap-2 p-2 text-xs hover:bg-gray-100 rounded">
                {icon}

                {children}

            </li>
        </a>
    )
}