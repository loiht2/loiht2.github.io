"use client";

import { useEffect, useRef, useState } from "react";

const ROLES = ["Thanh-Loi Hoang", "a Research Assistant", "a Lifelong Learner"];

export default function TypewriterRole() {
  const [text, setText] = useState(ROLES[0]);
  const timeouts = useRef([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const clearAllTimeouts = () => {
      timeouts.current.forEach((id) => window.clearTimeout(id));
      timeouts.current = [];
    };

    if (reducedMotion) {
      let index = 0;
      setText(ROLES[index]);
      intervalRef.current = window.setInterval(() => {
        index = (index + 1) % ROLES.length;
        setText(ROLES[index]);
      }, 2000);
      return () => {
        clearAllTimeouts();
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
        }
      };
    }

    let charIndex = 0;
    let roleIndex = 0;
    let typing = true;

    const pauseAtFull = 1000;
    const pauseBetween = 400;
    const typeSpeed = 90;
    const eraseSpeed = 55;

    const schedule = (fn, delay) => {
      const id = window.setTimeout(fn, delay);
      timeouts.current.push(id);
      return id;
    };

    const tick = () => {
      const target = ROLES[roleIndex];
      if (typing) {
        const next = target.slice(0, charIndex + 1);
        setText(next);
        charIndex += 1;
        if (charIndex === target.length) {
          typing = false;
          schedule(tick, pauseAtFull);
        } else {
          schedule(tick, typeSpeed);
        }
      } else {
        const next = target.slice(0, Math.max(0, charIndex - 1));
        setText(next);
        charIndex -= 1;
        if (charIndex === 0) {
          typing = true;
          roleIndex = (roleIndex + 1) % ROLES.length;
          schedule(tick, pauseBetween);
        } else {
          schedule(tick, eraseSpeed);
        }
      }
    };

    schedule(tick, 500);

    return () => {
      clearAllTimeouts();
    };
  }, []);

  return (
    <span className="tag" id="role" aria-live="polite">
      {text}
    </span>
  );
}
