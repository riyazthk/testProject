import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {View} from 'react-native';
import {Routes} from '.';
import {Text} from '../ui-kit';

// const Stack = createStackNavigator();
export const BaseNavigation = () => {
  return (
    // <NavigationContainer>
    //   <Stack.Navigator
    //     screenOptions={{
    //       headerShown: false,
    //       presentation: 'transparentModal',
    //     }}>
    //     <Stack.Screen name={Routes.OUTSIDE_STACK} component={OutsideStack} />
    //     <Stack.Screen name={Routes.INSIDE_STACK} component={InsideStack} />
    //   </Stack.Navigator>
    // </NavigationContainer>
    <View>
      <Text>Hello</Text>
    </View>
  );
};
