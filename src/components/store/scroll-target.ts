const SCROLL_KEY = "wc-scroll-to";

export function rememberScrollTarget(id: string) {
  sessionStorage.setItem(SCROLL_KEY, id);
}

export function consumeScrollTarget() {
  const target = sessionStorage.getItem(SCROLL_KEY);
  if (target) {
    sessionStorage.removeItem(SCROLL_KEY);
  }
  return target;
}
