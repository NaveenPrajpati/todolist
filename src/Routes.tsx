// In App.js in a new project

import React, {useContext, useEffect} from 'react';
import {View, Text, DrawerLayoutAndroid} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import CreateTodo from './pages/CreateTodo';
import Header from './components/Header';
import notifee, {EventType} from '@notifee/react-native';
import {RealmProvider} from '@realm/react';
import {Task} from './models/task';
import {MyContext} from '../App';
import Drawer from './components/Drawer';
import SettingsPage from './pages/SettingsPage';

const Stack = createNativeStackNavigator();

function Routes() {
  const {drawer} = useContext(MyContext);

  // React.useEffect(() => {
  //   return notifee.onForegroundEvent(({type, detail}) => {
  //     switch (type) {
  //       case EventType.DISMISSED:
  //         console.log('User dismissed notification', detail.notification);
  //         break;
  //       case EventType.PRESS:
  //         console.log('User pressed notification', detail.notification);
  //         break;
  //     }
  //   });
  // }, []);

  notifee.onBackgroundEvent(async ({type, detail}) => {
    if (type === EventType.ACTION_PRESS) {
      if (detail.pressAction.id === 'stop') {
        // Handle background navigation or other logic here
        console.log(
          'Notification action received in background: ',
          detail.pressAction.id,
        );
        // You might store this event or handle it according to your app's logic
      }
    }
  });

  async function requestper() {
    await notifee.requestPermission();
  }
  React.useEffect(() => {
    requestper();
  }, []);
  return (
    <NavigationContainer>
      <RealmProvider schema={[Task]}>
        <DrawerLayoutAndroid
          ref={drawer}
          drawerWidth={200}
          renderNavigationView={Drawer}>
          <Stack.Navigator
            screenOptions={{
              header: ({navigation, route, options}) => {
                const title =
                  options.headerTitle !== undefined
                    ? options.headerTitle
                    : route.name;
                return <Header title={title} />;
              },
            }}>
            <Stack.Screen
              name="Home"
              options={{headerTitle: ''}}
              component={HomeScreen}
            />
            <Stack.Screen
              name="CreateTodo"
              options={{headerTitle: 'Add Task Details'}}
              component={CreateTodo}
            />
            <Stack.Screen
              name="SettingsPage"
              options={{headerTitle: 'Settings'}}
              component={SettingsPage}
            />
          </Stack.Navigator>
        </DrawerLayoutAndroid>
      </RealmProvider>
    </NavigationContainer>
  );
}

export default Routes;
