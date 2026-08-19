import { notFound } from "next/navigation";

import { getKidById, kids } from "@/app/kids/data";
import { KidProfile } from "@/components/kids/kid-profile";

export function generateStaticParams() {
  return kids.map((kid) => ({ id: String(kid.id) }));
}

export default async function KidProfilePage({
  params,
}: PageProps<"/kids/[id]">) {
  const { id } = await params;
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || String(numericId) !== id) {
    notFound();
  }

  const profile = getKidById(numericId);

  if (!profile) {
    notFound();
  }

  return <KidProfile profile={profile} />;
}
