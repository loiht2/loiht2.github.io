import { getAllPosts } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

export default function sitemap() {
  const now = new Date();
  const routes = ["", "/research", "/projects", "/writing", "/cv"].map((r) => ({
    url: `${SITE_URL}${r}`,
    lastModified: now,
  }));
  const posts = getAllPosts().map((p) => ({
    url: `${SITE_URL}/writing/${p.slug}`,
    lastModified: new Date(p.date),
  }));
  return [...routes, ...posts];
}
