import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container not-found">
      <div className="card">
        <h1>404 — Page Not Found</h1>
        <p className="muted">The page you’re looking for doesn’t exist.</p>
        <p>
          <Link className="btn" href="/">
            Go Home
          </Link>
        </p>
      </div>
    </div>
  );
}
