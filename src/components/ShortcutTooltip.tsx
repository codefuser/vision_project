/**
 * ShortcutTooltip — premium theme-aware Tooltip component that shows shortcut badges
 * alongside the action label. Delegates to the master unified <Tooltip /> component.
 */
import { Tooltip, type TooltipProps } from "@/components/ui/tooltip";

export interface ShortcutTooltipProps extends TooltipProps {}

export function ShortcutTooltip(props: ShortcutTooltipProps) {
  return <Tooltip {...props} />;
}

export { useShortcutTooltip } from "@/lib/shortcuts/use-shortcut-for";
export { Tooltip };
