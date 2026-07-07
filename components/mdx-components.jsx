import { Link } from "next-view-transitions";

export const mdxComponents = {
  a: ({ href = "", children, ...rest }) =>
    href.startsWith("/") ? (
      <Link href={href} {...rest}>{children}</Link>
    ) : (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} {...rest}>
        {children}
      </a>
    ),
};
