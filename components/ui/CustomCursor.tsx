"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const ringX = useSpring(-100, { damping: 24, stiffness: 350 });
  const ringY = useSpring(-100, { damping: 24, stiffness: 350 });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");
    if (!mediaQuery.matches) return;
    setEnabled(true);

    const onMouseMove = (e: MouseEvent) => {
      ringX.set(e.clientX);
      ringY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const clickable = Boolean(
          target.closest(
            "a, button, input, select, label, [role='button'], .cursor-pointer"
          )
        );
        setIsHovered(clickable);
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [ringX, ringY, isVisible]);

  if (!enabled) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[999999] rounded-full border border-blue-500/50 bg-blue-500/10 shadow-[0_0_12px_rgba(37,99,235,0.25)]"
      style={{
        x: ringX,
        y: ringY,
        translateX: "-50%",
        translateY: "-50%",
        opacity: isVisible ? 1 : 0,
      }}
      animate={{
        width: isHovered ? 44 : 32,
        height: isHovered ? 44 : 32,
        borderColor: isHovered ? "rgba(22, 163, 74, 0.8)" : "rgba(37, 99, 235, 0.6)",
        backgroundColor: isHovered ? "rgba(22, 163, 74, 0.1)" : "rgba(37, 99, 235, 0.05)",
      }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
    />
  );
}
