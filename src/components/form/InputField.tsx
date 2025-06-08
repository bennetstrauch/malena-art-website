type InputFieldProps = {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function InputField({ label, name, type = "text", value, onChange }: InputFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        value={value}
        onChange={onChange}
        className="mt-1 block w-full border-b border-gray-300 bg-transparent focus:outline-none focus:border-black"
      />
    </div>
  );
}
