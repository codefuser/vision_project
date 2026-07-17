import type { BackgroundAnimation } from "@/lib/broadcast";

export function ThemeAnimation({
  animation: _animation,
}: {
  animation: BackgroundAnimation;
  paused?: boolean;
}) {
  return null;
}

export function getAnimationLabel(_animation: BackgroundAnimation): string {
  return "";
}
