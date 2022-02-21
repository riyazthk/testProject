import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {InsideStack, OutsideStack, Routes} from '.';
import {dialogOptions} from '.';
import {LaunchCameraModal} from '../screens';

export const RootNavigation = () => {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          presentation: 'transparentModal',
        }}>
        <Stack.Screen name={Routes.OUTSIDE_STACK} component={OutsideStack} />
        <Stack.Screen name={Routes.INSIDE_STACK} component={InsideStack} />
        <Stack.Screen
          name={Routes.LAUNCH_CAMERA_MODAL}
          component={LaunchCameraModal}
          options={dialogOptions}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
