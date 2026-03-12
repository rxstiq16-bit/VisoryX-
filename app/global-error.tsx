"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global error:", error)
  }, [error])

  return (
    <html>
      <body>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "1rem",
          fontFamily: "system-ui, sans-serif",
          backgroundColor: "#09090b",
          color: "#fafafa",
        }}>
          <div style={{ maxWidth: "24rem", textAlign: "center" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
              Critical Error
            </h1>
            <p style={{ color: "#a1a1aa", marginBottom: "1.5rem" }}>
              Something went seriously wrong. Please try refreshing the page.
            </p>
            {error.digest && (
              <p style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#27272a",
                borderRadius: "0.5rem",
                fontSize: "0.75rem",
                fontFamily: "monospace",
                marginBottom: "1.5rem",
              }}>
                Error ID: {error.digest}
              </p>
            )}
            <button
              onClick={reset}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#fafafa",
                color: "#09090b",
                border: "none",
                borderRadius: "0.5rem",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
