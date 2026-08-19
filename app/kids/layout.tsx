import { MobileNavigation } from "@/components/navigation/mobile-navigation";
import { Sidebar, type SidebarProps } from "@/components/navigation/sidebar";

const sidebarProps = {
  roomName: "Sala Soles",
  userName: "Caro Giménez",
  userRole: "Maestra · Soles",
  userInitial: "C",
  activeItem: "children",
} satisfies SidebarProps;

export default function KidsLayout({ children }: LayoutProps<"/kids">) {
  return (
    <div className="flex h-dvh flex-col bg-[#F6ECDF] md:h-screen md:flex-row">
      <Sidebar {...sidebarProps} />
      <MobileNavigation {...sidebarProps} />

      <main
        data-page-scroll-container
        className="min-h-0 w-full min-w-0 flex-1 overflow-x-hidden overflow-y-auto [scrollbar-gutter:stable] md:h-screen"
      >
        <div
          data-page-content
          className="mx-auto w-full max-w-[880px] pt-6 pr-[calc(1rem+env(safe-area-inset-right))] pb-[calc(3rem+env(safe-area-inset-bottom))] pl-[calc(1rem+env(safe-area-inset-left))] md:px-10 md:pt-[34px] md:pb-20"
        >
          {children}
        </div>
      </main>
    </div>
  );
}
