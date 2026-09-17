"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { fetchContacts } from "./actions";
import { parseEmailList } from "@/lib/emails";

interface Contact {
  email: string;
  name: string;
  source: string;
}

/** Searchable list of every known contact; ticking one adds it to the recipient box. */
export default function RecipientPicker({
  selected,
  onAdd,
  onRemove,
  onClose,
}: {
  selected: string[];
  onAdd: (emails: string[]) => void;
  onRemove: (email: string) => void;
  onClose: () => void;
}) {
  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    fetchContacts().then((res) => {
      if (!active) return;
      if (res.success) setContacts(res.data);
      else setError(res.error || "Could not load contacts.");
    });
    return () => { active = false; };
  }, []);

  const selectedSet = useMemo(() => new Set(parseEmailList(selected)), [selected]);
  const q = query.trim().toLowerCase();
  const visible = (contacts ?? []).filter(
    (c) => !q || c.email.includes(q) || c.name.toLowerCase().includes(q) || c.source.toLowerCase().includes(q)
  );
  const unselectedVisible = visible.filter((c) => !selectedSet.has(c.email));

  return (
    <div className="picker">
      <div className="picker-head">
        <div className="picker-search">
          <Search size={15} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email or type…" aria-label="Search contacts" />
        </div>
        <button type="button" onClick={onClose} className="picker-close" aria-label="Close contact picker"><X size={16} /></button>
      </div>

      {error && <p className="picker-msg is-error">{error}</p>}
      {!contacts && !error && <p className="picker-msg">Loading contacts…</p>}
      {contacts && visible.length === 0 && <p className="picker-msg">No contacts match “{query}”.</p>}

      {contacts && visible.length > 0 && (
        <>
          <div className="picker-bulk">
            <span>{visible.length} shown · {selectedSet.size} selected</span>
            <button type="button" onClick={() => onAdd(unselectedVisible.map((c) => c.email))} disabled={unselectedVisible.length === 0}>
              Add all shown
            </button>
          </div>
          <ul className="picker-list">
            {visible.map((c) => {
              const isSelected = selectedSet.has(c.email);
              return (
                <li key={c.email}>
                  <label>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => (isSelected ? onRemove(c.email) : onAdd([c.email]))}
                    />
                    <span className="picker-name">{c.name || c.email}</span>
                    {c.name && <span className="picker-email">{c.email}</span>}
                    <span className="picker-source">{c.source}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
