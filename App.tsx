/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

function App(): JSX.Element {
  let [data, setData] = useState('');
    const [text, setText] = useState([]);
    const inputRef = useRef(null)

    const [isConnected, setIsConnected] = useState(false);

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


    // useEffect(() => {
    //   const connectedRef = database().ref('.info/connected');
    //   connectedRef.on('value', snapshot => {
    //     setIsConnected(snapshot.val());
    //   });
    // }, []);
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
     <View>
     {isConnected ? (
       <Text>Connected to Firebase Realtime Database</Text>
     ) : (
       <Text>Not connected to Firebase Realtime Database</Text>
     )}
   </View>
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

export default App;
