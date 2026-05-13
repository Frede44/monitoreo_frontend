

export default function Nav({ children }) {

    return(
        <nav className="nav flex flex-col gap-4 p-4 border-r border-zinc-200 w-50 h-full bg-white">
            {children}
        </nav>
    )

}