import { Sparkles, Sun, Droplets, RectangleHorizontal } from "lucide-react";
import { useTextFormat, type StyleGroup } from "@/lib/text-format/store";
import { useBackground } from "@/stores/background.store";
import { cn } from "@/lib/utils";
import { Field, Row, NumberInput, ColorInput, Toggle, SwitchRow } from "./shared";

interface Props {
  active: StyleGroup;
}

export function EffectsSection({ active }: Props) {
  const groups = useTextFormat((s) => s.groups);
  const setField = useTextFormat((s) => s.setField);
  const bg = useBackground();
  const style = groups[active];

  return (
    <div className="space-y-3">
      {/* Shadow */}
      <div className="rounded-md border border-border bg-background/40 p-2.5">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[11px] font-semibold">Text Shadow</span>
          <label className="ml-auto flex cursor-pointer items-center gap-1.5 text-[10px]">
            <input
              type="checkbox"
              checked={style.shadow}
              onChange={() => setField(active, "shadow", !style.shadow)}
              className="accent-primary"
            />
            {style.shadow ? "On" : "Off"}
          </label>
        </div>
        {style.shadow && (
          <div className="space-y-2">
            <Row>
              <Field label="Blur">
                <NumberInput
                  value={style.shadowBlur}
                  step={1}
                  min={0}
                  max={80}
                  suffix="px"
                  onChange={(v) => setField(active, "shadowBlur", v)}
                />
              </Field>
              <Field label="Color">
                <ColorInput
                  value={style.shadowColor}
                  onChange={(v) => setField(active, "shadowColor", v)}
                />
              </Field>
            </Row>
          </div>
        )}
      </div>

      {/* Outline */}
      <div className="rounded-md border border-border bg-background/40 p-2.5">
        <div className="mb-2 flex items-center gap-2">
          <Sun className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[11px] font-semibold">Outline / Stroke</span>
          <span className="ml-auto text-[10px] text-muted-foreground">
            {style.outlineWidth > 0 ? `${style.outlineWidth}px` : "Off"}
          </span>
        </div>
        <Row>
          <Field label="Width">
            <NumberInput
              value={style.outlineWidth}
              step={0.5}
              min={0}
              max={10}
              suffix="px"
              onChange={(v) => setField(active, "outlineWidth", v)}
            />
          </Field>
          <Field label="Color">
            <ColorInput
              value={style.outlineColor}
              onChange={(v) => setField(active, "outlineColor", v)}
            />
          </Field>
        </Row>
      </div>

      {/* Master toggles from background store */}
      <div className="rounded-md border border-border bg-background/40 p-2.5">
        <div className="mb-2 text-[11px] font-semibold text-muted-foreground">
          Global Effect Toggles
        </div>
        <div className="grid grid-cols-2 gap-2">
          <SwitchRow
            label="Text Shadow"
            checked={bg.textShadowEnabled}
            onChange={(v) => bg.set("textShadowEnabled", v)}
          />
          <SwitchRow
            label="Text Stroke"
            checked={bg.textStrokeEnabled}
            onChange={(v) => bg.set("textStrokeEnabled", v)}
          />
          <SwitchRow
            label="Motion Effects"
            checked={bg.motionEnabled}
            onChange={(v) => bg.set("motionEnabled", v)}
          />
          <SwitchRow
            label="Particles"
            checked={bg.particlesEnabled}
            disabled={!bg.motionEnabled}
            onChange={(v) => bg.set("particlesEnabled", v)}
          />
        </div>
      </div>
    </div>
  );
}
