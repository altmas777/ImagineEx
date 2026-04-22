import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Button = forwardRef(({ className, variant = "default", size = "md", isLoading, children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-gradient-primary text-white hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:-translate-y-0.5",
    outline: "border-gradient bg-transparent hover:bg-white/5 text-white",
    ghost: "bg-transparent hover:bg-white/10 text-white",
    secondary: "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm",
  };

  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-14 px-8 text-lg font-semibold",
    icon: "h-10 w-10",
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-5 w-5 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };
