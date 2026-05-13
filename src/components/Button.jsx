const Button = ({ children, onClick, type = 'button', estile = '' }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`px-4 py-2 text-white rounded  focus:outline-none focus:ring-2  ${estile}`}
        >
            {children}
        </button>
    )
}

export default Button;