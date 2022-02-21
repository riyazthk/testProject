/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {Dimensions, Image, View} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {color} from '../theme';
import ImageViewer from 'react-native-image-zoom-viewer';

const width = Dimensions.get('window').width;
export const ViewImages = ({route}) => {
  const {url} = route?.params ?? {};
  const navigation = useNavigation();
  const images = [
    {
      // Simplest usage.
      url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460',

      // width: number
      // height: number
      // Optional, if you know the image size, you can set the optimization performance

      // You can pass props to <Image />.
      props: {
        // headers: ...
      },
    },
    // {
    //   url: '',
    //   props: {
    //     // Or you can set source directory.
    //     // source: require('../background.png'),
    //   },
    // },
  ];
  return (
    <View
      style={{flex: 1, backgroundColor: color.palette.black, paddingTop: 30}}>
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.goBack();
        }}>
        <Image
          source={require('../assets/icon/b_close.png')}
          style={{
            tintColor: color.palette.white,
            alignSelf: 'flex-end',
            height: 30,
            width: 30,
          }}
        />
      </TouchableWithoutFeedback>
      <View
        style={{
          flex: 1,
          backgroundColor: color.palette.black,
          justifyContent: 'center',
        }}>
        <ImageViewer
          // imageUrls={{uri: url?.uri ?? url}}
          imageUrls={[
            {
              url: url?.uri ?? url,
            },
          ]}
          style={{resizeMode: 'cover', width: width, height: 500}}
        />
      </View>
    </View>
  );
};
