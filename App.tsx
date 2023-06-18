import React, { useEffect, useRef, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/AntDesign'
import { FlatList, StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';
import 'dayjs/locale/en-in'

interface TodoItem {
  id: string;
  data: () => { text: string, completed: boolean, dueDate: Date };
}

function App(): JSX.Element {
  const [data, setData] = useState('');
  const [editable, setEditable] = useState(false);
  const [text, setText] = useState<TodoItem[]>([]);
  const [newText, setNewText] = useState('');
  const [editIndex, setEditIndex] = useState<number | undefined>();
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

  const inputRef = useRef<TextInput>(null);


  function formatDateTime(dateTime: string): string {
    const formattedDateTime = dayjs(dateTime).format('DD MM YYYY');
    return formattedDateTime;
  }

  function submit(): void {
    firestore()
      .collection('Todos')
      .add({
        text: data,
        completed: false,
        
      })
      .then(() => {
        console.log('Todo added!');
        setData('');
        setDueDate(undefined);
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

  function updateDate(id: string,data:Date){
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

  useEffect(() => {
    async function getAllTodos() {
 
      const users = await firestore().collection('Todos').get();
      // console.log(users.data().dueDate)
      setText(users.docs as TodoItem[]);
    }
    getAllTodos();
  },[text,editable]);

  const renderTodoItem = ({ item, index }: { item: TodoItem; index: number }) => {
    const isEditing = index === editIndex && editable;

    const toggleDateTimePicker = () => {
      setShowDateTimePicker(!showDateTimePicker);
    };

    const handleConfirm = (id: string,selectedDate: Date) => {
      console.log(id)
     
      updateDate(id,selectedDate)
      setDueDate(selectedDate);
      setShowDateTimePicker(false);
    };

    return (
      <View key={index} style={styles.listItem}>
<View style={{flexDirection:'row'}}>
<TextInput
          style={[styles.todoText, isEditing && styles.editingText]}
          value={isEditing ? newText : item.data().text}
          onChangeText={(text) => setNewText(text)}
          editable={isEditing}
          multiline
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
       
     <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
     {!isEditing &&  <TouchableOpacity style={styles.editIconContainer} onPress={() => readyEdit(index, item)}>
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
        <TouchableOpacity style={styles.calendarIconContainer} onPress={toggleDateTimePicker}>
          <Icon name="calendar" size={20} color="skyblue" />
        </TouchableOpacity>
        {/* {item.data().dueDate && (
          <Text style={styles.dueDateText}>{formatDateTime(new Date(item.data().dueDate))}</Text>
        )} */}
        <DateTimePickerModal
          isVisible={showDateTimePicker}
          mode="datetime"
          onConfirm={(selectedate)=>handleConfirm(item.id,selectedate)}
          onCancel={toggleDateTimePicker}
        />
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
          />
          <Icon name="arrowright" size={30} color="white" onPress={() => submit()} />
        </View>

        <KeyboardAvoidingView style={styles.listWrapper}>
          <FlatList
            numColumns={2}
            data={text}
            renderItem={renderTodoItem}
            keyExtractor={(item) => item.id}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputTag: {
    height: 50,
    fontSize: 30,
    width: '90%',
  },
  listWrapper: {
    padding: 10,
  },
  listItem: {
    height: 150,
    width: 180,
    borderRadius: 10,
    padding: 5,
    margin: 5,
    justifyContent: 'space-between',
    backgroundColor: '#37324d',

  },
  checkboxContainer: {
    marginHorizontal: 5,
  },
  todoText: {
    fontSize: 15,
    color: 'white',
    width:'80%'
  },
  editingText: {
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 5,
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
