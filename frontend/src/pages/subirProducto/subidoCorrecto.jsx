export default function ProductoSubido() {
  return (
    <div style={styles.overlay}>
      <div
        style={styles.card}
        role="status"
        aria-live="polite"
        aria-label="Producto subido"
      >
        <div style={styles.iconWrap} aria-hidden="true">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path
              d="M7.5 12.2l2.7 2.8L16.8 9"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 style={styles.title}>Producto subido</h2>
        <p style={styles.text}>Se publicó correctamente.</p>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  card: {
    background: "#fff",
    borderRadius: 14,
    padding: "22px 26px",
    width: 340,
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
    color: "#0f172a",
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    margin: "0 auto 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#16a34a",
    background: "rgba(22, 163, 74, 0.12)",
  },
  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
  },
  text: {
    margin: "8px 0 0",
    fontSize: 14,
    color: "#475569",
  },
};
