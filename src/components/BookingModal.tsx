"use client";

import React, { useState } from "react";
import { bookSession } from "@/app/actions";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

const SERVICES = [
  { id: "study_abroad", title: "Global Study Abroad Counselling", desc: "End-to-end guidance for US, UK, Canada, Dubai & Europe", duration: "45 mins" },
  { id: "sop_essay", title: "SOP & Essay Strategy Review", desc: "Personalized feedback & story-building for applications", duration: "30 mins" },
  { id: "profile_building", title: "Extracurricular & Profile Building", desc: "Strategic roadmap for Class 9-12 & university applicants", duration: "45 mins" },
  { id: "visa_counselling", title: "Visa & Loan Guidance", desc: "Complete documentation and mock visa interview practice", duration: "30 mins" },
];

const TIME_SLOTS = [
  "10:00 AM",
  "11:30 AM",
  "02:00 PM",
  "03:30 PM",
  "05:00 PM",
  "06:30 PM",
];

export default function BookingModal({ isOpen, onClose, initialService }: BookingModalProps) {
  const [step, setStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<string>(initialService || SERVICES[0].title);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>(TIME_SLOTS[0]);
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
          <span style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "var(--color-primary-teal, #0f4c81)" }}>
            Calendly-Style Session Booking
          </span>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 700, margin: "5px 0 0 0", color: "#0f172a" }}>
            Book 1-on-1 Counselling Session
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#64748b", margin: "4px 0 0 0" }}>
            Schedule a personal consultation with Ria Jain & the team.
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
            <h3 style={{ fontSize: "1.1rem", marginBottom: "15px", color: "#334155" }}>Step 1: Select a Service</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "25px" }}>
              {SERVICES.map((srv) => (
                <div
                  key={srv.id}
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
              Next: Choose Date & Time →
            </button>
          </div>
        )}

        {/* STEP 2: SELECT DATE & TIME */}
        {step === 2 && (
          <div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "15px", color: "#334155" }}>Step 2: Choose Date & Time Slot</h3>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", marginBottom: "6px" }}>Select Date</label>
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
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", marginBottom: "10px" }}>Select Available Slot</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                {TIME_SLOTS.map((slot) => (
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
                ← Back
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
                Next: Enter Details →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONTACT DETAILS FORM */}
        {step === 3 && (
          <form onSubmit={handleBookSubmit}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "15px", color: "#334155" }}>Step 3: Provide Your Contact Information</h3>

            {statusMsg && (
              <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "#fee2e2", color: "#b91c1c", marginBottom: "15px", fontSize: "0.9rem" }}>
                {statusMsg.text}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "25px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "4px" }}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.95rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "4px" }}>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. aarav@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.95rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "4px" }}>Phone / WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 9990004878"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.95rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "4px" }}>Specific Questions / Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Tell us what country or universities you are targeting..."
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
                ← Back
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
                {isSubmitting ? "Booking Session..." : "Confirm & Send Email ✓"}
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION */}
        {step === 4 && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: "50px", marginBottom: "15px" }}>🎉</div>
            <h3 style={{ fontSize: "1.5rem", color: "#0f172a", marginBottom: "8px" }}>Session Booked Successfully!</h3>
            <p style={{ color: "#475569", lineHeight: "1.6", marginBottom: "20px" }}>
              A confirmation email has been sent to <strong>{email}</strong>.<br />
              We have scheduled your 1-on-1 session for:
            </p>

            <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "25px", textAlign: "left" }}>
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
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
