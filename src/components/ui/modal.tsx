"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { joinClass, motionClass } from "@/lib/motion";

type ModalProps = {
  children: ReactNode;
  maxWidth?: string;
  onClose?: () => void;
  className?: string;
};

export function Modal({
  children,
  maxWidth = "max-w-md",
  onClose,
  className = "",
}: ModalProps) {
  return (
    <div
      className={joinClass(
        motionClass("overlay"),
        "fixed inset-0 z-50 flex items-end justify-center bg-dark-chocolate/50 p-3 backdrop-blur-[2px] sm:items-center",
      )}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={joinClass(
          motionClass("sheet"),
          "relative max-h-[90dvh] w-full overflow-y-auto rounded-2xl border border-border bg-card p-4 shadow-lg sm:p-5",
          maxWidth,
          className,
        )}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={cn(
              "absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm",
              "hover:border-gold",
            )}
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
        {children}
      </div>
    </div>
  );
}
