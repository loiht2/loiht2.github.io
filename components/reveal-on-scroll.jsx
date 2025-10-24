"use client";

import {
  createElement,
  useEffect,
  useRef,
  useState,
} from "react";

const variants = new Set(["fade-up", "fade-in", "fade-left", "fade-right"]);

export default function RevealOnScroll({
  as = "div",
  className = "",
  variant = "fade-up",
  once = true,
  children,
  ...props
}) {
  const elementRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setVisible(false);
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  const variantClass = variants.has(variant) ? variant : "fade-up";
  const classes = [
    "reveal",
    `reveal-${variantClass}`,
    visible && "reveal-visible",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return createElement(
    as,
    {
      ref: elementRef,
      className: classes,
      ...props,
    },
    children,
  );
}
