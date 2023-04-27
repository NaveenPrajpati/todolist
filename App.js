import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Button, FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
// import Icon from 'react-native-vector-icons/FontAwesome';

export default function App() {
  let [data, setData] = useState('');
  const [text, setText] = useState([]);
  const inputRef = useRef(null)

  function find(event) {
    setText(pre => [...pre, event.text]);
    event.target.value = ''
    console.log(event.target)
  }

  function submit(event) {
    console.log(data)
    setText(pre => [...pre, data])
    setData('')
    inputRef.current.focus();
  }

  function remove(index) {
    const newdata = [...text]
    newdata.splice(index, 1)
    setText(newdata)
  }

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.inputBox}>
          <TextInput style={styles.inputTag} ref={inputRef} keyboardType='default' placeholder='Enter note' value={data} onChangeText={e => setData(e)} onSubmitEditing={submit} />
          <Icon name="arrow-forward" size={30} color="white" onPress={(eve) => submit(eve)} />
        </View>

        <FlatList style={{marginBottom:30}}
          data={text}
          renderItem={({ item, index }) =>
            <View style={styles.list}>
              <Text style={styles.listItem}>{item}</Text>
              <Icon name="delete-forever" size={30} color="red" onPress={() => remove(index)} />
            </View>
          }
        />

      </View>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar animated={true} backgroundColor='pink'/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    backgroundColor: 'white',
    width: '90%',
    height: '100%',
    borderRadius: 10,
    padding: 20,
    marginTop:100
  },
  inputBox: {
    backgroundColor: 'pink',
    borderRadius: 10,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputTag: {
    height: 50,
    fontSize: 30,
    width:'90%',

  },
  list: {
    backgroundColor: 'lightgray',
    minHeight:40,
    
    borderRadius: 10,
    padding: 5,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center'
  },
  listItem:{
    fontSize: 25,
    width:'90%',
    fontWeight:400,
  }
});
