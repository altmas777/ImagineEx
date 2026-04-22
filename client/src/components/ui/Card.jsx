import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Card = forwardRef(({ className, gradientBorder, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-[#111118] rounded-2xl overflow-hidden",
        gradientBorder && "border-gradient",
        !gradientBorder && "border border-white/10",
        className
      )}
      {...props}
    >
      <div className={cn("h-full w-full flex flex-col", gradientBorder && "bg-[#111118] rounded-2xl relative z-10")}>
        {children}
      </div>
    </div>
  );
});

Card.displayName = "Card";

export { Card };
