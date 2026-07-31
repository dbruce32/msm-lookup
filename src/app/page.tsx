import { TabbedHome } from "@/components/TabbedHome";
import { getAllMonsters } from "@/lib/api";
import patchNotes from "@/data/patch-notes.json";

export default async function Home() {
  const monsters = await getAllMonsters();

  const wublins = monsters.filter(
    (m) =>
      (m.class === "Wublin" ||
        m.class === "Rare Wublin" ||
        m.class === "Epic Wublin") &&
      m.eggs
  );

  const celestials = monsters.filter(
    (m) => m.class === "Celestial" && m.eggs
  );

  const breedingMonsters = monsters.filter(
    (m) =>
      m.class !== "Wublin" &&
      m.class !== "Rare Wublin" &&
      m.class !== "Epic Wublin" &&
      m.class !== "Celestial"
  );

  return (
    <TabbedHome
      monsters={breedingMonsters}
      wublins={wublins}
      celestials={celestials}
      allMonsters={monsters}
      patchNotes={patchNotes}
    />
  );
}
