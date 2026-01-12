export default function Input({
  label,
  error,
  type = "text",
  ...props
}) {
  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type={type}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2
          ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "focus:ring-blue-500"
          }`}
        {...props}
      />

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
