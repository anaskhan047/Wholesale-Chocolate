export const STORE_NAV = [
  { href: "/", hash: "", label: "Home", id: "home" },
  { href: "/", hash: "categories", label: "Category", id: "categories" },
  { href: "/contact", hash: "", label: "Contact", id: "contact" },
  { href: "/login", hash: "", label: "Account", id: "account" },
] as const;

export function storeNavHref(item: (typeof STORE_NAV)[number]) {
  return item.hash ? `${item.href}#${item.hash}` : item.href;
}

export function accountHref(role?: string | null) {
  if (role === "admin") {
    return "/admin";
  }
  return "/login";
}

export function isStoreNavActive(
  id: (typeof STORE_NAV)[number]["id"],
  pathname: string,
  hash = "",
) {
  if (id === "home") {
    return pathname === "/" && hash !== "categories";
  }
  if (id === "categories") {
    return pathname === "/" && hash === "categories";
  }
  if (id === "contact") {
    return pathname.startsWith("/contact");
  }
  if (id === "account") {
    return (
      pathname.startsWith("/login") ||
      pathname.startsWith("/signup") ||
      pathname.startsWith("/admin")
    );
  }
  return false;
}
