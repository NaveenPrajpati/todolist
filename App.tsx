import React, {createContext, useState, ReactNode} from 'react';
import Routes from './src/Routes';

// Define the type for the context values
interface MyContextType {
  deviceId: string;
  setDeviceId: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterQuery: string;
  setFilterQuery: (query: string) => void;
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
  todos: TodoItem[];
  setTodos: (items: TodoItem[]) => void;
}

interface TodoItem {
  id: string;
  createdAt: Date;
  completed: boolean;
  text: string;
  dueDate: Date;
  deviceId: string;
}

const defaultContextValue: MyContextType = {
  deviceId: '',
  setDeviceId: () => {},
  searchQuery: '',
  setSearchQuery: () => {},
  filterQuery: '',
  setFilterQuery: () => {},
  selectedItems: [],
  setSelectedItems: () => {},
  todos: [],
  setTodos: () => {},
};

export const MyContext = createContext<MyContextType>(defaultContextValue);

const App = (): JSX.Element => {
  const [deviceId, setDeviceId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([]);

  const values: MyContextType = {
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
