"use client";

import { useEffect } from "react";
import { consumeScrollTarget } from "@/components/store/scroll-target";
import { scrollToId } from "@/lib/catalog";

function scrollIfKnown(id: string) {
  if (id === "categories" || id === "products") {
    scrollToId(id);
  }
}

export function HashScroll() {
  useEffect(() => {
    const fromNav = consumeScrollTarget();

    const onHashChange = () => {
      scrollIfKnown(window.location.hash.replace(/^#/, ""));
    };

    const delay = sessionStorage.getItem("wc-app-opened") ? 80 : 1750;
    const timer = window.setTimeout(() => {
      scrollIfKnown(fromNav || window.location.hash.replace(/^#/, ""));
    }, delay);

    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  return null;
}
