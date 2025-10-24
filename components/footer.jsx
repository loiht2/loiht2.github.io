export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <small>
          © {year} Thanh-Loi Hoang. Crafted with Next.js and an obsession for
          dependable systems.
        </small>
      </div>
    </footer>
  );
}
