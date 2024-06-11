import {useNavigation, useNavigationState} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Pressable,
} from 'react-native';
import VectorIcon from './VectorIcon';
import {MyContext} from '../../App';
import {colors} from '../utils/styles';
import FilterMenu from './FilterMenu';
import {removeTodo, syncData} from '../services/todos';
import notifee from '@notifee/react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useFetchTodos from '../hook/useFecthTodos';
import {deleteTask} from '../services/CRUD';
import {useQuery, useRealm} from '@realm/react';
import {Task} from '../models/task';
import SelectTag from './Dropdown';
import {filterData, selectData} from '../utils/utilityFunctions';

const Header = ({title}) => {
  const navigation = useNavigation();
  const state = useNavigationState(state => state);
  const [showSearch, setShowSearch] = useState(false);
  const {
    searchQuery,
    setSearchQuery,
    selectedItems,
    setSelectedItems,
    drawer,
    deviceId,
    setTodos,
    setLoading,
  } = useContext(MyContext);

  const realm = useRealm();
  const todos = useQuery(Task);

  const onBackPress = () => {
    navigation.goBack();
  };

  // const fetchTodos = useFetchTodos(deviceId, setTodos, setLoading);
  const {type, isConnected} = useNetInfo();

  const [hasLocalData, setHasLocalData] = useState(false);

  useEffect(() => {
    const checkLocalData = async () => {
      const localData = await AsyncStorage.getItem('offlineTodos');
      setHasLocalData(!!localData);
    };

    checkLocalData();
  }, []);

  const handleDeleteTask = () => {
    deleteTask(realm, selectedItems, () => {
      setSelectedItems(new Set());
    });
  };

  const [list, setList] = useState('');

  const showBackButton = state.index > 0;
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
        {showBackButton ? (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <VectorIcon
              iconName="arrowleft"
              iconPack="AntDesign"
              size={24}
              style={styles.backText}
            />
          </TouchableOpacity>
        ) : (
          <VectorIcon
            iconName="menu"
            iconPack="MaterialCommunityIcons"
            size={22}
            color="white"
            onPress={() => drawer.current?.openDrawer()}
          />
        )}
        {!title ? (
          <SelectTag
            data={filterData}
            onChange={({value}) => {
              console.log(value);
              setList(value);
            }}
            renderLeftIcon={() => null}
            value={list}
            containerStyle={{width: 150}}
          />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
        {showSearch && (
          <TextInput
            placeholder="Search here"
            multiline
            autoFocus
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={[styles.input, {width: '50%'}]}
            placeholderTextColor={'white'}
          />
        )}
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
        {selectedItems.size != 0 && (
          <>
            <VectorIcon
              iconName="delete"
              iconPack="AntDesign"
              size={20}
              color="red"
              onPress={handleDeleteTask}
            />
            {selectedItems.size > 0 && (
              <VectorIcon
                iconName="playlist-add-check"
                iconPack="MaterialIcons"
                size={24}
                color="white"
                onPress={() => {
                  setSelectedItems(prevSelectedItems => {
                    if (todos.length === prevSelectedItems.size) {
                      return new Set(); // Clear selection if all are selected
                    } else {
                      return new Set(todos.map(todo => todo._id.toString())); // Select all todo IDs
                    }
                  });
                }}
              />
            )}
          </>
        )}

        <VectorIcon
          iconName="search"
          size={20}
          color="white"
          onPress={() => setShowSearch(pre => !pre)}
        />
        {/* {isConnected && hasLocalData && (
          <Pressable onPress={() => {}}>
            <VectorIcon
              iconName="web-sync"
              iconPack="MaterialCommunityIcons"
              size={24}
              color="white"
              onPress={() => {
                console.log('working..');

                syncData(() => {
                  // fetchTodos();
                });
              }}
            />
          </Pressable>
        )} */}
        <FilterMenu />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#222222', // dark background as in the card
    height: 60, // height of the header
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    justifyContent: 'center',
    // Full height of the header
  },
  backText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    color: 'white',
    fontSize: 14,
    padding: 5,

    borderBottomWidth: 2,
    borderBottomColor: colors.pirmary,
  },
});

export default Header;
