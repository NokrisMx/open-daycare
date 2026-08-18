type PostBase = {
  id: string;
  publishedAt: string;
  authorLabel: string;
  audience: string;
  body: string;
  reactions: number;
  comments: number;
};

type AchievementPost = PostBase & {
  kind: "achievement";
  childName: string;
  childInitial: string;
};

type ActivityPost = PostBase & {
  kind: "activity";
  childName: string;
  childInitial: string;
  photoPlaceholder: string;
};

type AnnouncementPost = PostBase & {
  kind: "announcement";
  title: string;
};

export type FeedPost =
  | AchievementPost
  | ActivityPost
  | AnnouncementPost;

type PostCardProps = {
  post: FeedPost;
};

const badgeStyles = {
  achievement: {
    label: "LOGRO",
    container: "bg-[#CFEBD8]",
    dot: "bg-[#3E9B6C]",
    text: "text-[#3E9B6C]",
  },
  activity: {
    label: "ACTIVIDAD",
    container: "bg-[#C7E7F1]",
    dot: "bg-[#2E89A6]",
    text: "text-[#2E89A6]",
  },
  announcement: {
    label: "ANUNCIO",
    container: "bg-[#CCD8F4]",
    dot: "bg-[#4E72C8]",
    text: "text-[#4E72C8]",
  },
};

function HeartIcon() {
  return (
    <svg
      aria-hidden="true"
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
    </svg>
  );
}

function PostAvatar({ post }: PostCardProps) {
  if (post.kind === "announcement") {
    return (
      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#CCD8F4] text-[#4E72C8]">
        <svg
          aria-hidden="true"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m3 11 18-5v12L3 14v-3zM11.6 16.8a3 3 0 1 1-5.8-1.6" />
        </svg>
      </div>
    );
  }

  return (
    <div className="font-display flex size-11 shrink-0 items-center justify-center rounded-full bg-[#A9D9E8] text-[17px] font-semibold text-[#1F7A93]">
      {post.childInitial}
    </div>
  );
}

function PostBadge({ kind }: { kind: FeedPost["kind"] }) {
  const styles = badgeStyles[kind];

  return (
    <div
      className={`flex shrink-0 items-center gap-[7px] rounded-full px-3 py-1.5 ${styles.container}`}
    >
      <span className={`size-2 rounded-full ${styles.dot}`} />
      <span
        className={`text-xs font-extrabold tracking-[0.5px] ${styles.text}`}
      >
        {styles.label}
      </span>
    </div>
  );
}

function PhotoPlaceholder({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="mt-3.5 flex h-[200px] w-full flex-col items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed border-[#DBCDBA] bg-[#F4ECE1] text-[#B0A290]"
    >
      <svg
        aria-hidden="true"
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 21" />
      </svg>
      <span className="text-[13.5px]">{label}</span>
    </button>
  );
}

function PostActions({ reactions, comments }: Pick<PostBase, "reactions" | "comments">) {
  const commentLabel = `${comments} ${comments === 1 ? "comentario" : "comentarios"}`;

  return (
    <footer className="mt-4 flex items-center gap-[18px] border-t border-[#F0E6D8] pt-3.5">
      <span className="flex items-center gap-[7px] text-[14px] font-bold text-[#E0654A]">
        <HeartIcon />
        {reactions}
      </span>
      <button
        type="button"
        aria-label={commentLabel}
        className="flex items-center gap-[7px] text-[14px] font-bold text-[#94887B]"
      >
        <CommentIcon />
        {comments}
      </button>
      <span className="flex-1" />
      <button
        type="button"
        className="text-[14px] font-extrabold text-[#C5503A]"
      >
        Editar
      </button>
    </footer>
  );
}

export function PostCard({ post }: PostCardProps) {
  const title = post.kind === "announcement" ? post.title : post.childName;

  return (
    <article className="rounded-[20px] border border-[#ECE0D0] bg-[#FFFDF9] px-4 py-5 shadow-[0_4px_16px_-12px_rgba(120,90,60,0.5)] md:px-[22px]">
      <header className="mb-3.5 flex items-center gap-3">
        <PostAvatar post={post} />
        <div className="min-w-0 flex-1">
          <div className="font-display text-[16.5px] font-semibold text-[#3F362E]">
            {title}
          </div>
          <div className="text-[12.5px] text-[#A89A8B]">
            {post.publishedAt} · {post.authorLabel}
          </div>
        </div>
        <PostBadge kind={post.kind} />
      </header>

      <div className="mb-2.5 text-[12.5px] text-[#A89A8B]">
        Para: {post.audience}
      </div>
      <p className="text-[15.5px] leading-[1.55] text-[#4A4038]">
        {post.body}
      </p>

      {post.kind === "activity" ? (
        <PhotoPlaceholder label={post.photoPlaceholder} />
      ) : null}

      <PostActions reactions={post.reactions} comments={post.comments} />
    </article>
  );
}
