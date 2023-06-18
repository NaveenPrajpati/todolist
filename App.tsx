
import React, { useEffect, useRef, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/AntDesign'
import {
  FlatList,
StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Text } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';


interface TodoItem {
  id: string;
  data: () => { text: string };
}

function App(): JSX.Element {
  const [data, setData] = useState('');
  const [editable, setEditable] = useState(false);
  const [text, setText] = useState<TodoItem[]>([]);
  const [newText, setNewText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const [editIndex, setEditIndex] = useState<number | undefined>();

  function find(event: { text: string; target: { value: string } }): void {
    event.target.value = '';
    console.log(event.target);
  }

  function submit(): void {
    firestore()
      .collection('Todos')
      .add({
        text: data,
      })
      .then(() => {
        console.log('Todo added!');
        setData('');
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
        console.log('User deleted!');
      });
  }

  function editText(id: string): void {
    console.log(newText);
    setEditable(false);
    setEditIndex(undefined);
    firestore()
      .collection('Todos')
      .doc(id)
      .update({
        text: newText,
      })
      .then(() => {
        console.log('User updated!');
      });
  }

  function readyEdit(index: number, data: TodoItem): void {
    setEditable(true);
    setEditIndex(index);
    console.log(data.data().text);
    setNewText(data.data().text);
    console.log(data.id);
  }

  useEffect(() => {
    async function getAllTodos() {
      const startDate = new Date();
      const users = await firestore().collection('Todos').get();
      setText(users.docs as TodoItem[]);
    }
    getAllTodos();
  },);

  return (
   <View style={styles.container}>
      <View style={styles.wrapper}>
   <Text style={{color:'white',fontSize:20,fontWeight:'700'}}>Todo List</Text>
     
        <View style={styles.inputBox}>
          <TextInput style={styles.inputTag} ref={inputRef} keyboardType='default' placeholder='Enter note' value={data} onChangeText={(e: React.SetStateAction<string>) => setData(e)} onSubmitEditing={submit} />
          <Icon name="arrowright" size={30} color="white" onPress={(eve: any) => submit(eve)} />
        </View>

        <KeyboardAvoidingView style={styles.listWrapper}>
          <FlatList columnWrapperStyle={{justifyContent:'center'}}
           numColumns={2}
            data={text}
            renderItem={({ item, index }) =>
              <View key={index} style={styles.listItem}>
                <TextInput 
                style={{fontSize:15,color:'white',width:"100%",height:'80%',margin:0,}}
                value={(index==editIndex && editable )?newText:item.data().text} 
                onChangeText={(tx)=>setNewText(tx)} 
                editable={index==editIndex}
                multiline={true} />
             
                <View style={{ flexDirection: 'row',gap:2 ,justifyContent:'flex-end'}}>
                {(index==editIndex && editable ) && 
                  <Icon name="save" size={20} color="white" onPress={() => editText(item.id)} />
                }
                {(index!=editIndex ) &&   <Icon name="edit" size={20} color="white" onPress={() => readyEdit(index,item)} />}
                  <Icon name="delete" size={20} color="white" onPress={() => remove(item.id)} />
                </View>
              </View>
            }
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
    marginTop: 10
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
    height: 100,
   width:180,
    borderRadius: 10,
    padding: 5,
    margin: 5,
  justifyContent:'space-between',
    
  backgroundColor:'#37324d'
 
  
  }
});

export default App;
