export default function RegistroCompletado({ onContinuar }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.card} role="dialog" aria-modal="true" aria-label="Registro completado">
        <div style={styles.iconWrap} aria-hidden="true">
          <svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
          >
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

        <h2 style={styles.title}>Registro completado</h2>
        <p style={styles.text}>Tu cuenta se creó correctamente.</p>

        <button
          type="button"
          onClick={onContinuar}
          style={styles.button}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "grid",
    placeItems: "center",
    padding: 16,
    zIndex: 9999,
  },
  card: {
    width: "min(420px, 100%)",
    background: "#fff",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 18px 60px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  iconWrap: {
    width: 72,
    height: 72,
    margin: "0 auto 12px",
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    color: "#16a34a",
    background: "rgba(22,163,74,0.10)",
  },
  title: {
    margin: "8px 0 6px",
    fontSize: 22,
    fontWeight: 700,
  },
  text: {
    margin: "0 0 16px",
    fontSize: 14,
    color: "#475569",
  },
  button: {
    width: "100%",
    border: "none",
    borderRadius: 12,
    padding: "12px 14px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    background: "#0f766e",
    color: "#fff",
  },
};
