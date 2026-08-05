import { cn } from "@/lib/utils";
import darkLogo from "@/assets/logo/versolyn-dark-logo.png";
import lightLogo from "@/assets/logo/versolyn-light-logo.png";

interface VersoLynLogoProps {
  className?: string;
  alt?: string;
}

export function VersoLynLogo({ className, alt = "VersoLyn" }: VersoLynLogoProps) {
  return (
    <>
      <img
        src={darkLogo}
        alt={alt}
        decoding="async"
        className={cn("hidden dark:block object-contain h-full w-full select-none", className)}
      />
      <img
        src={lightLogo}
        alt={alt}
        decoding="async"
        className={cn("block dark:hidden object-contain h-full w-full select-none", className)}
      />
    </>
  );
}
