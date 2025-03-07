import { cn } from "@/lib/utils";

export const DotPattern = ({ className, ...props }) => {
  return (
    <svg
      className={cn("absolute inset-0 -z-10 h-full w-full stroke-gray-500/20", className)}
      {...props}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="dot-pattern"
          width="40"
          height="40"
          x="50%"
          y="-1"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M.5 200V.5H200"
            fill="none"
            strokeOpacity="0.1"
            strokeDasharray="4 2"
          />
          <circle cx="3" cy="3" r="2" className="fill-muted-foreground/20" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth="0" fill="url(#dot-pattern)" />
    </svg>
  );
};