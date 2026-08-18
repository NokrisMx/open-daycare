type FeedHeaderProps = {
  daycareName: string;
  roomName: string;
  greeting: string;
  summary: string;
};

export function FeedHeader({
  daycareName,
  roomName,
  greeting,
  summary,
}: FeedHeaderProps) {
  return (
    <header className="mb-6">
      <div className="mb-1 text-[12.5px] font-extrabold tracking-[0.8px] text-[#D9583C]">
        {daycareName} · {roomName}
      </div>
      <h1 className="font-display text-[30px] font-semibold text-[#3F362E]">
        {greeting}
      </h1>
      <p className="mt-[5px] text-[14.5px] text-[#94887B]">{summary}</p>
    </header>
  );
}
