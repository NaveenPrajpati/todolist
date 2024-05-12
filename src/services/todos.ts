import {Keyboard} from 'react-native';
import {toast} from '../utils/utilityFunctions';
import firestore from '@react-native-firebase/firestore';
import {onDisplayNotification, scheduleNotification} from './pushNotification';

interface TodoData {
  id?: string;
  data: string;
  descriptions?: string[];
  deviceId?: string;
  list?: string;
  dueDate?: string;
  completed?: boolean;
}

export const addData = async (data1: TodoData, cb: () => void) => {
  const {
    data,
    descriptions = [],
    deviceId = '',
    list = '',
    dueDate = '',
  } = data1;

  if (data.trim() === '') {
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
      dueDate: dueDate,
    });
    toast('Todo added!');
    onDisplayNotification({text: data, dueDate: dueDate});
    Keyboard.dismiss();
    cb();
  } catch (error) {
    toast('Failed to add Task. Try again.');
    console.error('Error adding document:', error);
  }
};

export const toggleCompletion = async (
  data1: {id: string; completed: boolean},
  cb: () => void,
) => {
  const {id, completed} = data1;

  try {
    await firestore().collection('Todos').doc(id).update({
      completed: !completed,
    });
    toast('Todo status updated!');
    cb();
  } catch (error) {
    toast('Error updating Todo status');
    console.error('Error updating document:', error);
  }
};

export const editTodo = async (data1: TodoData, cb: () => void) => {
  const {
    id,
    data,
    descriptions = [],
    deviceId = '',
    list = '',
    dueDate = '',
  } = data1;

  if (!id) {
    toast('Invalid Todo ID');
    return;
  }

  try {
    await firestore().collection('Todos').doc(id).update({
      text: data,
      descriptions: descriptions,
      completed: false,
      createdAt: firestore.Timestamp.now(),
      deviceId: deviceId,
      lists: list,
      dueDate: dueDate,
    });
    toast('Todo updated!');
    cb();
  } catch (error) {
    toast('Update Failed');
    console.error('Error updating document:', error);
  }
};

export const removeTodo = async (data: string[], cb: () => void) => {
  const batch = firestore().batch();

  try {
    data.forEach(id => {
      const docRef = firestore().collection('Todos').doc(id);
      batch.delete(docRef);
    });

    await batch.commit();
    toast('Todos deleted successfully!');
    cb();
  } catch (error) {
    toast('Error deleting Todos');
    console.error('Error deleting documents:', error);
  }
};
