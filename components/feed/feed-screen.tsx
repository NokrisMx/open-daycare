"use client";

import { useRef, useState } from "react";

import { ComposerPrompt } from "@/components/feed/composer-prompt";
import { FeedHeader } from "@/components/feed/feed-header";
import {
  NewPostDialog,
  type NewPostDraft,
  type NewPostRecipientKid,
} from "@/components/feed/new-post-dialog";
import { PostCard, type FeedPost } from "@/components/feed/post-card";
import { SectionDivider } from "@/components/feed/section-divider";
import { MobileNavigation } from "@/components/navigation/mobile-navigation";
import { Sidebar, type SidebarProps } from "@/components/navigation/sidebar";

type FeedHeaderProps = React.ComponentProps<typeof FeedHeader>;

export type FeedScreenProps = {
  posts: readonly FeedPost[];
  recipientKids: readonly NewPostRecipientKid[];
  sidebarProps: SidebarProps;
  headerProps: FeedHeaderProps;
};

function formatAudienceNames(names: readonly string[]): string {
  if (names.length < 2) {
    return names[0] ?? "";
  }

  return `${names.slice(0, -1).join(", ")} y ${names.at(-1)}`;
}

function formatCurrentTime(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

export function FeedScreen({
  posts,
  recipientKids,
  sidebarProps,
  headerProps,
}: FeedScreenProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [ephemeralPosts, setEphemeralPosts] = useState<FeedPost[]>([]);
  const nextPostNumberRef = useRef(1);

  function handlePublish(draft: NewPostDraft) {
    const selectedKids = draft.kidIds
      .map((kidId) => recipientKids.find((kid) => kid.id === kidId))
      .filter((kid): kid is NewPostRecipientKid => kid !== undefined);
    const selectedNames = selectedKids.map((kid) => kid.firstName);
    const recipient = draft.isWholeRoom
      ? {
          childName: "Sala Soles",
          childInitial: "S",
          audience: "toda la sala",
        }
      : selectedKids.length === 1
        ? {
            childName: selectedKids[0].firstName,
            childInitial: selectedKids[0].initial,
            audience: `familia de ${selectedKids[0].firstName}`,
          }
        : {
            childName: "Varios niños",
            childInitial: "V",
            audience: `familias de ${formatAudienceNames(selectedNames)}`,
          };
    const postNumber = nextPostNumberRef.current;
    const basePost = {
      id: `new-post-${postNumber}`,
      publishedAt: formatCurrentTime(),
      authorLabel: "publicado por vos",
      audience: recipient.audience,
      body: draft.description.trim(),
      reactions: 0,
      comments: 0,
    };
    let newPost: FeedPost;

    if (draft.type === "anuncio") {
      newPost = {
        ...basePost,
        kind: "announcement",
        title: "Anuncio general",
      };
    } else if (draft.type === "foto" || draft.type === "actividad") {
      newPost = {
        ...basePost,
        kind: "activity",
        childName: recipient.childName,
        childInitial: recipient.childInitial,
        photoPlaceholder: "Fotos de la publicación",
      };
    } else {
      newPost = {
        ...basePost,
        kind: "achievement",
        childName: recipient.childName,
        childInitial: recipient.childInitial,
      };
    }

    nextPostNumberRef.current += 1;
    setEphemeralPosts((currentPosts) => [...currentPosts, newPost]);
  }

  function openDialog() {
    setIsDialogOpen(true);
  }

  return (
    <div className="flex h-dvh flex-col bg-[#F6ECDF] md:h-screen md:flex-row">
      <Sidebar {...sidebarProps} onNewPost={openDialog} />
      <MobileNavigation {...sidebarProps} onNewPost={openDialog} />

      <main
        data-page-scroll-container
        className="min-h-0 w-full min-w-0 flex-1 overflow-x-hidden overflow-y-auto [scrollbar-gutter:stable] md:h-screen"
      >
        <div
          data-page-content
          className="mx-auto w-full max-w-[760px] pt-6 pr-[calc(1rem+env(safe-area-inset-right))] pb-[calc(3rem+env(safe-area-inset-bottom))] pl-[calc(1rem+env(safe-area-inset-left))] md:px-10 md:pt-[34px] md:pb-20"
        >
          <FeedHeader {...headerProps} />

          <ComposerPrompt
            authorInitial={sidebarProps.userInitial}
            placeholder="Compartí un momento…"
            onClick={openDialog}
          />

          <SectionDivider label="PUBLICADO HOY" />

          <div className="flex flex-col gap-4">
            {[...posts, ...ephemeralPosts].map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </main>

      <NewPostDialog
        isOpen={isDialogOpen}
        kids={recipientKids}
        onClose={() => setIsDialogOpen(false)}
        onPublish={handlePublish}
      />
    </div>
  );
}
