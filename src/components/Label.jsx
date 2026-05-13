const Label = ({ label }) => {
    return (
        <div className="flex items-center gap-2">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>

        </div>
    )
}

export default Label;