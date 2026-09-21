"use client";

import React, { useMemo, useState } from "react";
import { bookSession } from "@/app/actions";
import { useCms } from "@/components/cms/CmsProvider";
import { BOOKING_SERVICE_COUNT } from "@/lib/siteContent";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

export default function BookingModal({ isOpen, onClose, initialService }: BookingModalProps) {
  const { t } = useCms();

  // Every label, session type and time slot below is editable under
  // Admin → Edit Website → Contact → "Book a Session Form".
  const services = useMemo(
    () =>
      Array.from({ length: BOOKING_SERVICE_COUNT }, (_, i) => ({
        title: t(`booking_service${i + 1}_title`),
        desc: t(`booking_service${i + 1}_desc`),
        duration: t(`booking_service${i + 1}_duration`),
      })).filter((s) => s.title.trim()),
    [t]
  );
  const timeSlots = useMemo(
    () => t("booking_slots").split("\n").map((s) => s.trim()).filter(Boolean),
    [t]
  );

  const [step, setStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<string>(initialService || services[0]?.title || "");
  // Default to tomorrow; the modal only renders client-side after a click.
  const [selectedDate, setSelectedDate] = useState<string>(
    () => new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>(timeSlots[0] ?? "");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ success: boolean; text: string } | null>(null);

  if (!isOpen) return null;

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("service", selectedService);
    formData.append("bookingDate", selectedDate);
    formData.append("bookingTime", selectedTime);
    formData.append("notes", notes);

    const res = await bookSession(formData);
    setIsSubmitting(false);

    if (res.success) {
      setStep(4); // Success step
    } else {
      setStatusMsg({ success: false, text: res.message });
    }
  };

  const resetForm = () => {
    setStep(1);
    setStatusMsg(null);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(10, 25, 47, 0.75)",
        backdropFilter: "blur(6px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "15px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "650px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)",
          position: "relative",
          padding: "30px",
          color: "#1e293b",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "#f1f5f9",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            fontSize: "18px",
            cursor: "pointer",
            color: "#64748b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 700, margin: "0", color: "#0f172a" }}>
            {t("booking_title")}
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#64748b", margin: "4px 0 0 0" }}>
            {t("booking_subtitle")}
          </p>
        </div>

        {/* Progress Bar */}
        {step < 4 && (
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: "5px",
                  borderRadius: "3px",
                  backgroundColor: step >= s ? "var(--color-primary-teal, #0f4c81)" : "#e2e8f0",
                  transition: "all 0.3s",
                }}
              />
            ))}
          </div>
        )}

        {/* STEP 1: SELECT SERVICE */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "15px", color: "#334155" }}>{t("booking_step1_title")}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "25px" }}>
              {services.map((srv) => (
                <div
                  key={srv.title}
                  onClick={() => setSelectedService(srv.title)}
                  style={{
                    padding: "16px",
                    borderRadius: "10px",
                    border: selectedService === srv.title ? "2px solid var(--color-primary-teal, #0f4c81)" : "1px solid #e2e8f0",
                    backgroundColor: selectedService === srv.title ? "#f0f7ff" : "#fff",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h4 style={{ margin: "0 0 4px 0", fontSize: "1rem", color: "#0f172a" }}>{srv.title}</h4>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>{srv.desc}</p>
                  </div>
                  <span style={{ fontSize: "0.75rem", background: "rgba(15, 76, 129, 0.1)", color: "#0f4c81", padding: "4px 10px", borderRadius: "12px", fontWeight: "600" }}>
                    {srv.duration}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "var(--color-primary-teal, #0f4c81)",
                color: "#FFF",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              {t("booking_next1")} →
            </button>
          </div>
        )}

        {/* STEP 2: SELECT DATE & TIME */}
        {step === 2 && (
          <div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "15px", color: "#334155" }}>{t("booking_step2_title")}</h3>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", marginBottom: "6px" }}>{t("booking_date_label")}</label>
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "1rem",
                }}
              />
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", marginBottom: "10px" }}>{t("booking_slot_label")}</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      border: selectedTime === slot ? "2px solid #0f4c81" : "1px solid #cbd5e1",
                      backgroundColor: selectedTime === slot ? "#0f4c81" : "#f8fafc",
                      color: selectedTime === slot ? "#FFF" : "#334155",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: "#f1f5f9",
                  color: "#475569",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                ← {t("booking_back")}
              </button>
              <button
                onClick={() => setStep(3)}
                style={{
                  flex: 2,
                  padding: "12px",
                  backgroundColor: "var(--color-primary-teal, #0f4c81)",
                  color: "#FFF",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {t("booking_next2")} →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONTACT DETAILS FORM */}
        {step === 3 && (
          <form onSubmit={handleBookSubmit}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "15px", color: "#334155" }}>{t("booking_step3_title")}</h3>

            {statusMsg && (
              <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "#fee2e2", color: "#b91c1c", marginBottom: "15px", fontSize: "0.9rem" }}>
                {statusMsg.text}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "25px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "4px" }}>{t("booking_name_label")}</label>
                <input
                  type="text"
                  required
                  placeholder={t("booking_name_placeholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.95rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "4px" }}>{t("booking_email_label")}</label>
                <input
                  type="email"
                  required
                  placeholder={t("booking_email_placeholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.95rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "4px" }}>{t("booking_phone_label")}</label>
                <input
                  type="tel"
                  required
                  placeholder={t("booking_phone_placeholder")}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.95rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "4px" }}>{t("booking_notes_label")}</label>
                <textarea
                  rows={2}
                  placeholder={t("booking_notes_placeholder")}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.95rem" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: "#f1f5f9",
                  color: "#475569",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                ← {t("booking_back")}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  flex: 2,
                  padding: "12px",
                  backgroundColor: "var(--color-primary-teal, #0f4c81)",
                  color: "#FFF",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  cursor: "pointer",
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                {isSubmitting ? t("booking_submitting") : `${t("booking_submit")} ✓`}
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION */}
        {step === 4 && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: "50px", marginBottom: "15px" }}>🎉</div>
            <h3 style={{ fontSize: "1.5rem", color: "#0f172a", marginBottom: "8px" }}>{t("booking_success_title")}</h3>
            <p style={{ color: "#475569", lineHeight: "1.6", marginBottom: "20px" }}>
              {t("booking_success_desc")}
            </p>

            <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "25px", textAlign: "left" }}>
              <p style={{ margin: "4px 0" }}><strong>Confirmation sent to:</strong> {email}</p>
              <p style={{ margin: "4px 0" }}><strong>Service:</strong> {selectedService}</p>
              <p style={{ margin: "4px 0" }}><strong>Date:</strong> {selectedDate}</p>
              <p style={{ margin: "4px 0" }}><strong>Time Slot:</strong> {selectedTime}</p>
              <p style={{ margin: "4px 0" }}><strong>Candidate:</strong> {name}</p>
            </div>

            <button
              onClick={resetForm}
              style={{
                padding: "12px 30px",
                backgroundColor: "#0f4c81",
                color: "#FFF",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {t("booking_done")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
