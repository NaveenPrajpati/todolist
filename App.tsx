import React, { ReactNode, useEffect, useRef, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/AntDesign'
import { FlatList, StyleSheet, TextInput, View, TouchableOpacity, Modal, Alert, Pressable, Image, ActivityIndicator, ToastAndroid } from 'react-native';
import { Text } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import moment from 'moment'
import DeviceInfo from 'react-native-device-info';

interface TodoItem {
  createdAt: Date;
  completed: boolean;
  text: string;
  id: string;
  data: () => { text: string, completed: boolean, dueDate: Date, createdAT: Date };
  deviceId: string; // device identification
}

function App(): JSX.Element {
  const [data, setData] = useState('');
  const [editable, setEditable] = useState(false);
  const [text, setText] = useState<TodoItem[]>([]);
  const [newText, setNewText] = useState('');
  const [editIndex, setEditIndex] = useState<number | undefined>();
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const textRef = useRef<TextInput>(null)
  const inputRef = useRef<TextInput>(null);
  const deviceIdentifier = DeviceInfo.getUniqueId();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false)

  // function formatDateTime(dateTime: { seconds: string }): string {
  //   const date = moment(dateTime.seconds).format('MM D, YYYY');
  //   return date;
  // }

  async function onDisplayNotification(data: FirebaseMessagingTypes.RemoteMessage) {
    // Request permissions (required for iOS)
    await notifee.requestPermission()

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: data.notification.title,
      body: data.notification.body,
      android: {
        channelId,
        //smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }

useEffect(()=>{
  async function getDeviceToken(){
    await messaging().registerDeviceForRemoteMessages();
const token = await messaging().getToken();
console.log(token)
  }
  getDeviceToken()
},[])

useEffect(() => {
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    //Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    onDisplayNotification(remoteMessage)
  });

  return unsubscribe;
}, []);


  async function getAllTodos() {
    const todosSnapshot = await firestore()
      .collection('Todos')
      .where('deviceId', '==', deviceIdentifier._j) // Filter by device identifier
      .get();

      const todosData = todosSnapshot.docs.map((doc) => {
        const data = doc.data();
        const id = doc.id;
        return { id, ...data };
      });
    
      setText(todosData);
  }


  useEffect(() => {
    getAllTodos();

  }, [loading]);



  function addData(): void {

    setLoading(true)
    if (data == '') {
      setLoading(false)
      return
    }
    firestore()
      .collection('Todos')
      .add({
        text: data,
        completed: false,
        dueDate: '',
        deviceId: deviceIdentifier._j,
        createdAt: Date.now()
      })
      .then(() => {
        setLoading(false)
        setModalVisible(!modalVisible)
        ToastAndroid.show('Todo added!', ToastAndroid.BOTTOM);
        setData('');
        setDueDate(undefined);

      });

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  function remove(id: string): void {
    setLoading(true)
    firestore()
      .collection('Todos')
      .doc(id)
      .delete()
      .then(() => {
        setLoading(false)
        ToastAndroid.show('Todo deleted!', ToastAndroid.BOTTOM);
      });
  }

  function readyEdit(index: number, data: TodoItem): void {
    setEditable(true);
    setEditIndex(index);
    setNewText(data.text);
    textRef.current?.focus()
  }

  function editText(id: string): void {
setLoading(true)
    firestore()
      .collection('Todos')
      .doc(id)
      .update({
        text: newText,
      })
      .then(() => {
        setLoading(false)
        setEditable(false);
        setEditIndex(undefined);
        ToastAndroid.show('Todo updated!', ToastAndroid.BOTTOM);
      });
  }

  function updateDate(id: string, data: Date) {
    firestore()
      .collection('Todos')
      .doc(id)
      .update({
        dueDate: data,
      })
      .then(() => {

        ToastAndroid.show('Reminder set',ToastAndroid.BOTTOM);
      });
  }



  function toggleCompletion(id: string, completed: boolean): void {
    setLoading(true)
    firestore()
      .collection('Todos')
      .doc(id)
      .update({
        completed: !completed,
      })
      .then(() => {
    setLoading(false)
        ToastAndroid.show('Todo completed',ToastAndroid.BOTTOM);
      });
  }

  const toggleDateTimePicker = () => {
    setShowDateTimePicker(!showDateTimePicker);
  };

  const handleConfirm = (id: string, selectedDate: Date) => {
    console.log(selectedDate)

    updateDate(id, selectedDate)

    setShowDateTimePicker(false);
  };



  return (

    <View style={{ position: 'relative', flex: 1, backgroundColor: '#EFEFEF' }}>
      <View style={{ padding: 8, backgroundColor: 'red' }}>
      {!loading && <Text style={{ textAlign: 'center', color: 'white', fontWeight: '700' }}>Todo List</Text>}
        {loading && <ActivityIndicator color={'white'} />}
      </View>
      <FlatList
        contentContainerStyle={{ marginHorizontal: 10 }}
        data={text}
        renderItem={({ item, index }) => (
          <View style={{ borderRadius: 10, padding: 5, backgroundColor: 'white', marginVertical: 5, elevation: 2, marginHorizontal: 3 }}>
            <View style={{ borderBottomColor: 'red', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontWeight: '700', color: 'black' }}>{item?.createdAt}</Text>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => toggleCompletion(item.id, item.completed)}>
                <Icon
                  name={item.completed ? 'checkcircle' : 'checkcircleo'}
                  size={15}
                  color={item.completed ? 'green' : 'gray'}
                />
              </TouchableOpacity>
            </View>
            <TextInput
              style={{ color: 'black' }}
              value={(editable && index == editIndex) ? newText : item.text}
              onChangeText={(text) => setNewText(text)}
              editable={editable}
              multiline
              ref={editable ? textRef : null}
            />
            <View style={{ borderTopColor: 'red', borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              {/* {item.data().dueDate && (
            <Text style={styles.dueDateText}>{formatDateTime(item.data().dueDate)}</Text>
          )} */}
              <TouchableOpacity style={styles.calendarIconContainer} onPress={toggleDateTimePicker}>
                <Icon name="calendar" size={20} color="skyblue" />
              </TouchableOpacity>
              <View style={{ flexDirection: 'row' }}>
                {!editable && <TouchableOpacity style={styles.editIconContainer} onPress={() => readyEdit(index, item)}>
                  <Icon name="edit" size={20} color="gray" />
                </TouchableOpacity>}
                <TouchableOpacity style={styles.deleteIconContainer} onPress={() => remove(item.id)}>
                  <Icon name="delete" size={20} color="red" />
                </TouchableOpacity>
                {editable && (
                  <TouchableOpacity style={styles.saveIconContainer} onPress={() => editText(item.id)}>
                    <Icon name="save" size={20} color="blue" />
                  </TouchableOpacity>
                )}
              </View>

              <DateTimePickerModal
                isVisible={showDateTimePicker}
                mode="datetime"
                onConfirm={(selectedate) => handleConfirm(item.id, selectedate)}
                onCancel={toggleDateTimePicker}
              />
            </View>
          </View>
        )}
      />
      <TouchableOpacity onPress={() => setModalVisible(true)} style={{ backgroundColor: 'red', borderRadius: 20, position: 'absolute', bottom: 20, right: 20, padding: 10, }}>
        <Text style={{ color: 'white', fontWeight: '700' }}>Add</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={{ backgroundColor: '#EFEFEF', flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: 'white', elevation: 2 }}>
            <Pressable
              onPress={() => setModalVisible(!modalVisible)}>
              <Icon name="arrowright" size={30} color="black" onPress={() => setModalVisible(!modalVisible)} />
            </Pressable>
            <Text style={{ fontWeight: '700', marginLeft: 20 }}>Add Todo</Text>

          </View>
          <View style={{ margin: 10 }}>
            {/* <TextInput placeholder='Title' onChangeText={(text)=>setTitle(text)} style={{backgroundColor:'white',borderRadius:6,paddingVertical:3,marginVertical:5,elevation:2}}/> */}
            <TextInput placeholder='body' multiline onChangeText={(text) => setData(text)} style={{ backgroundColor: 'white', borderRadius: 10, paddingVertical: 20, marginVertical: 5, elevation: 2 }} />
            <TouchableOpacity onPress={() => { addData() }} style={{ backgroundColor: 'red', padding: 8, width: '100%', borderRadius: 8, marginVertical: 5 }}>
              {!loading && <Text style={{ color: 'white', fontWeight: '700', textAlign: 'center' }}>Add</Text>}
              {loading && <ActivityIndicator color={'white'} />}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#242132',
  },
  wrapper: {
    height: '100%',
    padding: 5,
    marginTop: 10,

  },
  inputBox: {
    backgroundColor: '#37324d',
    borderRadius: 10,
    padding: 5,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputTag: {
    height: '100%',
    borderRadius: 10,
    fontSize: 30,
    width: '90%',
    color: 'white',

  },
  listWrapper: {
    flex: 1,
    marginTop: 5,
    alignItems: 'center',

  },
  fList: {
    alignItems: 'center',
    backgroundColor: 'cyan',
    marginBottom: 5,
    paddingBottom: 10,
  },
  listItem: {
    width: '45%',
    borderRadius: 10,
    padding: 5,
    margin: 5,
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#37324d',

  },
  checkboxContainer: {

  },
  todoText: {
    fontSize: 15,
    color: 'white',
    width: '80%',

  },
  editingText: {
    paddingHorizontal: 1,

  },
  editIconContainer: {
    marginHorizontal: 5,
  },
  deleteIconContainer: {
    marginHorizontal: 5,
  },
  saveIconContainer: {
    marginHorizontal: 5,
  },
  calendarIconContainer: {
    marginHorizontal: 5,
  },
  dueDateText: {
    color: 'white',
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default App;
function componentDidMount() {
  throw new Error('Function not implemented.');
}

