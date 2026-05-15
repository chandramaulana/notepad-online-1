import { type ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost" | "danger";
};

export function Button({ className, variant = "default", ...props }: Props) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        {
          "border-[var(--line)] bg-[var(--accent)] text-white hover:opacity-90": variant === "default",
          "border-[var(--line)] bg-transparent text-[var(--text)] hover:bg-[var(--bg-soft)]": variant === "ghost",
          "border-red-500/50 bg-red-500 text-white hover:bg-red-500/90": variant === "danger"
        },
        className
      )}
      {...props}
    />
  );
}
