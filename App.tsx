import React, {createContext, useState} from 'react';
import Routes from './src/Routes';
export const MyContext = createContext();
const App = () => {
  const [deviceId, setDeviceId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [todos, setTodos] = useState([]);

  const values = {
    deviceId,
    setDeviceId,
    searchQuery,
    setSearchQuery,
    filterQuery,
    setFilterQuery,
    selectedItems,
    setSelectedItems,
    todos,
    setTodos,
  };

  return (
    <MyContext.Provider value={values}>
      <Routes />
    </MyContext.Provider>
  );
};

export default App;
