import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPost } from "@/lib/posts";
import { mdxComponents } from "@/components/mdx-components";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/writing/${slug}` },
    openGraph: { title: post.title, description: post.description, type: "article", publishedTime: post.date },
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6">
      <div className="progress-bar" aria-hidden="true" />
      <header className="pb-8 pt-16">
        <h1 className="anim text-3xl font-semibold tracking-tight sm:text-4xl">{post.title}</h1>
        <p className="anim mt-3 font-mono text-sm text-muted" style={{ "--d": "90ms" }}>
          <time dateTime={post.date}>{post.date}</time>
        </p>
      </header>
      <div className="prose anim pb-16" style={{ "--d": "180ms" }}>
        <MDXRemote source={post.content} components={mdxComponents} />
      </div>
    </article>
  );
}
