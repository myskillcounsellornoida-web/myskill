"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, BellOff, Check, Download, Loader2, Mail, Send, X } from "lucide-react";
import { getPushStatus, pollActivity, removePushSubscription, savePushSubscription, sendTestEmail, sendTestPush } from "./pushActions";
import { updateSiteContent } from "./actions";
import { invalidEmails } from "@/lib/emails";

const SW_URL = "/admin-sw.js";
const POLL_MS = 20000;

/** VAPID keys travel as base64url; PushManager wants raw bytes. */
function urlBase64ToUint8Array(base64: string) {
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const raw = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

type Toast = { id: number; title: string; body: string };

const CARD: React.CSSProperties = {
  background: "#fff",
  border: "1px solid var(--border-color)",
  borderRadius: 10,
  padding: 20,
};

const BTN: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "9px 16px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  fontSize: "0.88rem",
  fontWeight: 600,
};

export default function NotificationCenter({ initialRecipients }: { initialRecipients: string }) {
  const [status, setStatus] = useState<{ configured: boolean; publicKey: string | null; devices: number } | null>(null);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<{ text: string; error?: boolean } | null>(null);

  const [recipients, setRecipients] = useState(initialRecipients);
  const [savingRecipients, setSavingRecipients] = useState(false);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [unseen, setUnseen] = useState(0);
  const since = useRef(new Date().toISOString());

  const supported = typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window;

  const refreshStatus = useCallback(async () => {
    const res = await getPushStatus();
    if (res.success) setStatus(res.data);
  }, []);

  useEffect(() => {
    if (!supported) {
      setPermission("unsupported");
      return;
    }
    setPermission(Notification.permission);
    refreshStatus();
    navigator.serviceWorker
      .register(SW_URL, { scope: "/admin" })
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setSubscribed(Boolean(sub)))
      .catch((e) => console.error("SW register failed", e));
  }, [supported, refreshStatus]);

  // Live activity poll — keeps the panel current without a manual refresh.
  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      const res = await pollActivity(since.current);
      if (cancelled || !res.success) return;
      const { inquiries, bookings, subscribers, now } = res.data;
      const total = inquiries + bookings + subscribers;
      if (total > 0) {
        const parts = [
          inquiries ? `${inquiries} enquiry${inquiries > 1 ? "s" : ""}` : "",
          bookings ? `${bookings} booking${bookings > 1 ? "s" : ""}` : "",
          subscribers ? `${subscribers} subscriber${subscribers > 1 ? "s" : ""}` : "",
        ].filter(Boolean);
        setUnseen((u) => u + total);
        setToasts((t) => [...t, { id: Date.now(), title: "New activity", body: parts.join(" · ") }]);
      }
      since.current = now;
    };
    const timer = setInterval(tick, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!toasts.length) return;
    const timer = setTimeout(() => setToasts((t) => t.slice(1)), 7000);
    return () => clearTimeout(timer);
  }, [toasts]);

  const enable = async () => {
    setBusy("enable");
    setNote(null);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") {
        setNote({ text: "Browser permission was not granted, so no alerts can be shown.", error: true });
        return;
      }

      const key = status?.publicKey;
      if (!key) {
        setNote({ text: "Push is not configured on the server (missing VAPID keys).", error: true });
        return;
      }

      const reg = await navigator.serviceWorker.register(SW_URL, { scope: "/admin" });
      await navigator.serviceWorker.ready;

      const existing = await reg.pushManager.getSubscription();
      const sub =
        existing ||
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(key),
        }));

      const json = sub.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } };
      const res = await savePushSubscription(json, navigator.userAgent.slice(0, 200));
      if (!res.success) {
        setNote({ text: res.error || "Could not register this device.", error: true });
        return;
      }

      setSubscribed(true);
      setNote({ text: "This device will now receive alerts, even when the panel is closed." });
      refreshStatus();
    } catch (e) {
      console.error(e);
      setNote({ text: e instanceof Error ? e.message : "Could not enable notifications.", error: true });
    } finally {
      setBusy(null);
    }
  };

  const disable = async () => {
    setBusy("disable");
    setNote(null);
    try {
      const reg = await navigator.serviceWorker.getRegistration("/admin");
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await removePushSubscription(sub.endpoint);
        await sub.unsubscribe();
      }
      setSubscribed(false);
      setNote({ text: "This device will no longer receive alerts." });
      refreshStatus();
    } catch (e) {
      console.error(e);
      setNote({ text: "Could not turn notifications off.", error: true });
    } finally {
      setBusy(null);
    }
  };

  const testPush = async () => {
    setBusy("push");
    setNote(null);
    const res = await sendTestPush();
    setNote(
      res.success
        ? { text: `Test notification sent to ${res.data.sent} device(s).` }
        : { text: res.error || "No device received the notification.", error: true }
    );
    setBusy(null);
  };

  const testEmail = async () => {
    setBusy("email");
    setNote(null);
    const res = await sendTestEmail();
    setNote(
      res.success
        ? { text: `Test email sent to ${res.data.to.join(", ")}.` }
        : { text: res.error || "Could not send the test email.", error: true }
    );
    setBusy(null);
  };

  const saveRecipients = async () => {
    const bad = invalidEmails(recipients);
    if (bad.length) {
      setNote({ text: `These don't look like valid addresses: ${bad.join(", ")}`, error: true });
      return;
    }
    setSavingRecipients(true);
    const res = await updateSiteContent("admin_notify_emails", recipients.trim());
    setSavingRecipients(false);
    setNote(
      res.success ? { text: "Notification recipients saved." } : { text: res.error || "Could not save.", error: true }
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Live toasts */}
      <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10 }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              background: "var(--color-deep-teal)",
              color: "#fff",
              padding: "12px 16px",
              borderRadius: 8,
              boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
              minWidth: 240,
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <Bell size={16} style={{ marginTop: 2, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{t.title}</div>
              <div style={{ fontSize: "0.82rem", opacity: 0.9 }}>{t.body}</div>
            </div>
            <button
              onClick={() => setToasts((list) => list.filter((x) => x.id !== t.id))}
              style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex" }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <div style={CARD}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--color-deep-teal)" }}>Device alerts</h3>
            <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Get a pop-up the moment someone fills in a form — even when this tab is closed.
            </p>
          </div>
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              padding: "5px 11px",
              borderRadius: 20,
              background: subscribed ? "#dcfce7" : "#f1f5f9",
              color: subscribed ? "#166534" : "#475569",
            }}
          >
            {subscribed ? "ON for this device" : "OFF for this device"}
          </span>
        </div>

        {permission === "unsupported" && (
          <p style={{ marginTop: 14, fontSize: "0.85rem", color: "#b45309" }}>
            This browser doesn&apos;t support web push. Use Chrome, Edge or Android Chrome.
          </p>
        )}

        {permission === "denied" && (
          <p style={{ marginTop: 14, fontSize: "0.85rem", color: "#b91c1c" }}>
            Notifications are blocked for this site. Allow them in the browser&apos;s site settings (padlock icon → Notifications), then reload.
          </p>
        )}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
          {!subscribed ? (
            <button
              onClick={enable}
              disabled={busy !== null || permission === "unsupported" || !status?.configured}
              style={{ ...BTN, background: "var(--color-deep-teal)", color: "#fff", opacity: busy ? 0.7 : 1 }}
            >
              {busy === "enable" ? <Loader2 size={15} className="spin" /> : <Bell size={15} />}
              Turn on notifications
            </button>
          ) : (
            <button
              onClick={disable}
              disabled={busy !== null}
              style={{ ...BTN, background: "#f1f5f9", color: "#334155" }}
            >
              {busy === "disable" ? <Loader2 size={15} className="spin" /> : <BellOff size={15} />}
              Turn off on this device
            </button>
          )}

          <button
            onClick={testPush}
            disabled={busy !== null || !status?.devices}
            style={{ ...BTN, background: "#f1f5f9", color: "#334155" }}
          >
            {busy === "push" ? <Loader2 size={15} className="spin" /> : <Send size={15} />}
            Send test alert
          </button>

          <button onClick={testEmail} disabled={busy !== null} style={{ ...BTN, background: "#f1f5f9", color: "#334155" }}>
            {busy === "email" ? <Loader2 size={15} className="spin" /> : <Mail size={15} />}
            Send test email
          </button>
        </div>

        {status && (
          <p style={{ marginTop: 12, fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            {status.configured
              ? `${status.devices} device${status.devices === 1 ? "" : "s"} currently registered.`
              : "Push is not configured on the server — set VAPID keys in the environment."}
            {unseen > 0 && ` · ${unseen} new since you opened this page.`}
          </p>
        )}

        {note && (
          <p
            style={{
              marginTop: 10,
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: note.error ? "#b91c1c" : "#166534",
            }}
          >
            {note.error ? <X size={14} /> : <Check size={14} />}
            {note.text}
          </p>
        )}
      </div>

      <div style={CARD}>
        <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--color-deep-teal)" }}>Email recipients</h3>
        <p style={{ margin: "4px 0 12px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          Who gets an email for every new lead, booking and subscriber. Separate multiple addresses with commas.
        </p>
        <textarea
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
          rows={2}
          placeholder="ria.myskillcounsellor@gmail.com, team@myskillcounsellor.com"
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: 5,
            border: "1px solid var(--border-color)",
            outline: "none",
            fontSize: "0.9rem",
            fontFamily: "inherit",
          }}
        />
        <button
          onClick={saveRecipients}
          disabled={savingRecipients}
          style={{ ...BTN, background: "var(--color-deep-teal)", color: "#fff", marginTop: 12 }}
        >
          {savingRecipients ? <Loader2 size={15} className="spin" /> : <Check size={15} />}
          Save recipients
        </button>
      </div>

      <div style={CARD}>
        <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--color-deep-teal)", display: "flex", alignItems: "center", gap: 8 }}>
          <Download size={17} /> Install as an app
        </h3>
        <p style={{ margin: "8px 0 0", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          In Chrome on desktop, open the menu (⋮) → <strong>Cast, save and share</strong> → <strong>Install page as app</strong>.
          On Android Chrome, menu (⋮) → <strong>Add to Home screen</strong>. The panel then opens in its own window and keeps
          delivering alerts in the background.
        </p>
      </div>
    </div>
  );
}
