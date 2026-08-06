import { useState } from "react";
import { cn } from "@/lib/utils";
import darkLogo from "@/assets/logo/versolyn-dark-logo.png";
import lightLogo from "@/assets/logo/versolyn-light-logo.png";

interface VersoLynLogoProps {
  className?: string;
  alt?: string;
}

export function VersoLynLogo({ className, alt = "VersoLyn" }: VersoLynLogoProps) {
  const [darkSrc, setDarkSrc] = useState<string>(darkLogo);
  const [lightSrc, setLightSrc] = useState<string>(lightLogo);

  return (
    <>
      <img
        src={darkSrc}
        onError={() => {
          if (darkSrc !== "/versolyn-logo-dark.png") {
            setDarkSrc("/versolyn-logo-dark.png");
          }
        }}
        alt={alt}
        decoding="async"
        className={cn("hidden dark:block object-contain h-full w-full select-none", className)}
      />
      <img
        src={lightSrc}
        onError={() => {
          if (lightSrc !== "/versolyn-logo-light.png") {
            setLightSrc("/versolyn-logo-light.png");
          }
        }}
        alt={alt}
        decoding="async"
        className={cn("block dark:hidden object-contain h-full w-full select-none", className)}
      />
    </>
  );
}
