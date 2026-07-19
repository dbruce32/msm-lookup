import { MonsterSearch } from "@/components/MonsterSearch";
import { getAllMonsters } from "@/lib/api";

export default async function Home() {
  const monsters = await getAllMonsters();

  return <MonsterSearch monsters={monsters} />;
}
