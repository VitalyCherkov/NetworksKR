const menuWidth = 256;

export const menuSiderStyles = {
  width: menuWidth,
  style: {
    position: 'fixed',
    overflow: 'auto',
    left: 0,
    height: '100vh',
  },
};

export const menuStyles = {
  theme: 'dark',
  mode: 'inline',
  style: {
    width: menuWidth,
  },
};

export const mainLayoutStyles = {
  style: {
    marginLeft: menuWidth,
  },
};

export const contentStyles = {
  style: {
    padding: '80px 16px 0',
    overflow: 'auto',
    height: '100vh',
    position: 'relative',
  }
};


export const inputContainerStyles = {
  style: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    padding: 8,
    boxSizing: 'border-box',
  }
};

export const inputStyles = {
  style: {
    width: '100%',
  }
};

export const messagesStyles = {
  style: {
    height: `calc(100% - 64px)`,
    overflow: 'auto',
  },
};

export const messageStyles = {
  style: {
    marginBottom: 8,
  },
};
