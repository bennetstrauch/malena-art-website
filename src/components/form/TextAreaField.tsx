type TextAreaFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export default function TextAreaField({ label, name, value, onChange }: TextAreaFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={4}
        required
        value={value}
        onChange={onChange}
        className="mt-1 block w-full border-b border-gray-300 bg-transparent focus:outline-none focus:border-black resize-none"
      />
    </div>
  );
}

