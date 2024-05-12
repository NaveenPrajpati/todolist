// In App.js in a new project

import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import CreateTodo from './pages/CreateTodo';
import Header from './components/Header';
import notifee, {EventType} from '@notifee/react-native';

const Stack = createNativeStackNavigator();

function Routes() {
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
          options={{headerTitle: 'My Todos'}}
          component={HomeScreen}
        />
        <Stack.Screen
          name="CreateTodo"
          options={{headerTitle: 'Add Task Details'}}
          component={CreateTodo}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Routes;
