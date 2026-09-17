import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-border bg-card/70">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-3 py-8 sm:grid-cols-3 sm:px-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-caramel">
            Cocoa House
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Wholesale chocolate for shops, cafes, and bulk buyers.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Explore</p>
          <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
            <Link href="/#categories" className="hover:text-caramel">
              Categories
            </Link>
            <Link href="/contact" className="hover:text-caramel">
              Contact
            </Link>
            <Link href="/login" className="hover:text-caramel">
              Login
            </Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">Contact</p>
          <p className="mt-2 text-sm text-muted-foreground">
            +91 98765 43210
            <br />
            hello@cocoahouse.in
          </p>
        </div>
      </div>
      <p className="border-t border-border px-3 py-3 text-center text-[11px] text-muted-foreground">
        © {new Date().getFullYear()} Cocoa House. All rights reserved.
      </p>
    </footer>
  );
}
