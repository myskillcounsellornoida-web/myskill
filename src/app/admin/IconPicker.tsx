"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

/** Curated Font Awesome 6 free solid icons that suit counselling/education cards. */
const ICON_CHOICES: { cls: string; label: string }[] = [
  { cls: "fas fa-user-graduate", label: "Profile building" },
  { cls: "fas fa-graduation-cap", label: "Graduation" },
  { cls: "fas fa-language", label: "IELTS / language" },
  { cls: "fas fa-pen-nib", label: "SOP / writing" },
  { cls: "fas fa-file-lines", label: "Documents" },
  { cls: "fas fa-file-contract", label: "Visa paperwork" },
  { cls: "fas fa-passport", label: "Passport / visa" },
  { cls: "fas fa-plane-departure", label: "Departure" },
  { cls: "fas fa-earth-americas", label: "Study abroad" },
  { cls: "fas fa-comments", label: "Interview prep" },
  { cls: "fas fa-user-tie", label: "Mock interview" },
  { cls: "fas fa-briefcase", label: "Internship" },
  { cls: "fas fa-chess-king", label: "Leadership" },
  { cls: "fas fa-book-open", label: "Career library" },
  { cls: "fas fa-rocket", label: "Career boosters" },
  { cls: "fas fa-lightbulb", label: "Ideas / clarity" },
  { cls: "fas fa-compass", label: "Guidance" },
  { cls: "fas fa-route", label: "Roadmap" },
  { cls: "fas fa-bullseye", label: "Goals" },
  { cls: "fas fa-chart-line", label: "Progress" },
  { cls: "fas fa-handshake", label: "Support" },
  { cls: "fas fa-people-group", label: "Workshops" },
  { cls: "fas fa-seedling", label: "Growth" },
  { cls: "fas fa-award", label: "Scholarship" },
  { cls: "fas fa-building-columns", label: "University" },
  { cls: "fas fa-house-chimney", label: "Accommodation" },
  { cls: "fas fa-money-check-dollar", label: "Finance" },
  { cls: "fas fa-headset", label: "Counselling call" },
  { cls: "fas fa-calendar-check", label: "Booking" },
  { cls: "fas fa-clipboard-check", label: "Assessment" },
];

const LABEL_STYLE: React.CSSProperties = {
  display: "block",
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "var(--color-deep-teal)",
  marginBottom: "6px",
};

export default function IconPicker({ value, onChange }: { value: string; onChange: (cls: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ICON_CHOICES;
    return ICON_CHOICES.filter((i) => i.label.toLowerCase().includes(q) || i.cls.toLowerCase().includes(q));
  }, [query]);

  return (
    <div>
      <label style={LABEL_STYLE}>CARD ICON</label>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "8px 12px",
          borderRadius: "5px",
          border: "1px solid var(--border-color)",
          background: "#fff",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span
          style={{
            width: 34,
            height: 34,
            flexShrink: 0,
            display: "grid",
            placeItems: "center",
            borderRadius: 9,
            background: "var(--color-soft-teal)",
            color: "#fff",
          }}
        >
          <i className={value || "fas fa-graduation-cap"} />
        </span>
        <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value || "Choose an icon"}
        </span>
      </button>

      {open && (
        <div
          style={{
            marginTop: 8,
            border: "1px solid var(--border-color)",
            borderRadius: 8,
            background: "#fff",
            padding: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Search size={15} style={{ color: "var(--text-secondary)", flexShrink: 0 }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search icons…"
              style={{ flex: 1, padding: "6px 8px", borderRadius: 5, border: "1px solid var(--border-color)", outline: "none", fontSize: "0.85rem" }}
            />
            <button type="button" onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", display: "flex" }}>
              <X size={16} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(62px, 1fr))", gap: 8, maxHeight: 210, overflowY: "auto" }}>
            {results.map((icon) => {
              const active = icon.cls === value;
              return (
                <button
                  key={icon.cls}
                  type="button"
                  title={icon.label}
                  onClick={() => {
                    onChange(icon.cls);
                    setOpen(false);
                  }}
                  style={{
                    aspectRatio: "1",
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: "1.05rem",
                    border: active ? "2px solid var(--color-soft-teal)" : "1px solid var(--border-color)",
                    background: active ? "var(--color-soft-teal)" : "#fff",
                    color: active ? "#fff" : "var(--color-deep-teal)",
                  }}
                >
                  <i className={icon.cls} />
                </button>
              );
            })}
          </div>

          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Or type a class, e.g. fas fa-passport"
            style={{ width: "100%", marginTop: 10, padding: "7px 10px", borderRadius: 5, border: "1px solid var(--border-color)", outline: "none", fontSize: "0.8rem" }}
          />
        </div>
      )}
    </div>
  );
}
