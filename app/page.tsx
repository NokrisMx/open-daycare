import { kids } from "@/app/kids/data";
import { FeedScreen } from "@/components/feed/feed-screen";
import type { NewPostRecipientKid } from "@/components/feed/new-post-dialog";
import type { FeedPost } from "@/components/feed/post-card";
import type { SidebarProps } from "@/components/navigation/sidebar";

const sidebarProps = {
  roomName: "Sala Soles",
  userName: "Caro Giménez",
  userRole: "Maestra · Soles",
  userInitial: "C",
  activeItem: "feed",
} satisfies SidebarProps;

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

const recipientKids: readonly NewPostRecipientKid[] = kids.map((kid) => ({
  id: kid.id,
  firstName: kid.name.trim().split(/\s+/)[0] ?? kid.name,
  initial: kid.initial,
  avatarTone: kid.avatarTone,
}));

const headerProps = {
  daycareName: "GUARDERÍA",
  roomName: "SALA SOLES",
  greeting: "Buenas, Caro",
  summary: "12 niños · martes 17 jun",
};

export default function Home() {
  return (
    <FeedScreen
      posts={posts}
      recipientKids={recipientKids}
      sidebarProps={sidebarProps}
      headerProps={headerProps}
    />
  );
}
