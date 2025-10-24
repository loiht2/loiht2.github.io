export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <small>
          © {year} Thanh-Loi Hoang. Built with Next.js.
        </small>
      </div>
    </footer>
  );
}
