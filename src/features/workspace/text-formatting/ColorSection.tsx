import { Palette } from "lucide-react";
import { useTextFormat, type StyleGroup } from "@/lib/text-format/store";
import { Field, Row, ColorInput } from "./shared";

interface Props {
  active: StyleGroup;
}

export function ColorSection({ active }: Props) {
  const groups = useTextFormat((s) => s.groups);
  const setField = useTextFormat((s) => s.setField);
  const style = groups[active];

  return (
    <div className="space-y-2.5">
      <Field label="Text Color">
        <ColorInput
          value={style.color}
          onChange={(v) => setField(active, "color", v)}
        />
      </Field>

      <Row>
        <Field label="BG Tint Color">
          <ColorInput
            value={style.background}
            onChange={(v) => setField(active, "background", v)}
          />
        </Field>
        <Field label="BG Tint Opacity">
          <div className="flex h-7 items-center gap-1 rounded-md border border-border bg-background px-2 text-xs">
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(style.bgOpacity * 100)}
              onChange={(e) => setField(active, "bgOpacity", Number(e.target.value) / 100)}
              className="flex-1 accent-primary"
            />
            <span className="w-6 text-right text-[10px] text-muted-foreground">
              {Math.round(style.bgOpacity * 100)}%
            </span>
          </div>
        </Field>
      </Row>

      {style.background && style.background !== "#000000" && (
        <div className="flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-2.5 py-1.5">
          <span
            className="inline-block h-4 w-8 rounded border border-border"
            style={{ background: style.background, opacity: style.bgOpacity }}
          />
          <span className="text-[10px] text-muted-foreground">Background tint active</span>
        </div>
      )}
    </div>
  );
}
