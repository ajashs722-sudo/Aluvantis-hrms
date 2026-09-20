import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative w-auto min-w-36 px-6 py-3 cursor-pointer overflow-hidden rounded-full border border-[#0E4F4F]/20 bg-white text-center font-semibold text-[#0E4F4F] transition-all duration-300 hover:border-[#0E4F4F]",
        className,
      )}
      {...props}
    >
      <span className="inline-block translate-x-0 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
        {text}
      </span>
      <div className="absolute inset-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-[#F6F3EC] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        <span className="font-semibold">{text}</span>
        <ArrowRight className="w-4 h-4" />
      </div>
      <div className="absolute left-[15%] top-[45%] h-2 w-2 scale-[1] rounded-full bg-[#0E4F4F] transition-all duration-500 ease-in-out group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[2.5]"></div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
