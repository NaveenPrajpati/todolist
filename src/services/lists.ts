import firestore from '@react-native-firebase/firestore';
import {toast} from '../utils/utilityFunctions';
import {fetch} from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      ...doc.data().list,
    }));
    cb(fetchedList);
  } catch (error) {
    toast('Failed to fetch lists. Please try again.');
    console.error('Error fetching lists:', error);
  }
};

export const syncOfflineLists = async () => {
  const offlineLists = await AsyncStorage.getItem('offlineLists');
  if (!offlineLists) return;

  try {
    const lists = JSON.parse(offlineLists);
    const batch = firestore().batch();

    lists.forEach(({deviceId, list}) => {
      const docRef = firestore().collection('Lists').doc();
      batch.set(docRef, {deviceId, list});
    });

    await batch.commit();
    await AsyncStorage.removeItem('offlineLists');
    toast('Offline lists synced successfully!');
  } catch (error) {
    toast('Failed to sync offline lists.');
    console.error('Error syncing offline lists:', error);
  }
};
