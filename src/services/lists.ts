import firestore from '@react-native-firebase/firestore';
import {toast} from '../utils/utilityFunctions';

export const addList = async (id, data, cb) => {
  await firestore().collection('Todos').doc(id).update({
    lists: data,
  });
  cb();
};
export const getList = async (id, setData) => {
  try {
    await firestore().collection('Lists').get();
    toast('List added!');
    setData('');
  } catch (error) {
    toast('Failed to add the list Try again.');
    console.error('Error adding List', error);
  } finally {
  }
};
