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
import notifee from '@notifee/react-native';

import {useNavigation} from '@react-navigation/native';
import VectorIcon from './components/VectorIcon';
import Card from './components/Card';
import Container from './components/Container';
import {getDeviceId, getUniqueId} from 'react-native-device-info';
import {MyContext} from '../App';
import {colors} from './utils/styles';
import {addData} from './services/todos';

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
  const [data, setData] = useState('');

  const {
    deviceId,
    setDeviceId,
    searchQuery,
    selectedItems,
    setSelectedItems,
    todos,
    setTodos,
  } = useContext(MyContext);

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
          console.log('Fetched Todos:', JSON.stringify(todosData, null, 2));
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
      <FlatList
        data={todos.filter(it => it.text.includes(searchQuery))}
        renderItem={({item, index}) => (
          <Card
            item={item}
            selectedItems={selectedItems}
            onLongPress={() => {}}
            onSelectPress={() => {
              const ind = selectedItems.indexOf(item.id);
              if (ind >= 0) {
                const newSelectedItems = [...selectedItems];
                newSelectedItems.splice(ind, 1);
                setSelectedItems(newSelectedItems);
              } else setSelectedItems(pre => [...pre, item.id]);
            }}
            onCheckPress={() => getAllTodos()}
            onEditPress={() => {
              navigation.navigate('CreateTodo', {isEdit: true, item});
            }}
          />
        )}
        keyExtractor={item => item.id}
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
        <Pressable
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
            onPress={() => {}}
          />
        </Pressable>
        <TextInput
          placeholder="Add your Task"
          multiline
          onChangeText={setData}
          value={data}
          style={[styles.input, {width: '80%'}]}
          placeholderTextColor={'white'}
        />
        {data && (
          <VectorIcon
            iconName="check"
            size={20}
            color={true ? 'green' : 'white'}
            onPress={() => {
              addData({data, deviceId}, () => {
                setData('');
                getAllTodos();
              });
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
