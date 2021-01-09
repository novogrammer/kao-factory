import React from 'react'

const LogTextContext = React.createContext({
  addLogText: () => { },
  clearLogText: () => { },
});

export default LogTextContext;