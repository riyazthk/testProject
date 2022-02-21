import {Formik} from 'formik';
import React, {useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  ToastAndroid,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Screen} from '../../ui-kit/screen';
import {SignInSchema} from '../../utils/schema';
import {Button, Text, TextField, Vertical} from '../../ui-kit';
import {color, typography} from '../../theme';
import {loginApi} from '../../services';
import {useNavigation} from '@react-navigation/native';
import {Routes} from '../../navigation';
import AsyncStorage from '@react-native-community/async-storage';

const windowHeight = Dimensions.get('window').height;
const spaceValidation = new RegExp(/^[^ ]*$/);
const numberValidation = new RegExp(/^[0-9]{0,10}$/);

export const Login = () => {
  const navigation = useNavigation();

  const [showP_icon, setShowP_icon] = useState(
    require('../../assets/icon/view.png'),
  );
  const [hidePassword, setHidePassword] = useState(true);

  const handleIcon = () => {
    if (hidePassword) {
      setHidePassword(false);
      setShowP_icon(require('../../assets/icon/hidePassword.png'));
    } else {
      setHidePassword(true);
      setShowP_icon(require('../../assets/icon/view.png'));
    }
  };

  return (
    <Screen variant={'scroll'}>
      <View style={styles.container}>
        <Formik
          enableReinitialize={true}
          initialValues={{
            user_name: 'developer25',
            password: 'Now@12345',
          }}
          onSubmit={(values, {setSubmitting, setErrors, resetForm}) => {
            setSubmitting(true);
            const payload = {
              username: values.user_name,
              password: values.password,
            };
            loginApi(payload)
              .then((res) => {
                setSubmitting(false);
                AsyncStorage.setItem('token', res?.data?.access);
                navigation.navigate(Routes.INSIDE_STACK, {
                  screen: Routes.DASHBOARD,
                  params: {token: res?.data?.access},
                });
              })
              .catch((e) => {
                setSubmitting(false);
                ToastAndroid.show(
                  'Something went wrong please try again later',
                  ToastAndroid.SHORT,
                );
              });
          }}
          validationSchema={SignInSchema()}
          validateOnChange={true}
          validateOnBlur={true}
          validateOnMount={true}>
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
              <Text style={styles.title}>Login</Text>
              <TextField
                value={values.user_name}
                // onChangeText={handleChange('mobile_number')}
                onChangeText={(text) => {
                  setFieldValue('user_name', text);
                }}
                onBlur={handleBlur('user_name')}
                errorMessage={touched.user_name && errors.user_name}
                label={'User Name'}
                placeholder={'Enter a user name'}
                inputStyle={styles.inputStyle}
              />
              <Vertical size={20} />

              <TextField
                value={values.password}
                onChangeText={(text) => {
                  if (spaceValidation.test(text)) {
                    setFieldValue('password', text);
                  }
                  //   setDisab(false);
                }}
                onBlur={handleBlur('password')}
                label={'Password'}
                placeholder={'Enter the password'}
                inputStyle={styles.inputStyle}
                errorMessage={touched.password && errors.password}
                icon={showP_icon}
                iconStyle={styles.icon}
                secureTextEntry={hidePassword}
                onIconPress={handleIcon}
                errorStyle={{marginTop: 10}}
              />

              <Button
                title={'Login'}
                style={styles.button}
                onPress={handleSubmit}
                loading={isSubmitting}
                disabled={!restProps.isValid}
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
