import { useTextFormat, type StyleGroup } from "@/lib/text-format/store";
import { Field, Row, NumberInput, ColorInput, Toggle } from "./shared";

interface Props {
  active: StyleGroup;
}

export function AdvancedSection({ active }: Props) {
  const groups = useTextFormat((s) => s.groups);
  const setField = useTextFormat((s) => s.setField);
  const style = groups[active];

  return (
    <div className="space-y-2.5">
      <Row>
        <Field label="Drop Shadow">
          <Toggle label={style.shadow ? "On" : "Off"} active={style.shadow}
            onClick={() => setField(active, "shadow", !style.shadow)} />
        </Field>
        <Field label="Outline">
          <Toggle label={style.outlineWidth > 0 ? `${style.outlineWidth}px` : "Off"}
            active={style.outlineWidth > 0}
            onClick={() => setField(active, "outlineWidth", style.outlineWidth > 0 ? 0 : 2)} />
        </Field>
      </Row>

      <Row>
        <Field label="Shadow Blur">
          <NumberInput value={style.shadowBlur} step={1} min={0} max={80} suffix="px"
            onChange={(v) => setField(active, "shadowBlur", v)} />
        </Field>
        <Field label="Shadow Color">
          <ColorInput value={style.shadowColor}
            onChange={(v) => setField(active, "shadowColor", v)} />
        </Field>
      </Row>

      <Row>
        <Field label="Outline Width">
          <NumberInput value={style.outlineWidth} step={0.5} min={0} max={10} suffix="px"
            onChange={(v) => setField(active, "outlineWidth", v)} />
        </Field>
        <Field label="Outline Color">
          <ColorInput value={style.outlineColor}
            onChange={(v) => setField(active, "outlineColor", v)} />
        </Field>
      </Row>

      <Row>
        <Field label="Italic">
          <Toggle label={style.italic ? "On" : "Off"} active={style.italic}
            onClick={() => setField(active, "italic", !style.italic)} />
        </Field>
        <Field label="Underline">
          <Toggle label={style.underline ? "On" : "Off"} active={style.underline}
            onClick={() => setField(active, "underline", !style.underline)} />
        </Field>
      </Row>

      <Row>
        <Field label="Uppercase">
          <Toggle label={style.uppercase ? "On" : "Off"} active={style.uppercase}
            onClick={() => setField(active, "uppercase", !style.uppercase)} />
        </Field>
        <Field label="Small Caps">
          <Toggle label={style.smallCaps ? "On" : "Off"} active={style.smallCaps}
            onClick={() => setField(active, "smallCaps", !style.smallCaps)} />
        </Field>
      </Row>
    </div>
  );
}
