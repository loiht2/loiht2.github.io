import { Link } from "next-view-transitions";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[55vh] max-w-3xl flex-col items-center justify-center gap-5 px-4 text-center">
      <p className="anim font-mono text-sm text-muted">404</p>
      <h1 className="anim text-3xl font-semibold tracking-tight" style={{ "--d": "80ms" }}>Page not found</h1>
      <Link href="/" className="btn btn-primary anim" style={{ "--d": "160ms" }}>Back to home</Link>
    </div>
  );
}
