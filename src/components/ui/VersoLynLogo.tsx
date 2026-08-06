import { cn } from "@/lib/utils";
import { DARK_LOGO_DATA_URI, LIGHT_LOGO_DATA_URI } from "@/components/ui/logo-data";

interface VersoLynLogoProps {
  className?: string;
  alt?: string;
}

export function VersoLynLogo({ className, alt = "VersoLyn" }: VersoLynLogoProps) {
  return (
    <>
      <img
        src={DARK_LOGO_DATA_URI}
        alt={alt}
        decoding="async"
        className={cn("hidden dark:block object-contain h-full w-full select-none", className)}
      />
      <img
        src={LIGHT_LOGO_DATA_URI}
        alt={alt}
        decoding="async"
        className={cn("block dark:hidden object-contain h-full w-full select-none", className)}
      />
    </>
  );
}
