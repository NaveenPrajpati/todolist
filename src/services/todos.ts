import {Keyboard} from 'react-native';
import {toast} from '../utils/utilityFunctions';
import firestore from '@react-native-firebase/firestore';

export const addData = async (data1, cb) => {
  const {
    data,
    descriptions = [],
    deviceId = '',
    list = '',
    dueDate = '',
  } = data1;
  console.log(data);
  if (data == '') {
    toast('Add Task Please');
    return;
  }
  try {
    await firestore().collection('Todos').add({
      text: data,
      descriptions: descriptions,
      completed: false,
      createdAt: firestore.Timestamp.now(),
      deviceId: deviceId,
      lists: list,
      dueData: dueDate,
    });
    toast('Todo added!');
    Keyboard.dismiss();
    cb();
  } catch (error) {
    toast('Failed to add Task. Try again.');
    console.error('Error adding document: ', error);
  } finally {
  }
};

export const toggleCompletion = async (data1, cb) => {
  const {id, completed} = data1;
  await firestore().collection('Todos').doc(id).update({
    completed: !completed,
  });
  toast('Todo status updated!');
  cb();
};
