import {Keyboard} from 'react-native';
import {toast} from '../utils/utilityFunctions';
import firestore from '@react-native-firebase/firestore';
import {onDisplayNotification} from './pushNotification';
import {fetch} from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const connection = await fetch();

  if (!connection.isConnected) {
    // Handle offline case: Store data in AsyncStorage
    try {
      const offlineData = await AsyncStorage.getItem('offlineTodos');
      const todos = offlineData ? JSON.parse(offlineData) : [];
      todos.push({
        text: data,
        descriptions: descriptions,
        completed: false,
        createdAt: new Date().toISOString(), // Using ISO string for simplicity
        deviceId: deviceId,
        lists: list,
        dueDate: dueDate,
      });
      await AsyncStorage.setItem('offlineTodos', JSON.stringify(todos));
      toast('Task saved locally!');
      Keyboard.dismiss();
      cb();
    } catch (error) {
      toast('Failed to save task locally.');
      console.error('Error saving offline task:', error);
    }
  } else {
    // Handle online case: Store data in Firestore
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
  }
};
export const toggleCompletion = async (
  data1: {id: string; completed: boolean},
  cb: () => void,
) => {
  const {id, completed} = data1;

  const connection = await fetch();

  if (!connection.isConnected) {
    // Handle offline case: Store update locally
    try {
      const offlineUpdates = await AsyncStorage.getItem('offlineTodos');
      const updates = offlineUpdates ? JSON.parse(offlineUpdates) : [];
      updates.push({id, completed: !completed, type: 'toggleCompletion'});
      await AsyncStorage.setItem('offlineTodos', JSON.stringify(updates));
      toast('Todo status change saved locally!');
      cb();
    } catch (error) {
      toast('Error updating Todo status locally');
      console.error('Error storing offline update:', error);
    }
  } else {
    // Handle online case: Update Firestore
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

  const connection = await fetch();

  if (!connection.isConnected) {
    // Handle offline case: Store updates locally
    try {
      const offlineEdits = await AsyncStorage.getItem('offlineTodos');
      const edits = offlineEdits ? JSON.parse(offlineEdits) : [];
      edits.push({
        id,
        updates: {
          text: data,
          descriptions,
          completed: false,
          createdAt: new Date().toISOString(),
          deviceId,
          lists: list,
          dueDate,
        },
      });
      await AsyncStorage.setItem('offlineTodos', JSON.stringify(edits));
      toast('Todo update saved locally!');
      cb();
    } catch (error) {
      toast('Failed to store update locally.');
      console.error('Error storing offline edit:', error);
    }
  } else {
    // Handle online case: Update Firestore
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
  }
};

export const removeTodo = async (data: string[], cb: () => void) => {
  const connection = await fetch();

  if (!connection.isConnected) {
    // Handle offline case: Store deletion requests locally
    try {
      const offlineDeletions = await AsyncStorage.getItem('offlineTodos');
      const deletions = offlineDeletions ? JSON.parse(offlineDeletions) : [];
      deletions.push(...data.map(id => ({id})));
      await AsyncStorage.setItem('offlineTodos', JSON.stringify(deletions));
      toast('Deletion saved locally!');
      cb();
    } catch (error) {
      toast('Error storing deletion locally');
      console.error('Error storing offline deletion:', error);
    }
  } else {
    // Handle online case: Delete from Firestore
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
  }
};

export const syncData = async cb => {
  const localData = await AsyncStorage.getItem('offlineTodos');
  if (!localData) return;

  const todos = JSON.parse(localData);
  const batch = firestore().batch();

  todos.forEach(todo => {
    const docRef = firestore().collection('Todos').doc(todo.id);
    batch.set(docRef, todo);
  });

  try {
    await batch.commit();
    await AsyncStorage.removeItem('offlineTodos'); // Clear local storage after syncing
    console.log('Data synced and local storage cleared!');
    cb();
  } catch (error) {
    console.error('Error syncing data:', error);
  }
};
