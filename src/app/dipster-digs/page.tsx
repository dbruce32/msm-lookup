import type { Metadata } from "next";
import { DipsterDigs } from "@/components/DipsterDigs";

export const metadata: Metadata = {
  title: "Dipster Digs Solver — MSM Lookup",
  description:
    "Interactive solver and helper tool for the Dipster Digs minigame in My Singing Monsters. Track tiles, get probability analysis, and find all Dipsters efficiently.",
};

export default function DipsterDigsPage() {
  return <DipsterDigs />;
}
