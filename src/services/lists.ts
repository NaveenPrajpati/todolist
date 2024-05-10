import firestore from '@react-native-firebase/firestore';
import {toast} from '../utils/utilityFunctions';

interface ListItem {
  label: string;
  value: string;
}

interface AddListData {
  data: ListItem;
  deviceId: string;
}

// Function to add a new list item
export const addList = async (data1: AddListData, cb: () => void) => {
  const {data, deviceId} = data1;

  try {
    await firestore().collection('Lists').add({
      deviceId: deviceId,
      list: data,
    });
    toast('List added successfully!');
    cb();
  } catch (error) {
    toast('Failed to add list. Please try again.');
    console.error('Error adding list:', error);
  }
};

// Function to retrieve all lists for a specific device
export const getList = async (
  deviceId: string,
  cb: (fetchedList: ListItem[]) => void,
) => {
  try {
    const listsSnapshot = await firestore()
      .collection('Lists')
      .where('deviceId', '==', deviceId)
      .get();

    const fetchedList = listsSnapshot.docs.map(doc => ({
      ...(doc.data().list as ListItem),
    }));

    cb(fetchedList);
  } catch (error) {
    toast('Failed to fetch lists. Please try again.');
    console.error('Error fetching lists:', error);
  }
};
