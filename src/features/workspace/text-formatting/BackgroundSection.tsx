import { useEffect, useState } from "react";
import { ImageIcon, X } from "lucide-react";
import { useTextFormat } from "@/lib/text-format/store";
import { useBackgroundGallery, type BackgroundItem } from "@/stores/background-gallery.store";
import { getMedia } from "@/db/repo";
import { db } from "@/db/schema";
import { acquireUrl, releaseUrl } from "@/lib/blob-url";
import { MediaPickerDialog } from "@/features/playlists/MediaPickerDialog";
import { cn } from "@/lib/utils";
import { Field, Row, NumberInput, ColorInput, Toggle, SwitchRow, SectionNote } from "./shared";

export function BackgroundSection() {
  const groups = useTextFormat((s) => s.groups);
  const setBackground = useTextFormat((s) => s.setBackground);
  const items = useBackgroundGallery((s) => s.items);
  const addColor = useBackgroundGallery((s) => s.addColor);
  const addMedia = useBackgroundGallery((s) => s.addMedia);
  const remove = useBackgroundGallery((s) => s.remove);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [bgName, setBgName] = useState<string | null>(null);
  const bg = groups.background;

  return (
    <div className="space-y-2.5">
      {/* Kind selector */}
      <div className="flex gap-1 rounded-md border border-border bg-background p-0.5">
        {(["none", "color", "media"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setBackground({ kind: k })}
            className={cn(
              "flex-1 cursor-pointer rounded px-2 py-1 text-[11px] font-medium transition",
              bg.kind === k
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            {k === "none" ? "None" : k === "color" ? "Solid Color" : "Media"}
          </button>
        ))}
      </div>

      {/* Color mode */}
      {bg.kind === "color" && (
        <div className="space-y-2 rounded-md border border-border bg-background/40 p-2.5">
          <Field label="Background Color">
            <ColorInput value={bg.color} onChange={(v) => setBackground({ color: v })} />
          </Field>
          <Row>
            <Field label="Opacity">
              <NumberInput
                value={Math.round((bg.opacity ?? 1) * 100)}
                step={1} min={0} max={100} suffix="%"
                onChange={(v) => setBackground({ opacity: v / 100 })}
              />
            </Field>
            <Field label="Brightness">
              <NumberInput
                value={Math.round((bg.brightness ?? 1) * 100)}
                step={1} min={0} max={200} suffix="%"
                onChange={(v) => setBackground({ brightness: v / 100 })}
              />
            </Field>
          </Row>
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-8 flex-1 rounded-md border border-border"
              style={{ background: bg.gradient || bg.color }}
            />
            <div className="text-[10px] text-muted-foreground">
              {bg.gradient ? "Gradient" : "Solid"}
            </div>
          </div>
        </div>
      )}

      {/* Media mode */}
      {bg.kind === "media" && (
        <div className="space-y-2 rounded-md border border-border bg-background/40 p-2.5">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPickerOpen(true)}
              className="inline-flex h-8 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-border bg-background px-2 text-[11px] transition hover:bg-accent"
            >
              <ImageIcon className="h-3.5 w-3.5" />
              {bgName ?? (bg.mediaId ? "Change media" : "Select from library")}
            </button>
            {bg.mediaId && (
              <button
                onClick={() => { setBackground({ mediaId: null }); setBgName(null); }}
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition hover:bg-accent"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Fit */}
          <div>
            <div className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground/80">Fit</div>
            <div className="flex gap-1">
              {(["cover", "contain", "stretch"] as const).map((f) => (
                <Toggle key={f} label={f[0].toUpperCase() + f.slice(1)}
                  active={bg.fit === f}
                  onClick={() => setBackground({ fit: f })} />
              ))}
            </div>
          </div>

          {/* Visual adjustments */}
          <div className="grid grid-cols-2 gap-2">
            <Field label="Opacity">
              <NumberInput value={Math.round((bg.opacity ?? 1) * 100)} step={1} min={0} max={100} suffix="%"
                onChange={(v) => setBackground({ opacity: v / 100 })} />
            </Field>
            <Field label="Brightness">
              <NumberInput value={Math.round((bg.brightness ?? 1) * 100)} step={1} min={0} max={200} suffix="%"
                onChange={(v) => setBackground({ brightness: v / 100 })} />
            </Field>
            <Field label="Blur">
              <NumberInput value={bg.blur ?? 0} step={1} min={0} max={60} suffix="px"
                onChange={(v) => setBackground({ blur: v })} />
            </Field>
            <Field label="Zoom">
              <NumberInput value={Math.round((bg.zoom ?? 1) * 100)} step={5} min={50} max={300} suffix="%"
                onChange={(v) => setBackground({ zoom: v / 100 })} />
            </Field>
            <Field label="Position X">
              <NumberInput value={bg.positionX ?? 50} step={1} min={0} max={100} suffix="%"
                onChange={(v) => setBackground({ positionX: v })} />
            </Field>
            <Field label="Position Y">
              <NumberInput value={bg.positionY ?? 50} step={1} min={0} max={100} suffix="%"
                onChange={(v) => setBackground({ positionY: v })} />
            </Field>
            <Field label="Contrast">
              <NumberInput value={Math.round((bg.contrast ?? 1) * 100)} step={1} min={0} max={200} suffix="%"
                onChange={(v) => setBackground({ contrast: v / 100 })} />
            </Field>
          </div>

          {/* Overlay tint */}
          <div className="border-t border-border/60 pt-2">
            <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground/80">Overlay Tint</div>
            <Row>
              <Field label="Color">
                <ColorInput value={bg.overlayColor ?? "#000000"}
                  onChange={(v) => setBackground({ overlayColor: v })} />
              </Field>
              <Field label="Opacity">
                <NumberInput value={Math.round((bg.overlayOpacity ?? 0) * 100)} step={1} min={0} max={100} suffix="%"
                  onChange={(v) => setBackground({ overlayOpacity: v / 100 })} />
              </Field>
            </Row>
          </div>

          {/* Video controls */}
          <div className="flex flex-wrap items-center gap-3 border-t border-border/60 pt-2">
            <SwitchRow label="Loop video"
              checked={bg.videoLoop ?? true}
              onChange={(v) => setBackground({ videoLoop: v })} />
            <SwitchRow label="Mute video"
              checked={bg.videoMuted ?? true}
              onChange={(v) => setBackground({ videoMuted: v })} />
            <div className="ml-auto flex items-center gap-1 text-[10px] text-muted-foreground">
              Speed
              <NumberInput value={bg.videoSpeed ?? 1} step={0.25} min={0.25} max={4} suffix="x"
                onChange={(v) => setBackground({ videoSpeed: v })} />
            </div>
          </div>
        </div>
      )}

      {/* None mode */}
      {bg.kind === "none" && (
        <SectionNote>
          No background. The projector stage will be transparent (black) behind text.
        </SectionNote>
      )}

      {/* Background gallery */}
      <BackgroundGallerySection
        items={items}
        onPick={() => setPickerOpen(true)}
        onSelect={(it) => {
          if (it.kind === "color") setBackground({ kind: "color", color: it.color! });
          else setBackground({ kind: "media", mediaId: it.mediaId! });
        }}
        onRemove={(id) => remove(id)}
        onAddColor={(c) => addColor(c)}
        currentColor={bg.color}
      />

      <MediaPickerDialog
        open={pickerOpen}
        onCancel={() => setPickerOpen(false)}
        onAdd={async (ids) => {
          const id = ids[0];
          if (!id) return;
          const m = await getMedia(id);
          setBackground({ mediaId: id, kind: "media" });
          setBgName(m?.name ?? null);
          addMedia(id, m?.name);
          setPickerOpen(false);
        }}
      />
    </div>
  );
}

function BackgroundGallerySection({
  items, onPick, onSelect, onRemove, onAddColor, currentColor,
}: {
  items: BackgroundItem[]; onPick: () => void; onSelect: (it: BackgroundItem) => void;
  onRemove: (id: string) => void; onAddColor: (c: string) => void; currentColor: string;
}) {
  if (items.length === 0) {
    return (
      <div className="flex items-center gap-1 pt-1">
        <button onClick={onPick}
          className="inline-flex h-7 flex-1 cursor-pointer items-center justify-center gap-1 rounded-md border border-dashed border-border bg-background px-2 text-[11px] transition hover:bg-accent">
          <ImageIcon className="h-3 w-3" /> Add background from library
        </button>
        <button onClick={() => onAddColor(currentColor)}
          className="inline-flex h-7 cursor-pointer items-center justify-center gap-1 rounded-md border border-dashed border-border bg-background px-2 text-[11px] transition hover:bg-accent">
          + Color
        </button>
      </div>
    );
  }
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        <span>Saved ({items.length})</span>
        <button onClick={onPick} className="cursor-pointer text-primary hover:underline">+ Add</button>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {items.map((it) => (
          <BackgroundThumb
            key={it.id}
            item={it}
            onSelect={() => onSelect(it)}
            onRemove={() => onRemove(it.id)}
          />
        ))}
      </div>
    </div>
  );
}

function BackgroundThumb({
  item, onSelect, onRemove,
}: {
  item: BackgroundItem; onSelect: () => void; onRemove: () => void;
}) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (item.kind !== "media" || !item.mediaId) return;
    let cancelled = false;
    let key: string | null = null;
    (async () => {
      const m = await getMedia(item.mediaId!);
      if (!m) return;
      const rec = await db().blobs.get(m.thumbBlobId ?? m.blobId);
      if (!rec || cancelled) return;
      key = (m.thumbBlobId ?? m.blobId);
      setUrl(acquireUrl(key, rec.blob));
    })();
    return () => { cancelled = true; if (key) releaseUrl(key); };
  }, [item]);
  return (
    <div className="group relative aspect-video overflow-hidden rounded-md border border-border bg-background">
      <button onClick={onSelect} className="absolute inset-0 cursor-pointer" title={item.name ?? item.color ?? ""}>
        {item.kind === "color" ? (
          <div className="h-full w-full" style={{ background: item.color }} />
        ) : url ? (
          <img src={url} alt="" className="h-full w-full object-cover" draggable={false} />
        ) : (
          <div className="flex h-full items-center justify-center text-[9px] text-muted-foreground">...</div>
        )}
      </button>
      <button onClick={onRemove}
        className="absolute right-0.5 top-0.5 hidden h-4 w-4 cursor-pointer items-center justify-center rounded bg-black/60 text-white group-hover:flex" title="Remove">
        <X className="h-2.5 w-2.5" />
      </button>
    </div>
  );
}
