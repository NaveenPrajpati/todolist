/**
 * @format
 */

import {AppRegistry} from 'react-native';
import notifee, {EventType} from '@notifee/react-native';
import App from './App';
import firestore from '@react-native-firebase/firestore';
import {name as appName} from './app.json';

firestore().settings({
  persistence: true,
});

AppRegistry.registerComponent(appName, () => App);
