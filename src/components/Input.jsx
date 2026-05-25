import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = ({ type = "text", value, onChange, placeholder }) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <div className="relative flex items-center w-full">
            <input
                type={inputType}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required
                className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black ${
                    isPassword ? "pr-10" : ""
                }`}
            />
            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none flex items-center justify-center cursor-pointer"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            )}
        </div>
    );
};

export default Input;