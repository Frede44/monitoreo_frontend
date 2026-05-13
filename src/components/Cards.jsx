export function Cards({ title, value, icon, text, color }) {
    return (
        <div className="bg-white rounded shadow p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-row w-full">
                <p className={`${color}`}>{icon}</p>
                <p>{title}</p>
            </div>

            <p className={`text-2xl font-bold ${color}`}>{value}</p>

            <p className="text-sm text-gray-500">{text}</p>
        </div>
    )
}