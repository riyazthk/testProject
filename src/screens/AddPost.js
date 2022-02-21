import AsyncStorage from '@react-native-community/async-storage';
import {Formik} from 'formik';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {LaunchCamera} from '../components';
import {Routes} from '../navigation';
import {postApi} from '../services';
import {color, typography} from '../theme';
import {Button, Text, TextField, Vertical} from '../ui-kit';
import {Screen} from '../ui-kit/screen';
import {PostSchema} from '../utils/schema';
import NetInfo from '@react-native-community/netinfo';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';

export const AddPost = ({route}) => {
  const {images = null} = route?.params ?? {};
  const navigation = useNavigation();
  const [token, setToken] = useState(null);
  const [arr_image, setArrImage] = useState(null);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const getLocalToken = async () => {
      setToken(await AsyncStorage.getItem('token'));
    };
    getLocalToken();
  }, []);

  useEffect(() => {
    if (images?.length) {
      setArrImage(images);
    }
  }, [images]);

  const handleCallImage = () => {};

  const handleConnectivityChange = (connection) => {
    setIsConnected(connection.isConnected);
  };

  return (
    <Screen variant={'scroll'}>
      <View style={styles.container}>
        <Formik
          enableReinitialize={true}
          initialValues={{
            title: '',
            category: '46',
            website: 'https://example.com',
            description: '',
            images: '',
          }}
          onSubmit={async (values, {setSubmitting, setErrors, resetForm}) => {
            setSubmitting(true);
            NetInfo.addEventListener(handleConnectivityChange);
            const data = new FormData();
            data.append('title', values.title);
            data.append('category', values.category);
            data.append('media_list', {
              uri: arr_image[0]?.uri,
              type: arr_image[0]?.type,
              name: arr_image[0]?.fileName,
            });
            data.append('website', values.website);
            data.append('description', values.description);

            if (isConnected) {
              postApi(token, data)
                .then((res) => {
                  setSubmitting(false);
                  console.log('res', res?.data);
                  Toast.show('Your post is successfully created');
                  navigation.navigate(Routes.DASHBOARD, {
                    flag: Math.random(),
                    token: token,
                  });
                })
                .catch((e) => {
                  setSubmitting(false);
                  Toast.show('Your post is not successfully created');
                });
            } else {
              let offlinePost = {
                title: values.title,
                category: values.category,
                media_list: arr_image,
                website: values.website,
                description: values.description,
              };
              await AsyncStorage.setItem(
                'offlinePOstData',
                JSON.stringify(offlinePost),
              )
                .then((res) => {
                  console.log('res', res);
                  navigation.navigate(Routes.DASHBOARD, {
                    flag: Math.random(),
                    token: token,
                  });
                })
                .catch((e) => {
                  console.log('e', e);
                });
            }
          }}
          validationSchema={PostSchema()}
          validateOnChange={true}
          validateOnMount={true}
          validateOnBlur={true}>
          {({
            handleChange,
            values,
            isSubmitting,
            errors,
            touched,
            handleBlur,
            setErrors,
            setTouched,
            setFieldValue,
            handleSubmit,
            resetForm,
            setStatus,
            initialValues,
            ...restProps
          }) => (
            <>
              <Text style={styles.title}>Add Post</Text>
              <TextField
                value={values.title}
                // onChangeText={handleChange('mobile_number')}
                onChangeText={(text) => {
                  setFieldValue('title', text);
                }}
                onBlur={handleBlur('title')}
                errorMessage={touched.title && errors.title}
                label={'title'}
                placeholder={'Enter a title'}
                inputStyle={styles.inputStyle}
              />

              <Vertical size={20} />
              <TextField
                value={values.website}
                onChangeText={(text) => {
                  setFieldValue('website', text);
                }}
                onBlur={handleBlur('website')}
                label={'Website'}
                placeholder={'Enter the website'}
                inputStyle={styles.inputStyle}
                errorMessage={touched.website && errors.website}
                errorStyle={{marginTop: 10}}
              />
              <Vertical size={20} />
              <TextField
                value={values.description}
                onChangeText={(text) => {
                  setFieldValue('description', text);
                }}
                onBlur={handleBlur('description')}
                label={'Description'}
                placeholder={'Enter the description'}
                inputStyle={styles.inputStyle}
                errorMessage={touched.description && errors.description}
                errorStyle={{marginTop: 10}}
              />
              <Vertical size={15} />
              <LaunchCamera
                arr_image={arr_image}
                setArrImage={setArrImage}
                handleCallImage={handleCallImage}
                source={Routes.ADDPOST}
              />
              <Button
                title={'Add Post'}
                style={styles.button}
                onPress={handleSubmit}
                loading={isSubmitting}
                disabled={restProps.isValid && images ? false : true}
              />
            </>
          )}
        </Formik>
      </View>
    </Screen>
  );
};
const styles = StyleSheet.create({
  container: {
    marginLeft: 33,
    marginRight: 27,
    flex: 1,
    justifyContent: 'center',
  },
  viewText: {
    marginTop: 19.6,
  },
  inputStyle: {
    height: 36,
    fontSize: 14,
    borderRadius: 5,
    borderColor: color.palette.textInputBorder,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignSelf: 'center',
  },
  button: {
    marginTop: 42,
    height: 60,
  },
  labelStyle: {
    fontFamily: typography.primary,
    textAlign: 'left',
    color: color.palette.black,
  },
  mobileLabel: {
    fontFamily: typography.primary,
    fontSize: 14,
    marginTop: 5,
  },
  errorView: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
  },
  errorText: {
    fontSize: 16,
    fontFamily: typography.secondary,
    color: color.palette.red,
  },
  forgotView: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  icon: {
    height: 27,
    width: 27,
    marginTop: 33,
  },
  footerView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    bottom: 57,
    // marginBottom: 57,
  },
  foo_text: {
    fontFamily: typography.primary,
    fontSize: 18,
    lineHeight: 22.63,
    color: color.palette.black,
  },
  title: {
    fontFamily: typography.secondary,
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 10,
  },
});
