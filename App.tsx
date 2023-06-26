import React, { useEffect, useRef, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/AntDesign'
import { FlatList, StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import moment from 'moment'
import DeviceInfo from 'react-native-device-info';

interface TodoItem {
  id: string;
  data: () => { text: string, completed: boolean, dueDate: Date };
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
const  textRef=useRef<TextInput>(null)
  const inputRef = useRef<TextInput>(null);
  const deviceIdentifier = DeviceInfo.getUniqueId();

  // function formatDateTime(dateTime: { seconds: string }): string {
  //   const date = moment(dateTime.seconds).format('MM D, YYYY');
  //   return date;
  // }

  async function getAllTodos() {
    const todosSnapshot = await firestore()
    .collection('Todos')
    .where('deviceId', '==', deviceIdentifier) // Filter by device identifier
    .get();

  setText(todosSnapshot.docs as TodoItem[]);
  }


  useEffect(() => {
    
    getAllTodos();
    console.log('fet')
  }, [editable]);



  function submit(): void {
    firestore()
      .collection('Todos')
      .add({
        text: data,
        completed: false,
        dueDate: '',
        deviceId: deviceIdentifier,
      })
      .then(() => {
        console.log('Todo added!');
        setData('');
        setDueDate(undefined);
      getAllTodos();

      });

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  function remove(id: string): void {
    firestore()
      .collection('Todos')
      .doc(id)
      .delete()
      .then(() => {
        console.log('Todo deleted!');
    getAllTodos();

      });
  }

  function editText(id: string): void {
    setEditable(false);
    setEditIndex(undefined);

    firestore()
      .collection('Todos')
      .doc(id)
      .update({
        text: newText,
      })
      .then(() => {
        console.log('Todo updated!');
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

        console.log('Todo completion status updated!');
      });
  }

  function readyEdit(index: number, data: TodoItem): void {
    setEditable(true);
    setEditIndex(index);
    setNewText(data.data().text);
    textRef.current?.focus()
  }

  function toggleCompletion(id: string, completed: boolean): void {
    firestore()
      .collection('Todos')
      .doc(id)
      .update({
        completed: !completed,
      })
      .then(() => {
        console.log('Todo completion status updated!');
      });
  }


 

  //render todos items 
  const renderTodoItem = ({ item, index }: { item: TodoItem; index: number }) => {
    const isEditing = index === editIndex && editable;

    const toggleDateTimePicker = () => {
      setShowDateTimePicker(!showDateTimePicker);
    };

    const handleConfirm = (id: string, selectedDate: Date) => {
      console.log(selectedDate)

      updateDate(id, selectedDate)

      setShowDateTimePicker(false);
    };


    

    return (
      <View key={index} style={styles.listItem}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TextInput
            style={[styles.todoText, isEditing && styles.editingText]}
            value={isEditing ? newText : item.data().text}
            onChangeText={(text) => setNewText(text)}
            editable={isEditing}
            multiline
           ref={isEditing?textRef:null}
          />

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => toggleCompletion(item.id, item.data().completed)}>
            <Icon
              name={item.data().completed ? 'checkcircle' : 'checkcircleo'}
              size={20}
              color={item.data().completed ? 'green' : 'white'}
            />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        {/* {item.data().dueDate && (
            <Text style={styles.dueDateText}>{formatDateTime(item.data().dueDate)}</Text>
          )} */}
          {!isEditing && <TouchableOpacity style={styles.editIconContainer} onPress={() => readyEdit(index, item)}>
            <Icon name="edit" size={20} color="gray" />
          </TouchableOpacity>}
          <TouchableOpacity style={styles.deleteIconContainer} onPress={() => remove(item.id)}>
            <Icon name="delete" size={20} color="red" />
          </TouchableOpacity>
          {isEditing && (
            <TouchableOpacity style={styles.saveIconContainer} onPress={() => editText(item.id)}>
              <Icon name="save" size={20} color="blue" />
            </TouchableOpacity>
          )}
          {/* <TouchableOpacity style={styles.calendarIconContainer} onPress={toggleDateTimePicker}>
            <Icon name="calendar" size={20} color="skyblue" />
          </TouchableOpacity>
          
          <DateTimePickerModal
            isVisible={showDateTimePicker}
            mode="datetime"
            onConfirm={(selectedate) => handleConfirm(item.id, selectedate)}
            onCancel={toggleDateTimePicker}
          /> */}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={{ color: 'white', fontSize: 20, fontWeight: '700' }}>Todo List</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.inputTag}
            ref={inputRef}
            keyboardType="default"
            placeholder="Enter note"
            value={data}
            onChangeText={(e: React.SetStateAction<string>) => setData(e)}
            onSubmitEditing={submit}
            underlineColorAndroid='transparent'
          />
          <Icon name="arrowright" size={30} color="white" onPress={() => submit()} />
        </View>

        <KeyboardAvoidingView style={styles.listWrapper} behavior='height'>

          <FlatList
            contentContainerStyle={styles.fList}
            numColumns={2}
            data={text}
            renderItem={renderTodoItem}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps='handled'

          />
        </KeyboardAvoidingView>

      </View>
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
    color:'white',
    
  },
  listWrapper: {
    flex: 1,
    marginTop: 5,
    alignItems: 'center',

  },
  fList: {
    alignItems: 'center',
backgroundColor:'cyan',
    marginBottom: 5,
    paddingBottom: 10,
  },
  listItem: {
    width: '45%',
    borderRadius: 10,
    padding: 5,
    margin: 5,
    display:'flex',
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
