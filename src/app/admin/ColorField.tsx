"use client";

import { useState } from "react";
import { THEME_FIELDS } from "@/lib/siteContent";

const EXTRA = ["#FFFFFF", "#1C1C1C", "#F0C987", "#2563EB", "#16A34A"];
const PALETTE = [...THEME_FIELDS.map((f) => f.default), ...EXTRA];

/** Small swatch row + custom picker, used by the section builder. */
export default function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="cs-color">
      <button type="button" className="cs-color-head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="cs-color-dot" style={value ? { background: value } : undefined}>{!value && <i className="fas fa-font" />}</span>
        <span>{label}</span>
        <small>{value || "Auto"}</small>
      </button>
      {open && (
        <div className="cms-color-picker">
          <button type="button" className={`cms-swatch is-auto ${!value ? "is-selected" : ""}`} onClick={() => onChange("")}>Auto</button>
          {PALETTE.map((c, i) => (
            <button
              key={`${c}-${i}`}
              type="button"
              className={`cms-swatch ${value.toUpperCase() === c.toUpperCase() ? "is-selected" : ""}`}
              style={{ background: c }}
              title={c}
              aria-label={`Use ${c}`}
              onClick={() => onChange(c.toUpperCase())}
            />
          ))}
          <label className="cms-swatch is-custom" title="Custom colour">
            <i className="fas fa-eye-dropper" />
            <input type="color" value={value.length === 7 ? value : "#1C2B2D"} onChange={(e) => onChange(e.target.value.toUpperCase())} />
          </label>
        </div>
      )}
    </div>
  );
}
