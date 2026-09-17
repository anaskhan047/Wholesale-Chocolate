"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

const INTRO_KEY = "wc-app-opened";

export function AppIntro() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(INTRO_KEY)) {
      return;
    }

    setOpen(true);
    const timer = window.setTimeout(() => {
      sessionStorage.setItem(INTRO_KEY, "1");
      setOpen(false);
    }, 1600);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-dark-chocolate"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            initial={{ scale: 0.45, opacity: 0, rotate: -8 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 1.12, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 16 }}
            className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-[2rem] bg-card shadow-[0_0_60px_rgba(228,184,92,0.45)]"
          >
            <Image src="/logo.png" alt="Cocoa House" fill className="object-cover" />
            <span className="pointer-events-none absolute inset-0 shine-sweep" />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
