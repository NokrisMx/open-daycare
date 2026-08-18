type SectionDividerProps = {
  label: string;
};

export function SectionDivider({ label }: SectionDividerProps) {
  return (
    <div className="mb-3.5 flex items-center gap-3.5">
      <span className="text-[12.5px] font-extrabold tracking-[0.8px] text-[#8A7C6D]">
        {label}
      </span>
      <span className="h-px flex-1 bg-[#E7DAC8]" />
    </div>
  );
}
