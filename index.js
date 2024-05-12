/**
 * @format
 */

import {AppRegistry} from 'react-native';
import notifee, {EventType} from '@notifee/react-native';
import App from './App';
import firestore from '@react-native-firebase/firestore';
import {name as appName} from './app.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

firestore().settings({
  persistence: true,
});

notifee.onBackgroundEvent(async ({type, detail}) => {
  if (type === EventType.ACTION_PRESS) {
    if (detail.pressAction.id === 'stop') {
      // Handle background navigation or other logic here
      console.log(
        'Notification action received in background: ',
        detail.pressAction.id,
      );
      await AsyncStorage.setItem('NAVIGATION_INTENT', detail.pressAction.id);
      // You might store this event or handle it according to your app's logic
    }
  }
});

AppRegistry.registerComponent(appName, () => App);
