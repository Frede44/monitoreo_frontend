export default function View({title, text, estilos, children}) {
    return (
        <div className={`w-auto h-auto flex flex-col gap-3 p-4 bg-white rounded shadow m-2 `}>
            <div>
                <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-gray-600 text-sm">{text}</p>
            </div>
            <div className={`${estilos || ''}`}>
                {children}
            </div>
        </div>
    )
}