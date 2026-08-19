import { kids } from "@/app/kids/data";
import { KidsList } from "@/components/kids/kids-list";

export default function KidsPage() {
  return <KidsList roomName="Sala Soles" kids={kids} />;
}
