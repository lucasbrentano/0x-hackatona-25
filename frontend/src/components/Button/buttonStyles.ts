const color = {
  primary: "#57BE9A",
  cardBackground: "#fff",
  colorModal: "#888",
  shadow: "rgba(0,0,0,0.2)"
};

const fonts = {
  text: "'Arial', sans-serif"
};

export const buttonStyles = {
  base: {
    width: "100%",
    padding: "8px 0", // paddingVertical 1 no RN virou 8px vertical no web (ajustável)
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "6px 0",
    boxShadow: `0 4px 2px -2px ${color.shadow}`,
    cursor: "pointer",
    border: "none",
  },
  primary: {
    backgroundColor: color.primary,
    color: color.cardBackground,
  },
  secondary: {
    backgroundColor: color.cardBackground,
    border: `2px solid ${color.primary}`,
    color: color.primary,
  },
  tertiary: {
    backgroundColor: color.colorModal,
    color: color.cardBackground,
  },
  text: {
    fontSize: 16,
    fontFamily: fonts.text,
    fontWeight: "normal",
    textAlign: "center",
    width: "100%",
  },
  shadow: {
    boxShadow: `0 4px 8px ${color.shadow}`,
    borderRadius: 10,
  },
  icon: {
    marginRight: 8,
    display: "inline-flex",
    verticalAlign: "middle"
  }
};
