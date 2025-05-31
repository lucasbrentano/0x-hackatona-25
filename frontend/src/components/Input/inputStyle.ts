const color = {
  cardBackground: "#fff",
  textLabel: "#333",
  secondText: "#777",
  shadow: "rgba(0, 0, 0, 0.2)",
};

export const inputStyle = {
  shadowWrapper: {
    width: "100%",
    maxWidth: 480,
    margin: "8px 0",
    padding: "2px",
  },
  input: {
    backgroundColor: color.cardBackground,
    borderRadius: 9,
    height: 60,
    padding: "0 16px",
    boxShadow: `0 4px 10px ${color.shadow}`,
    border: "none",
    fontSize: 16,
    outline: "none",
    fontFamily: "'Arial', sans-serif",
    color: color.textLabel,
    boxSizing: "border-box" as const,
    width: "100%",
  },
  label: {
    display: "block",
    marginBottom: 4,
    color: color.textLabel,
    fontFamily: "'Arial', sans-serif",
    fontWeight: 500,
  },
  visibilityToggle: {
    position: "absolute" as const,
    right: 16,
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: color.secondText,
    userSelect: "none" as const,
  },
  inputWrapper: {
    position: "relative" as const,
    width: "100%",
    maxWidth: 480,
  },
};
