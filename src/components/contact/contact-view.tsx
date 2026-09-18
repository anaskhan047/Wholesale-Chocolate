"use client";

import dynamic from "next/dynamic";
import { useState, type FormEvent } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fadeUpItem, springSoft, staggerContainer } from "@/lib/motion";

const ContactCallerCanvas = dynamic(
  () =>
    import("@/components/contact/contact-caller-canvas").then(
      (mod) => mod.ContactCallerCanvas,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[240px] w-full items-center justify-center rounded-2xl border border-border bg-muted/40 sm:h-[300px] lg:h-[340px]">
        <p className="text-sm text-muted-foreground">Loading 3D caller…</p>
      </div>
    ),
  },
);

const MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58890.094322843244!2d75.75450897216797!3d22.704780402138336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fdf56caf7d47%3A0x1220dffcecdfbd85!2sWholesale%20Chocolate!5e0!3m2!1sen!2sin!4v1789719351966!5m2!1sen!2sin";

const DETAILS = [
  {
    icon: Phone,
    label: "Call",
    value: "+91 93018 32678",
    href: "tel:+919301832678",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@cocoahouse.in",
    href: "mailto:hello@cocoahouse.in",
  },
  {
    icon: MapPin,
    label: "Warehouse",
    value: "Scheme no 71, Indore",
    href: "https://maps.google.com/?q=Wholesale+Chocolate+Indore",
  },
];

export function ContactView() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
    setName("");
    setPhone("");
    setMessage("");
  }

  return (
    <div className="relative overflow-hidden pb-2">
      <div className="pointer-events-none absolute -left-16 top-8 h-44 w-44 rounded-full bg-gold/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 top-40 h-52 w-52 rounded-full bg-caramel/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 left-1/3 h-36 w-36 rounded-full bg-chocolate/10 blur-3xl" />

      <motion.section
        initial={{ opacity: 0, y: 18, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformPerspective: 900 }}
        className="relative overflow-hidden rounded-[1.35rem] border border-gold/40 bg-card/90 shadow-[0_18px_50px_rgba(90,46,27,0.12)]"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-chocolate via-gold to-caramel" />
        <div className="grid items-stretch gap-1 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center px-4 pb-3 pt-5 sm:px-6 sm:pt-7 lg:pb-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-caramel">
              Contact
            </p>
            <h1 className="mt-2 text-balance text-2xl font-semibold tracking-tight sm:text-4xl">
              Talk wholesale with Cocoa House
            </h1>
            <p className="mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
              Bulk orders, shop supply, and custom packs. Our team is ready on
              the call — same-day reply.
            </p>
          </div>
          <div className="min-h-[300px] sm:min-h-[360px] lg:min-h-[400px]">
            <ContactCallerCanvas />
          </div>
        </div>
      </motion.section>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-3 sm:gap-3"
      >
        {DETAILS.map((item, index) => (
          <motion.a
            key={item.label}
            href={item.href}
            target={item.label === "Warehouse" ? "_blank" : undefined}
            rel={item.label === "Warehouse" ? "noreferrer" : undefined}
            variants={fadeUpItem}
            whileHover={{ y: -6, rotateX: 4, rotateY: index % 2 ? -3 : 3 }}
            transition={springSoft}
            style={{ transformPerspective: 700 }}
            className="shine-card rounded-2xl border border-border bg-card p-4 shadow-[0_10px_28px_rgba(90,46,27,0.08)]"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gold/20 text-chocolate">
              <item.icon className="h-4 w-4" />
            </span>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-caramel">
              {item.label}
            </p>
            <p className="mt-1 text-sm font-semibold">{item.value}</p>
          </motion.a>
        ))}
      </motion.div>

      <div className="mt-4 grid gap-4 lg:mt-6 lg:grid-cols-2 lg:items-stretch lg:gap-5">
        <motion.form
          initial={{ opacity: 0, x: -24, rotateY: 8 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ ...springSoft, delay: 0.12 }}
          style={{ transformPerspective: 1000 }}
          onSubmit={onSubmit}
          className="shine-card flex h-full flex-col space-y-3 rounded-[1.35rem] border border-border bg-card p-4 shadow-[0_16px_40px_rgba(90,46,27,0.1)] sm:p-6"
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-caramel">
              Enquiry
            </p>
            <h2 className="mt-1 text-lg font-semibold sm:text-xl">
              Send a message
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Left side form — we’ll call you back on your number.
            </p>
          </div>
          <Input
            id="contact-name"
            label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <Input
            id="contact-phone"
            label="Phone"
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(event) =>
              setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))
            }
            required
          />
          <label className="block w-full min-w-0" htmlFor="contact-message">
            <span className="mb-1.5 block text-sm font-medium">Message</span>
            <textarea
              id="contact-message"
              required
              rows={5}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Tell us about qty, product type, delivery city…"
              className="w-full min-w-0 rounded-xl border border-border bg-input px-3 py-2 text-sm outline-none ring-ring focus:ring-2 sm:text-base"
            />
          </label>
          {sent ? (
            <p className="text-sm font-medium text-caramel">
              Message received. We’ll call you shortly.
            </p>
          ) : null}
          <div className="mt-auto pt-1">
            <Button type="submit">Send enquiry</Button>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, x: 24, rotateY: -8 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ ...springSoft, delay: 0.18 }}
          style={{ transformPerspective: 1000 }}
          className="flex h-full min-h-[280px] flex-col overflow-hidden rounded-[1.35rem] border border-border bg-card shadow-[0_16px_40px_rgba(90,46,27,0.1)]"
        >
          <div className="border-b border-border px-4 py-3 sm:px-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-caramel">
              Find us
            </p>
            <h2 className="mt-1 text-lg font-semibold sm:text-xl">
              Wholesale Chocolate, Indore
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Right side map — visit or share for delivery pickup.
            </p>
          </div>
          <div className="relative min-h-[260px] flex-1 bg-muted sm:min-h-[320px]">
            <iframe
              title="Wholesale Chocolate location map"
              src={MAP_SRC}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
