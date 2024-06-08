import React, {createContext, useState, ReactNode} from 'react';
import Routes from './src/Routes';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import SpInAppUpdates, {
  NeedsUpdateResponse,
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';

// Define the type for the context values
interface MyContextType {
  deviceId: string;
  setDeviceId: (id: string) => void;
  loading: boolean;
  setLoading: (id: boolean) => void;
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
  loading: boolean;
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
  loading: false,
  setLoading: () => {},
};

export const MyContext = createContext<MyContextType>(defaultContextValue);

const App = (): JSX.Element => {
  const [deviceId, setDeviceId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
    loading,
    setLoading,
  };

  if (global.__fbBatchedBridge) {
    const origMessageQueue = global.__fbBatchedBridge;
    const modules = origMessageQueue._remoteModuleTable;
    const methods = origMessageQueue._remoteMethodTable;
    global.findModuleByModuleAndMethodIds = (moduleId, methodId) => {
      console.log(
        `The problematic line code is in: ${modules[moduleId]}.${methods[moduleId][methodId]}`,
      );
    };
  }

  return (
    <GestureHandlerRootView>
      <MyContext.Provider value={values}>
        <Routes />
      </MyContext.Provider>
    </GestureHandlerRootView>
  );
};

export default App;
