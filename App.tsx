import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useRef,
  RefObject,
} from 'react';
import Routes from './src/Routes';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import SpInAppUpdates, {
  NeedsUpdateResponse,
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';
import {DrawerLayoutAndroid} from 'react-native';

// Define the type for the context values
interface MyContextType {
  deviceId: string;
  setDeviceId: Dispatch<SetStateAction<string>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterQuery: string;
  setFilterQuery: (query: string) => void;
  selectedItems: Set<string>;
  setSelectedItems: React.Dispatch<React.SetStateAction<Set<string>>>;
  todos: TodoItem[];
  setTodos: (items: TodoItem[]) => void;
  drawer: RefObject<DrawerLayoutAndroid | null>;
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
  selectedItems: new Set(),
  setSelectedItems: () => {},
  todos: [],
  setTodos: () => {},
  loading: false,
  setLoading: () => {},
  drawer: null,
};

export const MyContext = createContext<MyContextType | undefined>(undefined);

const App = (): JSX.Element => {
  const [deviceId, setDeviceId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const drawer = useRef<DrawerLayoutAndroid>(null);

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
    drawer,
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
