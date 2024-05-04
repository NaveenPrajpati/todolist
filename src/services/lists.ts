import firestore from '@react-native-firebase/firestore';
import {toast} from '../utils/utilityFunctions';

interface ListItem {
  list: {lable: string; value: string};
  deviceId: string;
}

export const addList = async (data1, cb) => {
  const {data, deviceId} = data1;
  await firestore().collection('Lists').add({
    deviceId: deviceId,
    list: data,
  });
  cb();
};
export const getList = async (deviceId, cb) => {
  try {
    const todosSnapshot = await firestore()
      .collection('Lists')
      .where('deviceId', '==', deviceId)
      .get();

    // const fetchedList = todosSnapshot.docs.map(doc => ({
    //   id: doc.id,
    //   ...(doc.data() as ListItem),
    // }));
    const fetchedList = todosSnapshot.docs.map(doc => ({
      ...doc.data().list,
    }));
    console.log(fetchedList);
    cb(fetchedList);
  } catch (error) {
    console.error(error);
  }
};
