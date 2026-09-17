"use client";

import { useState, type FormEvent } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fadeUpItem, springSoft, staggerContainer } from "@/lib/motion";

const DETAILS = [
  {
    icon: Phone,
    label: "Call",
    value: "+91 98765 43210",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@cocoahouse.in",
  },
  {
    icon: MapPin,
    label: "Warehouse",
    value: "Cocoa Lane, Indore",
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
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-10 top-0 h-32 w-32 rounded-full bg-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-8 bottom-10 h-40 w-40 rounded-full bg-caramel/15 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="shine-card relative overflow-hidden rounded-2xl border border-gold/35 bg-card px-4 py-5 shadow-[0_0_40px_rgba(228,184,92,0.16)] sm:px-6 sm:py-7"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-caramel">
          Contact
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-4xl">
          Let’s stock your counter.
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
          Bulk orders, shop supply, and custom packs. We reply the same day.
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="mt-4 grid gap-2 sm:mt-6 sm:grid-cols-3 sm:gap-3"
      >
        {DETAILS.map((item) => (
          <motion.article
            key={item.label}
            variants={fadeUpItem}
            whileHover={{ y: -4 }}
            className="shine-card rounded-2xl border border-border bg-card p-4 shadow-sm"
          >
            <item.icon className="h-5 w-5 text-gold" />
            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-caramel">
              {item.label}
            </p>
            <p className="mt-1 text-sm font-semibold">{item.value}</p>
          </motion.article>
        ))}
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springSoft, delay: 0.15 }}
        onSubmit={onSubmit}
        className="shine-card mt-4 space-y-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:mt-6 sm:p-6"
      >
        <h2 className="text-lg font-semibold">Send a message</h2>
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
          onChange={(event) => setPhone(event.target.value)}
          required
        />
        <label className="block w-full min-w-0" htmlFor="contact-message">
          <span className="mb-1.5 block text-sm font-medium">Message</span>
          <textarea
            id="contact-message"
            required
            rows={4}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="w-full min-w-0 rounded-xl border border-border bg-input px-3 py-2 text-sm outline-none ring-ring focus:ring-2 sm:text-base"
          />
        </label>
        {sent ? (
          <p className="text-sm font-medium text-caramel">
            Message received. We’ll call you shortly.
          </p>
        ) : null}
        <Button type="submit">Send enquiry</Button>
      </motion.form>
    </div>
  );
}
