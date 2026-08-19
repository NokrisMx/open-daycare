export type AuthFieldProps = {
  id: string;
  name: string;
  label: string;
  type: "text" | "email" | "password";
  autoComplete:
    | "email"
    | "current-password"
    | "new-password"
    | "one-time-code";
  defaultValue?: string;
  placeholder?: string;
  appearance?: "default" | "code" | "accent";
};

const inputClassNames = {
  default: "border-[#EADFD0] text-[15px]",
  code:
    "border-[#EADFD0] font-display text-[18px] font-bold tracking-[3px]",
  accent: "border-[#F2A78E] text-[15px]",
} satisfies Record<NonNullable<AuthFieldProps["appearance"]>, string>;

export function AuthField({
  id,
  name,
  label,
  type,
  autoComplete,
  defaultValue,
  placeholder,
  appearance = "default",
}: AuthFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-bold tracking-[0.7px] text-[#94887B]"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={`w-full rounded-[14px] border-[1.5px] bg-white px-4 py-3.5 text-[#3F362E] placeholder:text-[#B6A99B] focus-visible:border-[#F2937A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2937A] ${inputClassNames[appearance]}`}
      />
    </div>
  );
}
