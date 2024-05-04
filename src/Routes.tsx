// In App.js in a new project

import * as React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import CreateTodo from './pages/CreateTodo';
import Header from './components/Header';

const Stack = createNativeStackNavigator();

function Routes() {
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
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CreateTodo" component={CreateTodo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Routes;
