import { login } from "./actions";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ error?: string; redirect?: string }>;

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "Incorrect administrator credentials.",
  config: "Admin login is not configured on the server yet.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const redirectTo = params.redirect && (params.redirect.startsWith("/admin") || params.redirect.startsWith("/adminria"))
    ? params.redirect
    : "/admin";
  const errorMessage = params.error ? ERROR_MESSAGES[params.error] || "Something went wrong. Please try again." : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at 10% 20%, rgba(45, 111, 122, 0.95) 0%, rgba(77, 168, 179, 0.9) 90%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: "var(--font-body)",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(15px)",
          borderRadius: "var(--radius-lg)",
          padding: "50px 40px",
          width: "100%",
          maxWidth: "460px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "rgba(77, 168, 179, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px auto",
            fontSize: "28px",
          }}
        >
          🔒
        </div>

        <h2 style={{ color: "var(--color-deep-teal)", marginBottom: "8px", fontSize: "1.8rem" }}>Admin Gateway</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "30px", fontSize: "0.95rem" }}>
          Welcome back. Please input your secure administrator credentials.
        </p>

        <form action={login} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <input type="hidden" name="redirectTo" value={redirectTo} />

          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-deep-teal)", marginBottom: "6px" }}>
              ADMIN USERNAME
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter admin username..."
              required
              autoFocus
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-color)",
                outline: "none",
                fontSize: "1rem",
                color: "var(--text-primary)",
                backgroundColor: "#FCFAF6",
              }}
            />
          </div>

          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--color-deep-teal)", marginBottom: "6px" }}>
              ADMIN PASSWORD
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter admin password..."
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-color)",
                outline: "none",
                fontSize: "1rem",
                color: "var(--text-primary)",
                backgroundColor: "#FCFAF6",
              }}
            />
          </div>

          {errorMessage && (
            <div
              style={{
                background: "#FDF2F2",
                color: "#9B1C1C",
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.85rem",
                border: "1px solid #FDE8E8",
              }}
            >
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            style={{
              padding: "14px",
              borderRadius: "var(--radius-sm)",
              border: "none",
              background: "var(--color-deep-teal)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
