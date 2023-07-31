
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Text
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import styles, {color} from './components/style';
import LoginScreen from './components/LoginScreen';

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={color.statusBarColor} barStyle={'light-content'}/>
        <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name='Login' component={LoginScreen} options={{headerShown: false}} />
        </Stack.Navigator>
        </NavigationContainer>
    </SafeAreaView>
  );
}
