import { cn } from "../../lib/utils";

export function Badge({ children, variant = "default", className }) {
  const variants = {
    default: "bg-white/10 text-white",
    primary: "bg-gradient-primary text-white",
    accent: "bg-[#06B6D4]/20 text-[#06B6D4] border border-[#06B6D4]/30",
    success: "bg-green-500/20 text-green-400 border border-green-500/30",
    warning: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  };

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors", variants[variant], className)}>
      {children}
    </span>
  );
}
