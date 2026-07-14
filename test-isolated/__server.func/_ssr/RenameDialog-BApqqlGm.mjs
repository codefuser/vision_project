import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { k as Dialog, m as DialogContent, n as DialogHeader, o as DialogTitle, s as DialogFooter } from "./router-KP2FEINE.mjs";
function RenameDialog({
  open,
  initialName,
  title = "File",
  label,
  onCancel,
  onSubmit
}) {
  const [value, setValue] = reactExports.useState(initialName);
  const [error, setError] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(false);
  const inputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (open) {
      setValue(initialName);
      setError(null);
      setBusy(false);
      const t = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 30);
      return () => clearTimeout(t);
    }
  }, [open, initialName]);
  const handleSubmit = async (e) => {
    e?.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Name cannot be empty");
      return;
    }
    if (trimmed.length > 200) {
      setError("Name is too long");
      return;
    }
    if (trimmed === initialName) {
      onCancel();
      return;
    }
    try {
      setBusy(true);
      await onSubmit(trimmed);
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && !busy && onCancel(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
      "Rename ",
      title
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-3", children: [
      label && /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: inputRef,
          value,
          onChange: (e) => {
            setValue(e.target.value);
            if (error) setError(null);
          },
          className: "h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
          "aria-label": `${title} name`,
          "aria-invalid": !!error,
          disabled: busy
        }
      ),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-destructive", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 sm:gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onCancel,
            disabled: busy,
            className: "cursor-pointer rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "submit",
            disabled: busy,
            className: "cursor-pointer rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50",
            children: "Save"
          }
        )
      ] })
    ] })
  ] }) });
}
export {
  RenameDialog as R
};
