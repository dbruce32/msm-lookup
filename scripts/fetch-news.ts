import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "src", "data");
const OUT_FILE = path.join(OUT_DIR, "patch-notes.json");

const WIKI_API = "https://mysingingmonsters.fandom.com/api.php";
const PAGE = "Version_History/4.0";

interface PatchNote {
  version: string;
  releaseDate: string | null;
  highlights: string[];
  officialUrl: string | null;
}

function parseWikitext(wikitext: string): PatchNote[] {
  const notes: PatchNote[] = [];

  // Split by ==Version X.X.X== headers
  const sections = wikitext.split(/^==\s*(Version\s+[\d.]+)\s*==/m);

  // sections[0] is preamble, then alternating: [title, content, title, content, ...]
  for (let i = 1; i < sections.length; i += 2) {
    const version = sections[i].replace("Version ", "").trim();
    const content = sections[i + 1] || "";

    // Extract release date
    const dateMatch = content.match(
      /Released on ([A-Za-z]+ \d{1,2}(?:st|nd|rd|th)?,? \d{4})/
    );
    const releaseDate = dateMatch ? cleanDate(dateMatch[1]) : null;

    // Extract official update URL
    const urlMatch = content.match(
      /Official update page:\s*(https?:\/\/[^\s\n*]+)/
    );
    const officialUrl = urlMatch ? urlMatch[1] : null;

    // Extract highlight bullet points (lines starting with *)
    const highlights: string[] = [];
    const lines = content.split("\n");
    for (const line of lines) {
      const bulletMatch = line.match(/^\*(.+)/);
      if (bulletMatch) {
        const text = cleanWikitext(bulletMatch[1].trim());
        // Skip meta lines (Released on, Official update page, gallery-related)
        if (
          text.startsWith("Released on") ||
          text.startsWith("Official update page") ||
          text.length === 0
        ) {
          continue;
        }
        highlights.push(text);
      }
    }

    notes.push({ version, releaseDate, highlights, officialUrl });
  }

  return notes;
}

function cleanDate(raw: string): string {
  // Remove ordinal suffixes (1st -> 1, 2nd -> 2, etc.)
  return raw.replace(/(\d+)(?:st|nd|rd|th)/, "$1");
}

function cleanWikitext(text: string): string {
  return (
    text
      // Remove [[Link|Display]] -> Display, [[Link]] -> Link
      .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, "$2")
      .replace(/\[\[([^\]]+)\]\]/g, "$1")
      // Remove [URL text] external links -> text
      .replace(/\[https?:\/\/[^\s\]]+ ([^\]]+)\]/g, "$1")
      .replace(/\[https?:\/\/[^\]]+\]/g, "")
      // Remove ''italic'' and '''bold'''
      .replace(/'{2,3}/g, "")
      // Remove <hr>, <br>, and other HTML tags
      .replace(/<[^>]+>/g, "")
      // Remove File: references
      .replace(/\[\[File:[^\]]+\]\]/g, "")
      // Clean up extra whitespace
      .replace(/\s+/g, " ")
      .trim()
  );
}

async function main() {
  console.log("📰 Fetching MSM patch notes...\n");

  const url = `${WIKI_API}?action=parse&page=${encodeURIComponent(PAGE)}&prop=wikitext&format=json`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Wiki API returned ${res.status}`);
  }

  const data = await res.json();
  const wikitext: string = data.parse.wikitext["*"];

  const notes = parseWikitext(wikitext);
  console.log(`  ✓ Parsed ${notes.length} version entries`);

  // Show a preview
  const latest = notes[0];
  if (latest) {
    console.log(`  • Latest: v${latest.version} (${latest.releaseDate ?? "unknown date"})`);
    console.log(`  • ${latest.highlights.length} notes`);
  }

  // Write output
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(notes, null, 2) + "\n");
  const fileSize = (Buffer.byteLength(JSON.stringify(notes, null, 2)) / 1024).toFixed(0);
  console.log(`\n💾 Written to ${OUT_FILE} (${fileSize} KB)`);
  console.log("✅ Done");
}

main().catch((err) => {
  console.error("❌ Failed to fetch patch notes:", err);
  process.exit(1);
});
