/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomePage from './HomeScreen.js';
import DataViewer from './DataViewer.js';
import ResultViewer from './ResultViewer.js';
const Stack = createStackNavigator();
function RootStack() {
  return (
    <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ gestureEnabled: false }}
    >
      <Stack.Screen
        name="Home"
        component={HomePage}
        options={{ title: 'Jibaboom', headerShown: false}}
      />
      <Stack.Screen
        name="DataViewer"
        component={DataViewer}
        options={{ title: 'Data Viewer' }}
      />
      <Stack.Screen
        name="ResultViewer"
        component={ResultViewer}
        options={{ title: 'Result Viewer' }}
      />
    </Stack.Navigator>
    </NavigationContainer>
  );
}
export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}