

export default function Nav({ children, isOpen, onClose }) {

    return(
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 z-30 md:hidden"
                    onClick={onClose}
                />
            )}
            <nav className={`nav fixed inset-y-0 left-0 z-40 transform ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col gap-4 p-4 border-r border-zinc-200 w-60 h-full bg-white`}>
                {children}
            </nav>
        </>
    )

}