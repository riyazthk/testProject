import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {View} from 'react-native';
import {Routes} from '.';
import {Login} from '../screens';

const Stack = createStackNavigator();

export const OutsideStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={Routes.LOGIN} component={Login} />
    </Stack.Navigator>
  );
};
