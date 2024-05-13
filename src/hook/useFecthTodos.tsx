import React, {useCallback} from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const useFetchTodos = (deviceId, setTodos, setLoading) => {
  const fetchData = useCallback(async () => {
    if (!deviceId) return;

    setLoading(true);
    const connection = await NetInfo.fetch();

    if (connection.isConnected) {
      // Device is online, fetch only from Firestore
      const unsubscribe = firestore()
        .collection('Todos')
        .where('deviceId', '==', deviceId)
        .onSnapshot(
          async snapshot => {
            const todosData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setTodos(todosData);
            setLoading(false);
          },
          err => {
            console.error('Error fetching todos:', err);
            setLoading(false);
          },
        );

      return () => unsubscribe();
    } else {
      // Device is offline, fetch from Firestore cache and AsyncStorage
      const snapshotPromise = firestore()
        .collection('Todos')
        .where('deviceId', '==', deviceId)
        .get({source: 'cache'}); // Ensures data comes from Firestore cache

      const storagePromise = AsyncStorage.getItem('offlineTodos');

      Promise.all([snapshotPromise, storagePromise])
        .then(([snapshot, storedTodos]) => {
          let todosData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          if (storedTodos) {
            const additionalTodos = JSON.parse(storedTodos);
            todosData = todosData.concat(additionalTodos);
          }

          setTodos(todosData);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching offline data:', err);
          setLoading(false);
        });
    }
  }, [deviceId, setTodos, setLoading]);

  // Automatically fetch on mount and deviceId change
  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return fetchData;
};

export default useFetchTodos;
