import { cn } from "@/lib/utils";

interface VersoLynLogoProps {
  className?: string;
  alt?: string;
}

export function VersoLynLogo({ className, alt = "VersoLyn" }: VersoLynLogoProps) {
  return (
    <>
      <img
        src="/new-logo/versolyn-dark-logo.png"
        alt={alt}
        className={cn("hidden dark:block object-contain", className)}
      />
      <img
        src="/new-logo/versolyn-light-logo.png"
        alt={alt}
        className={cn("block dark:hidden object-contain", className)}
      />
    </>
  );
}
