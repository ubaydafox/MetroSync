import { InputProps } from "../types";

export default function Input({
  id,
  name,
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
  type = "text",
  rows = 5,
  minLength,
}: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium md:text-base">
        {label}
      </label>

      {type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          rows={rows}
          className="text-sm md:text-base resize-none rounded-lg border border-(--primary)/30 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          minLength={minLength}
          className="text-sm md:text-base rounded-lg border border-(--primary)/30 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      )}
    </div>
  );
}