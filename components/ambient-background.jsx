"use client";

import { useEffect } from "react";

export default function AmbientBackground() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root) return undefined;

    const clamp01 = (value) => Math.min(Math.max(value, 0), 1);

    const pointerState = { x: 0.5, y: 0.5 };
    let pointerFrame = null;
    const commitPointer = () => {
      pointerFrame = null;
      root.style.setProperty("--pointer-x", pointerState.x.toFixed(3));
      root.style.setProperty("--pointer-y", pointerState.y.toFixed(3));
    };
    const schedulePointer = () => {
      if (pointerFrame == null) {
        pointerFrame = window.requestAnimationFrame(commitPointer);
      }
    };
    const setPointer = (x, y, immediate = false) => {
      pointerState.x = clamp01(x);
      pointerState.y = clamp01(y);
      if (immediate) {
        commitPointer();
      } else {
        schedulePointer();
      }
    };

    let scrollProgress = 0;
    let scrollFrame = null;
    const commitScroll = () => {
      scrollFrame = null;
      root.style.setProperty("--scroll-progress", scrollProgress.toFixed(3));
    };
    const scheduleScroll = () => {
      if (scrollFrame == null) {
        scrollFrame = window.requestAnimationFrame(commitScroll);
      }
    };

    const updateScrollProgress = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress =
        maxScroll > 0 ? clamp01(window.scrollY / maxScroll) : 0;
      scheduleScroll();
    };

    let reduceMotion = false;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (event) => {
      reduceMotion = event.matches;
      if (reduceMotion) {
        if (pointerFrame != null) {
          window.cancelAnimationFrame(pointerFrame);
          pointerFrame = null;
        }
        setPointer(0.5, 0.5, true);
      }
    };

    reduceMotion = motionQuery.matches;
    if (motionQuery.addEventListener) {
      motionQuery.addEventListener("change", handleMotionChange);
    } else if (motionQuery.addListener) {
      motionQuery.addListener(handleMotionChange);
    }

    setPointer(0.5, 0.5, true);
    updateScrollProgress();

    const handlePointerMove = (event) => {
      if (reduceMotion) return;
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      setPointer(x, y);
    };

    const handlePointerLeave = () => {
      if (reduceMotion) return;
      setPointer(0.5, 0.5);
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress);

    return () => {
      if (pointerFrame != null) {
        window.cancelAnimationFrame(pointerFrame);
      }
      if (scrollFrame != null) {
        window.cancelAnimationFrame(scrollFrame);
      }
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener("change", handleMotionChange);
      } else if (motionQuery.removeListener) {
        motionQuery.removeListener(handleMotionChange);
      }
    };
  }, []);

  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient__layer ambient__layer--one" />
      <div className="ambient__layer ambient__layer--two" />
      <div className="ambient__layer ambient__layer--three" />
      <div className="ambient__mesh" />
      <div className="ambient__particles ambient__particles--near" />
      <div className="ambient__particles ambient__particles--far" />
    </div>
  );
}
