const Button = ({ children, onClick, type = 'button', estile = '', ...props }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`px-4 py-2  rounded  focus:outline-none  ${estile}`}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button;