import { cn } from "@/lib/utils";
import darkLogo from "../../../new-logo/versolyn-dark-logo.png";
import lightLogo from "../../../new-logo/versolyn-light-logo.png";

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
        className={cn("hidden dark:block object-contain", className)}
      />
      <img
        src={lightLogo}
        alt={alt}
        className={cn("block dark:hidden object-contain", className)}
      />
    </>
  );
}
