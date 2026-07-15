import { useRef, useState } from "react";
import { Upload, Trash2, Image as LogoIcon } from "lucide-react";
import { useLogo, type LogoPosition } from "@/stores/logo.store";
import { cn } from "@/lib/utils";
import { Field, Row, NumberInput, Toggle, SectionNote } from "./shared";

const POSITIONS: { id: LogoPosition; label: string }[] = [
  { id: "top-left", label: "TL" },
  { id: "top-right", label: "TR" },
  { id: "bottom-left", label: "BL" },
  { id: "bottom-right", label: "BR" },
  { id: "custom", label: "Custom" },
];

export function LogoSection() {
  const enabled = useLogo((s) => s.enabled);
  const current = useLogo((s) => s.current);
  const gallery = useLogo((s) => s.gallery);
  const settings = useLogo((s) => s.settings);
  const setEnabled = useLogo((s) => s.setEnabled);
  const addFromFile = useLogo((s) => s.addFromFile);
  const selectFromGallery = useLogo((s) => s.selectFromGallery);
  const removeFromGallery = useLogo((s) => s.removeFromGallery);
  const patch = useLogo((s) => s.patch);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2.5">
      {/* Enable toggle */}
      <div className="flex items-center gap-2">
        <label className="flex cursor-pointer items-center gap-2 text-[11px] font-medium">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          {enabled ? "Logo Enabled" : "Logo Disabled"}
        </label>
        <span className="text-[10px] text-muted-foreground">{gallery.length}/5 logos</span>
      </div>

      {enabled && (
        <>
          {/* Upload */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void addFromFile(f);
              e.currentTarget.value = "";
            }}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="inline-flex h-8 w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-dashed border-border bg-background px-2 text-[11px] transition hover:bg-accent"
          >
            <Upload className="h-3.5 w-3.5" /> Upload Logo
          </button>

          {/* Gallery */}
          {gallery.length > 0 && (
            <div>
              <div className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground/80">
                Gallery
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {gallery.map((g) => (
                  <div
                    key={g.id}
                    className={cn(
                      "group relative aspect-square overflow-hidden rounded-md border bg-background transition",
                      current?.id === g.id
                        ? "border-primary ring-1 ring-primary/40"
                        : "border-border",
                    )}
                  >
                    <button
                      onClick={() => selectFromGallery(g.id)}
                      className="absolute inset-0 cursor-pointer"
                      title={g.name}
                    >
                      <img
                        src={g.dataUrl}
                        alt=""
                        className="h-full w-full object-contain"
                        draggable={false}
                      />
                    </button>
                    <button
                      onClick={() => removeFromGallery(g.id)}
                      className="absolute right-0.5 top-0.5 hidden h-4 w-4 cursor-pointer items-center justify-center rounded bg-black/60 text-white group-hover:flex"
                      title="Remove"
                    >
                      <Trash2 className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings */}
          <Row>
            <Field label="Width %">
              <NumberInput
                value={settings.widthPct}
                step={1}
                min={2}
                max={80}
                suffix="%"
                onChange={(v) => patch({ widthPct: v })}
              />
            </Field>
            <Field label="Opacity">
              <NumberInput
                value={Math.round(settings.opacity * 100)}
                step={1}
                min={0}
                max={100}
                suffix="%"
                onChange={(v) => patch({ opacity: v / 100 })}
              />
            </Field>
          </Row>
          <Row>
            <Field label="Radius">
              <NumberInput
                value={settings.radius}
                step={1}
                min={0}
                max={200}
                suffix="px"
                onChange={(v) => patch({ radius: v })}
              />
            </Field>
            <Field label="Shadow">
              <Toggle
                label={settings.shadow ? "On" : "Off"}
                active={settings.shadow}
                onClick={() => patch({ shadow: !settings.shadow })}
              />
            </Field>
          </Row>
          <div>
            <div className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground/80">
              Position
            </div>
            <div className="flex flex-wrap gap-1">
              {POSITIONS.map((p) => (
                <Toggle
                  key={p.id}
                  label={p.label}
                  active={settings.position === p.id}
                  onClick={() => patch({ position: p.id })}
                />
              ))}
            </div>
          </div>
          {settings.position === "custom" && (
            <Row>
              <Field label="X %">
                <NumberInput
                  value={settings.xPct}
                  step={1}
                  min={0}
                  max={100}
                  suffix="%"
                  onChange={(v) => patch({ xPct: v })}
                />
              </Field>
              <Field label="Y %">
                <NumberInput
                  value={settings.yPct}
                  step={1}
                  min={0}
                  max={100}
                  suffix="%"
                  onChange={(v) => patch({ yPct: v })}
                />
              </Field>
            </Row>
          )}
        </>
      )}

      {!enabled && (
        <SectionNote>
          Logo is disabled. Toggle the switch above to configure and project it.
        </SectionNote>
      )}
    </div>
  );
}
