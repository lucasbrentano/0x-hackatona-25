const color = {
  cardBackground: "#fff",
  coinContainerColor: "#f5a623", // exemplo, ajuste conforme sua paleta
};

const fonts = {
  heading: "'Arial Black', Arial, sans-serif",
};

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

const STATUSBAR_HEIGHT = 24; // Web não tem StatusBar, fixo um valor padrão
const EXTRA_TOP_SPACE = windowHeight * 0.002;

export const appBarStyles = {
  header: {
    backgroundColor: "transparent",
    boxShadow: "none",
    paddingLeft: windowWidth * 0.04,
    paddingRight: windowWidth * 0.04,
    paddingTop: STATUSBAR_HEIGHT + EXTRA_TOP_SPACE,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    boxSizing: "border-box",
  },

  coinWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },

  coinCircle: {
    width: 38,
    height: 38,
    borderRadius: 16,
    backgroundColor: color.cardBackground,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    zIndex: 2,
  },

  coinIcon: {
    width: 42,
    height: 42,
    marginRight: 0,
    objectFit: "contain",
  },

  coinValueBox: {
    backgroundColor: color.coinContainerColor,
    height: 32,
    paddingLeft: 12,
    paddingRight: 14,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    marginLeft: -10,
    display: "flex",
    justifyContent: "center",
    position: "relative",
    zIndex: 1,
  },

  coinText: {
    color: color.cardBackground,
    fontSize: 20,
    fontFamily: fonts.heading,
  },

  configIcon: {
    width: 40,
    height: 40,
    marginRight: windowWidth * 0.04,
    objectFit: "contain",
    cursor: "pointer",
  },

  avatarIcon: {
    width: 50,
    height: 50,
    marginRight: windowWidth * 0.04,
    borderRadius: 22,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: color.coinContainerColor,
    objectFit: "cover",
    cursor: "pointer",
  },
};
