import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Routes} from '.';
import {ViewImages} from '../components';
import {AddPost, Dashboard} from '../screens';

const Stack = createStackNavigator();

export const InsideStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={Routes.DASHBOARD} component={Dashboard} />
      <Stack.Screen name={Routes.ADDPOST} component={AddPost} />
      <Stack.Screen name={Routes.VIEW_IMAGES} component={ViewImages} />
    </Stack.Navigator>
  );
};
