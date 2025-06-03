import color from "../../styles/color";
import font from "../../styles/fonts";

export const modalStyles = {
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  container: {
    backgroundColor: color.cardBackground,
    border: `2px solid ${color.colorModal}`,
    borderRadius: 16,
    width: 280,
    height: 290,
    padding: "24px 20px",
    boxSizing: "border-box" as const,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    position: "relative" as const,
  },
  title: {
    fontFamily: font.text,
    fontSize: 16,
    color: color.colorModal,
    textAlign: "center" as const,
    marginTop: 16,
    marginBottom: 0,
  },
  icon: {
    width: 64,
    height: 64,
    margin: "20px 0",
    objectFit: "contain" as const,
  },
  buttonWrapper: {
    marginTop: 2,
    width: "100%",
    display: "flex",
    flexDirection: "column" as const,
    gap: 8,
  },
  button: {
    width: "100%",
  },
  closeButton: {
    position: "absolute" as const,
    top: 10,
    right: 10,
    padding: 10,
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
  },
  closeIcon: {
    color: color.colorModal,
  },
};
