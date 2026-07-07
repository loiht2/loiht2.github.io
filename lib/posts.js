import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export function getAllPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const slug = f.replace(/\.mdx$/, "");
      const { data, content } = matter(fs.readFileSync(path.join(POSTS_DIR, f), "utf8"));
      return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? "",
        date: typeof data.date === "string" ? data.date : data.date?.toISOString().slice(0, 10),
        content,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug) {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}
