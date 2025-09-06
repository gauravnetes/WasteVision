import React, { CSSProperties, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export interface ShimmerButtonProps extends ComponentPropsWithoutRef<"button"> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor,
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "9999px",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": shimmerColor || "rgba(255, 255, 255, 0.4)", // shimmer highlight
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            background:
              "linear-gradient(90deg, #16a34a, #22c55e, #86efac)", // green gradient background
            border: "none",
          } as CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap px-12 py-3 w-full rounded-full text-white font-bold text-lg transition-transform duration-300 ease-in-out active:translate-y-px",
          "transform-gpu",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 overflow-hidden -z-10 rounded-full">
          <div className="absolute -inset-full w-1/3 bg-white opacity-20 blur-xl animate-shimmer-slide" />
        </div>

        {/* Button Text */}
        <span className="relative z-10">{children}</span>

        {/* Highlight layer */}
        <div className="absolute inset-0 rounded-full shadow-[inset_0_-8px_10px_#ffffff1f]
                        transform-gpu transition-all duration-300 ease-in-out
                        group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]
                        group-active:shadow-[inset_0_-10px_10px_#ffffff3f]" />
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";
