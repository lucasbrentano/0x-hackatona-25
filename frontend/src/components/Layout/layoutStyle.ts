export const layoutStyle = {
  background: {
    position: 'relative' as const,
    width: '100%',
    height: '100vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    overflowY: 'auto' as const,
  },
  scrollContainer: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  fixedBottom: {
    position: 'fixed' as const,
    bottom: 0,
    width: '100%',
    zIndex: 100,
  },
  fixedTop: {
    position: 'fixed' as const,
    top: 0,
    width: '100%',
    zIndex: 100,
  },
};
