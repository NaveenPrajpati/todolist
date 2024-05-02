import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
import {getUniqueId} from 'react-native-device-info';
import {useNavigation} from '@react-navigation/native';

const CreateTodo = () => {
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const addData = async () => {
    if (data.trim() === '') {
      ToastAndroid.show(
        'Please enter some text for the to-do.',
        ToastAndroid.SHORT,
      );
      return;
    }

    setLoading(true);

    try {
      await firestore().collection('Todos').add({
        text: data,
        completed: false,
        createdAt: firestore.Timestamp.now(),
        deviceId: getUniqueId(),
      });
      ToastAndroid.show('Todo added!', ToastAndroid.BOTTOM);
      setData(''); // Clear the input field
      navigation.goBack(); // Navigate back to the previous screen
    } catch (error) {
      ToastAndroid.show(
        'Failed to add the to-do. Try again.',
        ToastAndroid.SHORT,
      );
      console.error('Error adding document: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{backgroundColor: '#EFEFEF', flex: 1}}>
      <View style={styles.header}>
        <Icon
          name="arrowleft"
          size={30}
          color="white"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Add Todo</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Add your content"
          multiline
          onChangeText={setData}
          value={data}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={addData}
          style={styles.addButton}
          disabled={loading}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateTodo;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#6200ee',
    elevation: 2,
  },
  headerTitle: {
    fontWeight: '700',
    marginLeft: 20,
    fontSize: 20,
    color: 'white',
  },
  inputContainer: {
    margin: 10,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    fontSize: 18,
    padding: 20,
    marginVertical: 5,
    elevation: 2,
  },
  addButton: {
    backgroundColor: 'purple',
    padding: 10,
    width: '100%',
    borderRadius: 8,
    marginVertical: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
  },
});
