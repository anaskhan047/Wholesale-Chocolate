import type { ReactNode } from "react";
import { joinClass, motionClass } from "@/lib/motion";

type ModalProps = {
  children: ReactNode;
  maxWidth?: string;
};

export function Modal({ children, maxWidth = "max-w-md" }: ModalProps) {
  return (
    <div
      className={joinClass(
        motionClass("overlay"),
        "fixed inset-0 z-50 flex items-end justify-center bg-dark-chocolate/50 p-3 backdrop-blur-[2px] sm:items-center",
      )}
    >
      <div
        className={joinClass(
          motionClass("sheet"),
          "max-h-[88dvh] w-full overflow-y-auto rounded-2xl border border-border bg-card p-4 shadow-lg sm:p-5",
          maxWidth,
        )}
      >
        {children}
      </div>
    </div>
  );
}
