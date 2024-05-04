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
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import firestore from '@react-native-firebase/firestore';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

import {useNavigation} from '@react-navigation/native';
import VectorIcon from './components/VectorIcon';
import Card from './components/Card';
import Container from './components/Container';
import {getDeviceId, getUniqueId} from 'react-native-device-info';
import {MyContext} from '../App';

interface TodoItem {
  id: string;
  createdAt: Date;
  completed: boolean;
  text: string;
  dueDate: Date;
  deviceId: string;
}

const HomeScreen = (): JSX.Element => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [editable, setEditable] = useState(false);
  const [editIndex, setEditIndex] = useState<number | undefined>();
  const [newText, setNewText] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState(false);
  const textRef = useRef<TextInput>(null);

  const {deviceId, setDeviceId} = useContext(MyContext);

  const navigation = useNavigation();

  useEffect(() => {
    const getDeviceToken = async () => {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      // console.log(token);
    };

    getDeviceToken();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      await onDisplayNotification(remoteMessage);
    });

    return unsubscribe;
  }, []);

  const getAllTodos = async () => {
    setLoading(true);
    try {
      const todosSnapshot = await firestore()
        .collection('Todos')
        .where('deviceId', '==', deviceId)
        .get();

      const fetchedTodos = todosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as TodoItem),
      }));
      console.log(fetchedTodos);
      setTodos(fetchedTodos);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    async function getId() {
      const idd = await getUniqueId();
      setDeviceId(idd);
    }
    getId();
  }, []);
  useEffect(() => {
    console.log(deviceId);
    if (!deviceId) return;

    const unsubscribe = firestore()
      .collection('Todos')
      .where('deviceId', '==', deviceId)
      .onSnapshot(
        snapshot => {
          const todosData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log('Fetched Todos:', todosData);
          setTodos(todosData);
          setLoading(false);
        },
        err => {
          console.error('Error fetching todos:', err); // Improved error logging.
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, [deviceId]);

  const onDisplayNotification = async (
    data: FirebaseMessagingTypes.RemoteMessage,
  ) => {
    await notifee.requestPermission();
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    await notifee.displayNotification({
      title: data.notification?.title,
      body: data.notification?.body,
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
      },
    });
  };

  const toggleCompletion = async (id: string, completed: boolean) => {
    setLoading(true);
    await firestore().collection('Todos').doc(id).update({
      completed: !completed,
    });
    setLoading(false);
    ToastAndroid.show('Todo status updated!', ToastAndroid.BOTTOM);
    getAllTodos();
  };

  const editTodo = async (id: string) => {
    setLoading(true);
    await firestore().collection('Todos').doc(id).update({
      text: newText,
    });
    setLoading(false);
    setEditable(false);
    setEditIndex(undefined);
    ToastAndroid.show('Todo updated!', ToastAndroid.BOTTOM);
    getAllTodos();
  };

  const removeTodo = async (id: string) => {
    setLoading(true);
    await firestore().collection('Todos').doc(id).delete();
    setLoading(false);
    ToastAndroid.show('Todo deleted!', ToastAndroid.BOTTOM);
    getAllTodos();
  };

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
    getAllTodos();
  };

  return (
    <Container>
      <Card />
      <FlatList
        data={todos}
        renderItem={({item, index}) => (
          <View style={styles.todoItem}>
            <Text style={styles.todoText}>{item.text}</Text>

            <TouchableOpacity onPress={() => toggleCompletion()}>
              <VectorIcon
                iconName={item.completed ? 'checkcircle' : 'checkcircleo'}
                iconPack="AntDesign"
                size={20}
                color={item.completed ? 'green' : 'grey'}
              />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id}
      />
      {editable && (
        <TextInput
          ref={textRef}
          value={newText}
          onChangeText={setNewText}
          style={styles.input}
        />
      )}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateChange}
        onCancel={() => setDatePickerVisibility(false)}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateTodo')}>
        <VectorIcon iconName="plus" size={24} color="white" />
      </TouchableOpacity>
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
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '90%',
    padding: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
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
