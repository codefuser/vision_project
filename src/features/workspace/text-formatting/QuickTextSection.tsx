import { useTextFormat, type StyleGroup } from "@/lib/text-format/store";
import { useWorkspace } from "../workspace.store";
import { Toggle, Field, Row, NumberInput, Select, ColorInput } from "./shared";

const FONT_FAMILIES = [
  "Inter",
  "Roboto",
  "Georgia",
  "Times New Roman",
  "Arial",
  "Verdana",
  "Tahoma",
  "Latha",
  "Nirmala UI",
  "Vijaya",
  "Akshar Unicode",
  "Noto Sans Tamil",
  "Noto Serif Tamil",
  "Noto Sans Tamil UI",
  "Mukta Malar",
  "Catamaran",
  "Hind Madurai",
  "Meera Inimai",
  "Pavanam",
  "Arima Madurai",
  "Anek Tamil",
  "Kavivanar",
  "Pathway Gothic One",
  "Tiro Tamil",
  "Mukta",
  "Baloo Thambi 2",
  "Cousine",
];

const WEIGHTS = [
  { label: "Light 300", value: 300 },
  { label: "Regular 400", value: 400 },
  { label: "Medium 500", value: 500 },
  { label: "Semibold 600", value: 600 },
  { label: "Bold 700", value: 700 },
  { label: "Black 900", value: 900 },
];

interface Props {
  active: StyleGroup;
}

export function QuickTextSection({ active }: Props) {
  const groups = useTextFormat((s) => s.groups);
  const setField = useTextFormat((s) => s.setField);
  const style = groups[active];
  const activeTab = useWorkspace((s) => s.activeTab);
  const songsMode = activeTab === "songs";

  return (
    <div className="space-y-2.5">
      {/* Font family */}
      <Field label="Font Family">
        <Select
          value={style.fontFamily}
          onChange={(v) => setField(active, "fontFamily", v)}
          options={FONT_FAMILIES.map((f) => ({ label: f, value: f }))}
        />
      </Field>

      {/* Font size + weight */}
      <Row>
        <Field label="Size">
          <NumberInput
            value={style.fontSizeVw}
            step={0.2}
            min={0.5}
            suffix="vw"
            onChange={(v) => setField(active, "fontSizeVw", v)}
          />
        </Field>
        <Field label="Weight">
          <Select
            value={String(style.fontWeight)}
            onChange={(v) => setField(active, "fontWeight", Number(v))}
            options={WEIGHTS.map((w) => ({ label: w.label, value: String(w.value) }))}
          />
        </Field>
      </Row>

      {/* Style toggles */}
      <div>
        <div className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground/80">
          Style
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Toggle
            label="B"
            active={style.fontWeight >= 700}
            onClick={() => setField(active, "fontWeight", style.fontWeight >= 700 ? 500 : 700)}
            title="Bold"
          />
          <Toggle
            label="I"
            active={style.italic}
            onClick={() => setField(active, "italic", !style.italic)}
            title="Italic"
          />
          <Toggle
            label="U"
            active={style.underline}
            onClick={() => setField(active, "underline", !style.underline)}
            title="Underline"
          />
          <Toggle
            label="Aa"
            active={style.uppercase}
            onClick={() => setField(active, "uppercase", !style.uppercase)}
            title="Uppercase"
          />
          <Toggle
            label="sc"
            active={style.smallCaps}
            onClick={() => setField(active, "smallCaps", !style.smallCaps)}
            title="Small Caps"
          />
        </div>
      </div>

      {/* Spacing */}
      <Row>
        <Field label="Line Height">
          <NumberInput
            value={style.lineHeight}
            step={0.05}
            min={0.8}
            max={3}
            onChange={(v) => setField(active, "lineHeight", v)}
          />
        </Field>
        <Field label="Letter Spacing">
          <NumberInput
            value={style.letterSpacing}
            step={0.1}
            min={-5}
            max={20}
            suffix="px"
            onChange={(v) => setField(active, "letterSpacing", v)}
          />
        </Field>
      </Row>

      {/* Opacity */}
      <Row>
        <Field label="Text Opacity">
          <NumberInput
            value={Math.round(style.textOpacity * 100)}
            step={1}
            min={0}
            max={100}
            suffix="%"
            onChange={(v) => setField(active, "textOpacity", v / 100)}
          />
        </Field>
        <Field label="Margin (Safe)">
          <NumberInput
            value={style.paddingVw}
            step={0.5}
            min={0}
            max={30}
            suffix="%"
            onChange={(v) => setField(active, "paddingVw", v)}
          />
        </Field>
      </Row>
    </div>
  );
}
