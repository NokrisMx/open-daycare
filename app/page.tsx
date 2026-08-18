import { ComposerPrompt } from "@/components/feed/composer-prompt";
import { FeedHeader } from "@/components/feed/feed-header";
import { MobileNavigation } from "@/components/feed/mobile-navigation";
import { PostCard, type FeedPost } from "@/components/feed/post-card";
import { SectionDivider } from "@/components/feed/section-divider";
import { Sidebar } from "@/components/feed/sidebar";

const posts: FeedPost[] = [
  {
    id: "mateo-achievement-1420",
    kind: "achievement",
    childName: "Mateo",
    childInitial: "M",
    publishedAt: "14:20",
    authorLabel: "publicado por vos",
    audience: "familia de Mateo",
    body: "¡Usó el orinal solito por primera vez! Estaba feliz de contárselo a todos. Un gran paso.",
    reactions: 3,
    comments: 1,
  },
  {
    id: "mateo-activity-0940",
    kind: "activity",
    childName: "Mateo",
    childInitial: "M",
    publishedAt: "09:40",
    authorLabel: "publicado por vos",
    audience: "familia de Mateo",
    body: "Pintamos con témperas esta mañana. Mateo eligió el azul para todo y se concentró un montón mezclando colores.",
    photoPlaceholder: "Foto · pintando con témperas",
    reactions: 5,
    comments: 2,
  },
  {
    id: "general-announcement-0750",
    kind: "announcement",
    title: "Anuncio general",
    publishedAt: "07:50",
    authorLabel: "publicado por vos",
    audience: "toda la sala",
    body: "El viernes salimos al parque por la mañana. Recuerden mandar gorra y una botellita de agua.",
    reactions: 8,
    comments: 0,
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#F6ECDF]">
      <Sidebar
        roomName="Sala Soles"
        userName="Caro Giménez"
        userRole="Maestra · Soles"
        userInitial="C"
        activeItem="feed"
      />

      <main className="h-screen w-full min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <MobileNavigation
          roomName="Sala Soles"
          userName="Caro Giménez"
          userRole="Maestra · Soles"
          userInitial="C"
          activeItem="feed"
        />

        <div
          data-feed-content
          className="mx-auto w-full max-w-[760px] px-4 pt-6 pb-12 md:px-10 md:pt-[34px] md:pb-20"
        >
          <FeedHeader
            daycareName="GUARDERÍA"
            roomName="SALA SOLES"
            greeting="Buenas, Caro"
            summary="12 niños · martes 17 jun"
          />

          <ComposerPrompt
            authorInitial="C"
            placeholder="Compartí un momento…"
          />

          <SectionDivider label="PUBLICADO HOY" />

          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
