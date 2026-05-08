import { type ReactNode, type SelectHTMLAttributes, useId } from "react";

interface SelectOption {
  value: string;
  label: string;
}
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
  error?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const Select = ({
  options,
  label,
  error,
  icon,
  fullWidth = true,
  className = "",
  id,
  ...rest
}: SelectProps) => {
  const selectId = useId();

  return (
    <div className={`${fullWidth ? "w-full" : ""} mb-4`}>
      {label && <label htmlFor={selectId}>{label}</label>}

      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-2 flex items-center">{icon}</div>}
      </div>

      <select id={selectId} {...rest}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Select;
