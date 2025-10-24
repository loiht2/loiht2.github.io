import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container not-found">
      <div className="card">
        <h1>404 — Page Not Found</h1>
        <p className="muted">
          The page you followed has moved or never existed. Let’s get you back
          to steadier ground.
        </p>
        <p>
          <Link className="btn" href="/">
            Return to homepage
          </Link>
        </p>
      </div>
    </div>
  );
}
