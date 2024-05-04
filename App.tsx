import React, {createContext, useState} from 'react';
import Routes from './src/Routes';
export const MyContext = createContext();
const App = () => {
  const [deviceId, setDeviceId] = useState('');

  const values = {
    deviceId,
    setDeviceId,
  };

  return (
    <MyContext.Provider value={values}>
      <Routes />
    </MyContext.Provider>
  );
};

export default App;
