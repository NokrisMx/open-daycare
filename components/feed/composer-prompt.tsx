type ComposerPromptProps = {
  authorInitial: string;
  placeholder: string;
  onClick?: () => void;
};

export function ComposerPrompt({
  authorInitial,
  placeholder,
  onClick,
}: ComposerPromptProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-6 flex w-full items-center gap-3.5 rounded-[18px] border border-[#ECE0D0] bg-[#FFFDF9] px-3.5 py-3.5 text-left shadow-[0_4px_14px_-10px_rgba(120,90,60,0.4)] md:px-[18px]"
    >
      <span className="font-display flex size-10 shrink-0 items-center justify-center rounded-full bg-[#F2937A] text-[16px] font-semibold text-white">
        {authorInitial}
      </span>
      <span className="flex-1 text-[15px] text-[#A89A8B]">
        {placeholder}
      </span>
      <span className="flex size-[38px] shrink-0 items-center justify-center rounded-xl bg-[#FBE3D8] text-[#E0654A]">
        <svg
          aria-hidden="true"
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      </span>
    </button>
  );
}
