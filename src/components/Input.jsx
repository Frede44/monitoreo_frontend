const Input = ({  type = "text", value, onChange, placeholder }) => {
    return (
        <div className="flex items-center w-full ">
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required
                className=" w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />

        </div>
    )
}

export default Input;