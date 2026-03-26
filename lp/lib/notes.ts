import fs from "fs";
import path from "path";

const NOTES_DIR = path.join(process.cwd(), "content", "notes");

export const NOTE_SLUG_ORDER = [
  "agency-480",
  "cpa-4x",
  "click-leak-22",
] as const;

export type NoteSlug = (typeof NOTE_SLUG_ORDER)[number];

export function getNoteSlugs(): string[] {
  if (!fs.existsSync(NOTES_DIR)) return [];
  return NOTE_SLUG_ORDER.filter((slug) =>
    fs.existsSync(path.join(NOTES_DIR, `${slug}.md`))
  );
}

export function getNoteBySlug(slug: string): {
  slug: string;
  title: string;
  content: string;
} | null {
  const filePath = path.join(NOTES_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, "utf-8");
  const firstLine = content.split("\n").find((l) => l.trim().length > 0) || "";
  const title = firstLine.replace(/^#\s*/, "").trim() || slug;
  return { slug, title, content };
}

export function getAllNotesMeta(): { slug: string; title: string }[] {
  return getNoteSlugs().map((slug) => {
    const n = getNoteBySlug(slug);
    return { slug, title: n?.title || slug };
  });
}
