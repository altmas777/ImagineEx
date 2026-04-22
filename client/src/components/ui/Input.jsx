import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Input = forwardRef(({ className, type = "text", error, ...props }, ref) => {
  return (
    <div className="w-full">
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:border-[#06B6D4] focus-visible:ring-1 focus-visible:ring-[#06B6D4] disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});
Input.displayName = "Input";

const Textarea = forwardRef(({ className, error, ...props }, ref) => {
  return (
    <div className="w-full">
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:border-[#06B6D4] focus-visible:ring-1 focus-visible:ring-[#06B6D4] disabled:cursor-not-allowed disabled:opacity-50 resize-y",
          error && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});
Textarea.displayName = "Textarea";

export { Input, Textarea };
