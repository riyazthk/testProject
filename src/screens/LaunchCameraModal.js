/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import {useDispatch, useSelector} from 'react-redux';
import {lang} from '../redux/selectors';
import {uploadPic} from '../redux/slices';
import {color, typography} from '../theme';
import {Button, Loader, Text} from '../ui-kit';

const windowWidth = Dimensions.get('window').width;
export const LaunchCameraModal = ({route}) => {
  const {source, profilePhoto} = route?.params ?? {};
  // const dashstore = useSelector((state) => state.dashboard);
  const navigation = useNavigation();
  // const language = useSelector(lang);
  // const lan_keys = language?.BuySell;
  // const dispatch = useDispatch();
  const [captureImage, setCaptureImage] = useState([]);
  const [up_load, setUPLoad] = useState(false);
  const [tp_load, setTPLoad] = useState(false);

  useEffect(() => {
    if (profilePhoto) {
      setCaptureImage();
    }
  }, [profilePhoto]);

  const handleTakePic = () => {
    setTPLoad(true);
    const optoins = {
      mediaType: 'photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    let array = captureImage?.length > 0 ? captureImage : [];
    array = Object.assign([], array);
    launchCamera(optoins, (res) => {
      if (res.didCancel) {
        setTPLoad(false);
        console.log('User cancelled image picker');
      } else if (res.error) {
        setTPLoad(false);
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        setTPLoad(false);
        console.log('User tapped custom button: ', res.customButton);
      } else {
        res?.assets.map((item, index) => {
          array.push(item);
        });
        setCaptureImage(array);
        // dispatch(uploadPic(array));
        setTPLoad(false);
        navigation.navigate(source, {images: array});
      }
    });
  };

  const handleUploadPhoto = () => {
    setUPLoad(true);
    const options = {
      mediaType: 'photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      selectionLimit: profilePhoto ? 1 : 0,
    };
    let array = captureImage?.length > 0 ? captureImage : [];
    array = Object.assign([], array);
    launchImageLibrary(options, (res) => {
      if (res.didCancel) {
        setUPLoad(false);
        console.log('User cancelled image picker');
      } else if (res.error) {
        setUPLoad(false);
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        setUPLoad(false);
        console.log('User tapped custom button: ', res.customButton);
      } else {
        console.log('res', res);
        res?.assets.map((item, index) => {
          array.push(item);
        });
        setCaptureImage(array);

        setUPLoad(false);
        navigation.navigate(source, {images: array});
      }
    });
  };

  return (
    <TouchableOpacity style={styles.container} activeOpacity={1}>
      <View style={styles.dialog}>
        <View style={styles.messageView}>
          <TouchableOpacity
            style={styles.close}
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              source={require('../assets/icon/b_close.png')}
              style={styles.image}
              hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
            />
          </TouchableOpacity>
          <Text style={styles.text}>{'Choose image from'}</Text>
          <View style={styles.btnView}>
            <TouchableWithoutFeedback
              onPress={() => {
                handleTakePic();
              }}>
              <View style={styles.rowView}>
                {/* {!tp_load ? (
                  <>
                    <Image
                      source={require('../assets/icon/camera.png')}
                      style={styles.icon}
                    />
                    <Text style={styles.btnText}>{'Camera'}</Text>
                  </>
                ) : (
                  <Loader
                    loaderStyle={{paddingBottom: 0}}
                    style={{
                      backgroundColor: 'transparent',
                    }}
                    color={color.palette.white}
                  />
                )} */}
                <>
                  <Image
                    source={require('../assets/icon/camera.png')}
                    style={styles.icon}
                  />
                  <Text style={styles.btnText}>{'Camera'}</Text>
                </>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                handleUploadPhoto();
              }}>
              <View
                style={[
                  styles.rowView,
                  {backgroundColor: color.palette.brown},
                ]}>
                {/* {!up_load ? (
                  <>
                    <Image
                      source={require('../assets/icon/gallery.png')}
                      style={styles.icon}
                    />
                    <Text style={[styles.btnText]}>{'Gallery'}</Text>
                  </>
                ) : (
                  <Loader
                    loaderStyle={{paddingBottom: 0}}
                    style={{
                      backgroundColor: 'transparent',
                    }}
                    color={color.palette.white}
                  />
                )} */}
                <>
                  <Image
                    source={require('../assets/icon/gallery.png')}
                    style={styles.icon}
                  />
                  <Text style={[styles.btnText]}>{'Gallery'}</Text>
                </>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  dialog: {
    width: windowWidth / 1.3,
    backgroundColor: 'white',
    borderRadius: 7,
    flex: 0.33,
  },
  messageView: {flex: 1, alignItems: 'center'},
  image: {
    height: 13,
    width: 13,
    alignSelf: 'flex-end',
    marginRight: 15,
    marginTop: 17,
  },
  btn: {
    height: 40,
    marginBottom: 12,
  },
  btnView: {justifyContent: 'center', flex: 1},
  btnText: {
    fontFamily: typography.secondary,
    fontSize: 16,
    lineHeight: 20,
    color: color.palette.white,
  },
  close: {
    alignSelf: 'flex-end',
  },
  rowView: {
    flexDirection: 'row',
    backgroundColor: color.palette.btnColor,
    width: 131,
    height: 42,
    borderRadius: 6,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    height: 22,
    width: 22,
    tintColor: color.palette.white,
  },
  text: {
    fontFamily: typography.primary,
    fontSize: 16,
    lineHeight: 20.11,
  },
});
