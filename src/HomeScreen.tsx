import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  Text,
  Pressable,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import firestore from '@react-native-firebase/firestore';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';

import {useNavigation} from '@react-navigation/native';
import VectorIcon from './components/VectorIcon';
import Card from './components/Card';
import Container from './components/Container';
import {getDeviceId, getUniqueId} from 'react-native-device-info';
import {MyContext} from '../App';
import {colors} from './utils/styles';
import {addData} from './services/todos';
import ListenVoice from './components/ListenVoice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetch} from '@react-native-community/netinfo';
import {useQuery, useRealm} from '@realm/react';
import {Task} from './models/task';
import {createTask, updateTask} from './services/CRUD';

interface TodoItem {
  id: string;
  createdAt: Date;
  completed: boolean;
  text: string;
  dueDate: Date;
  deviceId: string;
}

const HomeScreen = (): JSX.Element => {
  const [editable, setEditable] = useState(false);
  const [editIndex, setEditIndex] = useState<number | undefined>();
  const [newText, setNewText] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState(false);
  const textRef = useRef<TextInput>(null);
  const [name, setName] = useState('');
  const [listenModal, setListenModal] = useState(false);

  const {
    deviceId,
    setDeviceId,
    searchQuery,
    selectedItems,
    setSelectedItems,
    setTodos,
    filterQuery,
  } = useContext(MyContext);

  const navigation = useNavigation();
  const realm = useRealm();

  // useEffect(() => {
  //   const getDeviceToken = async () => {
  //     await messaging().registerDeviceForRemoteMessages();
  //     const token = await messaging().getToken();

  //   };

  //   getDeviceToken();
  // }, []);

  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     await onDisplayNotification(remoteMessage);
  //   });

  //   return unsubscribe;
  // }, []);

  useEffect(() => {
    const checkForNavigationIntent = async () => {
      const actionId = await AsyncStorage.getItem('NAVIGATION_INTENT');
      if (actionId) {
        // Assuming 'view_messages' should navigate to 'MessageScreen'
        if (actionId === 'stop') {
          // navigation.navigate('MessageScreen');
          console.log('back stop press');
        }
        // Clear the intent from storage after handling
        await AsyncStorage.removeItem('NAVIGATION_INTENT');
      }
    };

    checkForNavigationIntent();

    const unsubscribe = notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.ACTION_PRESS:
          if (detail.pressAction.id === 'stop') {
            // navigation.navigate('MessageScreen');
            console.log('stop press notify');
          }
          break;
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.pressAction?.id);
          break;
      }
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    async function getId() {
      const idd = await getUniqueId();
      setDeviceId(idd);
    }
    getId();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const connection = await fetch();

    if (connection.isConnected) {
      // Device is online, fetch only from Firestore
      const unsubscribe = firestore()
        .collection('Todos')
        .where('deviceId', '==', deviceId)
        .onSnapshot(
          async snapshot => {
            const todosData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setTodos(todosData);
            setLoading(false);
          },
          err => {
            console.error('Error fetching todos:', err);
            setLoading(false);
          },
        );

      return () => unsubscribe();
    } else {
      // Device is offline, fetch from Firestore cache and AsyncStorage
      const snapshotPromise = firestore()
        .collection('Todos')
        .where('deviceId', '==', deviceId)
        .get({source: 'cache'}); // Ensures data comes from Firestore cache

      const storagePromise = AsyncStorage.getItem('offlineTodos');

      Promise.all([snapshotPromise, storagePromise])
        .then(([snapshot, storedTodos]) => {
          let todosData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          if (storedTodos) {
            const additionalTodos = JSON.parse(storedTodos);
            todosData = todosData.concat(additionalTodos);
          }

          // console.log(todosData);

          setTodos(todosData);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching offline data:', err);
          setLoading(false);
        });
    }
  };

  const todos = useQuery(Task);

  useEffect(() => {
    if (!deviceId) return;

    console.log(JSON.stringify(todos, null, 2));
    // setTodos(taskList);

    // fetchData();
  }, [deviceId, setTodos, setLoading]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setDatePickerVisibility(false);
    if (editIndex !== undefined) {
      const todoId = todos[editIndex].id;
      updateDueDate(todoId, date);
    }
  };

  const updateDueDate = async (id: string, date: Date) => {
    await firestore().collection('Todos').doc(id).update({
      dueDate: date,
    });
    ToastAndroid.show('Due date updated!', ToastAndroid.BOTTOM);
  };

  const filterTodos = () => {
    const currentDate = new Date();

    return todos.filter(item => {
      // Convert timestamp to JavaScript Date object
      const itemDate = new Date(item.dueDate);

      // Check if the name matches the search query
      if (!item.name?.includes(searchQuery)) {
        return false;
      }

      // Filter based on the filterQuery
      switch (filterQuery) {
        case 'completed':
          return item.completed === true;
        case 'upcoming':
          return item.dueDate && itemDate > currentDate;
        case 'overdue':
          return item.dueDate && itemDate < currentDate;
        case 'today':
          return (
            item.dueDate &&
            itemDate.toDateString() === new Date().toDateString()
          );
        case 'No limit':
          return item.dueDate == null || item.dueDate === '';
        case 'all':
          return true; // Return all items if 'all' is selected
        default:
          return true; // Default to showing all if no valid filter is selected
      }
    });
  };

  console.log(selectedItems);

  return (
    <Container>
      <FlatList
        data={filterTodos()}
        renderItem={({item, index}) => (
          <Card
            item={item}
            isSelected={selectedItems.has(item._id)}
            selectedItems={selectedItems}
            onLongPress={() => {}}
            onSelectPress={() => {
              setSelectedItems(prevSelectedItems => {
                const updatedItems = new Set(prevSelectedItems);
                if (updatedItems.has(item._id)) {
                  updatedItems.delete(item._id);
                } else {
                  updatedItems.add(item._id);
                }
                return updatedItems;
              });
            }}
            onPress={() => {
              navigation.navigate('CreateTodo', {isEdit: true, item});
            }}
            onCheckPress={() => {
              updateTask(realm, item._id, {completed: !item.completed});
            }}
          />
        )}
        keyExtractor={(item, index) => item.id || index.toString()}
      />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateChange}
        onCancel={() => setDatePickerVisibility(false)}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
          paddingHorizontal: 10,
        }}>
        {/* <Pressable
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: 'skyblue',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <VectorIcon
            iconName="microphone"
            size={20}
            color={'white'}
            onPress={() => {
              setListenModal(true);
            }}
          />
        </Pressable> */}
        <TextInput
          placeholder="Add your Task"
          multiline
          onChangeText={setName}
          value={name}
          style={[styles.input, {width: '80%'}]}
          placeholderTextColor={'white'}
        />
        {name && (
          <VectorIcon
            iconName="check"
            size={20}
            color={true ? 'green' : 'white'}
            onPress={() => {
              createTask(
                realm,
                {
                  name,
                  deviceId,
                },
                () => {
                  setName('');
                },
              );
            }}
          />
        )}
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          navigation.navigate('CreateTodo', {isEdit: false, item: null})
        }>
        <VectorIcon iconName="plus" size={24} color="white" />
      </TouchableOpacity>
      {/* <ListenVoice
        onPress={undefined}
        visible={listenModal}
        setVisible={setListenModal}
      /> */}
    </Container>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f6fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 8,
    backgroundColor: 'white',
    borderRadius: 5,
    width: '100%',
  },
  todoText: {
    fontSize: 16,
  },
  input: {
    color: 'white',
    fontSize: 18,
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: colors.pirmary,
  },
  addButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#6200ee',
    borderRadius: 30,
    padding: 10,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
  },
});
