/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
// import {useDispatch} from 'react-redux';
import {Routes} from '../navigation';
// import {uploadPic} from '../redux/slices';

export const LaunchCamera = ({
  arr_image,
  setArrImage,
  handleCallImage,
  source,
}) => {
  const navigation = useNavigation();
  // const dispatch = useDispatch();
  const [deleteItem, setDeleteItem] = useState(false);
  // let listRef = useRef(arr_image);
  // console.log(listRef);

  // useEffect(() => {
  //   setArrImage(arr_image);
  // }, [arr_image, setArrImage]);

  const handleClose = (item, index) => {
    const arr = [...arr_image];
    const r_index = arr.indexOf(index);
    if (r_index >= -1) {
      arr.splice(index, 1);
      setArrImage(arr);
      // dispatch(uploadPic(arr));
    }
    setDeleteItem((deleteItem) => !deleteItem);
  };

  const handleView = (item) => {
    navigation.navigate(Routes.VIEW_IMAGES, {url: item});
  };

  return (
    <>
      <View style={styles.rowView}>
        {arr_image?.length ? (
          <FlatList
            data={arr_image}
            horizontal
            keyExtractor={(item, index) => {
              index.toString();
            }}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    height: 60,
                    width: 60,
                    justifyContent: 'flex-end',
                  }}>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      handleClose(item, index);
                    }}
                    hitSlop={{top: 20, bottom: 20, right: 20, left: 20}}>
                    <Image
                      source={require('../assets/icon/b_close.png')}
                      style={styles.icon}
                    />
                  </TouchableWithoutFeedback>
                  <TouchableOpacity
                    style={{}}
                    onPress={() => {
                      handleView(item);
                    }}>
                    <Image
                      source={{
                        uri: item.uri ?? item,
                      }}
                      style={styles.imageStyle}
                    />
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        ) : (
          // </View>

          <TouchableWithoutFeedback
            onPress={() => {
              handleCallImage();
              navigation.navigate(Routes.LAUNCH_CAMERA_MODAL, {
                source: source,
              });
            }}>
            <Image
              source={require('../assets/icon/add.png')}
              style={{marginTop: 13, height: 50, width: 50}}
            />
          </TouchableWithoutFeedback>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    height: 53,
    width: 53,
    marginRight: 20,
    borderRadius: 4,
  },
  icon: {
    height: 13,
    width: 13,
    position: 'absolute',
    right: 3,
    top: 0,
    // bottom: 0,
    zIndex: 2,
  },
  rowView: {
    flexDirection: 'row',
    // justifyContent: 'flex-start',
    flex: 1,
  },
});
