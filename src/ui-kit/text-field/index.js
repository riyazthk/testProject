/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from 'react-native';
import {color, spacing, typography} from '../../theme';
import {Text} from '../text';
import {mergeAll, flatten} from 'ramda';
import {Loader} from '..';

// the base styling for the container
const CONTAINER = {height: 85};

// the base styling for the TextInput
const INPUT = {
  fontFamily: typography.primary,
  color: color.palette.black,
  minHeight: 56,
  // minHeight: 6,
  fontSize: 19,
  backgroundColor: color.palette.white,

  paddingLeft: 11,
  paddingRight: 40,
  flexDirection: 'row',
  flex: 1,
  paddingVertical: 0,
};

// Currently no variations
const VARIATIONS = {
  bordered: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.palette.hairLineColor,
    borderRadius: 4,
  },
  underline: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: color.palette.hairLineColor,
  },
  danger: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'red',
    borderRadius: 4,
  },
  disabled: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.palette.hairLineColor,
    borderRadius: 10,
    backgroundColor: color.palette.switchBackgroundColor,
  },
};

const LABEL = {
  marginBottom: 12,
  fontSize: 16,
  color: color.palette.dark_grey2,
  lineHeight: 20.11,
  // marginRight: 10,
};

const ERROR = {
  borderColor: color.palette.red,
};

const RIGHT_CONTAINER = {
  height: '100%',
  aspectRatio: 0.5,
  justifyContent: 'center',
  position: 'absolute',
  right: 5,
};

const ICON = {
  width: 15,
  height: 15,
  marginLeft: 7,
};

const ERROR_CONTAINER = {
  marginTop: 0.5,
  fontSize: 12,
};

const RIGHT_PADDING = {
  paddingRight: spacing[4],
};

const borderError = {
  position: 'absolute',
  bottom: -20,
};

const enhance = (style, styleOverride) => {
  return mergeAll(flatten([style, styleOverride]));
};

/**
 * A component which has a label and an input together.
 *
 * placeholder - The Placeholder text if no placeholder is provided.
 *
 * label - The label text
 *
 * style - Optional container style overrides useful for margins & padding.
 *
 * inputStyle - Optional style overrides for the input.
 *
 * variant - (bordered | underline)
 *
 * labelStyle - Optional style overrides for the label.
 *
 * errorMessage - Error message to display at the bottom of the text field
 *                This will automatically change the color of border or underline to red
 *
 * icon - Right icon on text input
 *
 * onIconPress - Callback to call on right icon
 *
 * required - This wil put red start at the label and make the field required to fill
 *
 * forwardedRef
 */
export function TextField(props) {
  const {
    placeholder,
    variant = 'bordered',
    style: styleOverride,
    inputStyle: inputStyleOverride,
    iconStyle: iconStyleOverride,
    errorStyle: errorStyleOver,
    containerStyle: containerStyleOverride,
    forwardedRef,
    errorMessage,
    onIconPress = () => {},
    icon,
    label,
    disabled,
    labelStyle: labelStyleOverride,
    required,
    loading,
    lftSymbol,
    autoCompleteOff = true,
    greenTick,
    checkVerify,
    v_title,
    v_press,
    v_load,

    ...rest
  } = props;

  let errorStyleOverride = errorMessage ? ERROR : {};

  let containerStyle = enhance(CONTAINER, containerStyleOverride);

  let inputStyle = enhance(
    {...INPUT, ...VARIATIONS[variant]},
    inputStyleOverride,
  );

  inputStyle = enhance(inputStyle, errorStyleOverride);

  let iconStyle = enhance(ICON, iconStyleOverride);

  let labelStyle = enhance(LABEL, labelStyleOverride);

  let errorStyle =
    variant === 'bordered'
      ? enhance(ERROR_CONTAINER, borderError, errorStyleOver)
      : enhance(ERROR_CONTAINER, errorStyleOver);

  let isRightPaddingRequired = icon || loading;

  return (
    // <TouchableOpacity
    //   onPress={() => {
    //     console.log('enry');
    //     onPress();
    //   }}>
    <View style={[containerStyle]}>
      {label && (
        <View style={{flexDirection: 'row'}}>
          <Text variant={'fieldLabel'} style={labelStyle} numberOfLines={1}>
            {label}
          </Text>

          {required && label && <Text variant={'fieldError'}>*</Text>}

          {checkVerify && (
            <View
              style={
                v_load
                  ? [styles.verify, {backgroundColor: color.palette.white}]
                  : styles.verify
              }>
              <TouchableOpacity
                onPress={() => {
                  v_press();
                }}
                hitSlop={{top: 20, bottom: 20, right: 20, left: 20}}>
                {v_load ? (
                  <Loader loaderStyle={{paddingBottom: 0}} />
                ) : (
                  <Text style={styles.v_text}>{v_title}</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      <View style={{flexDirection: 'row', flex: 1}}>
        {lftSymbol && (
          <Text
            style={{
              marginTop: 6,
              fontSize: 18,
              fontFamily: typography.secondary,
              // backgroundColor:disabled?:color.palette
            }}>
            ₹
          </Text>
        )}
        <View style={{flex: 1}}>
          <TextInput
            placeholder={placeholder}
            placeholderTextColor={color.palette.warmGrey}
            underlineColorAndroid={color.transparent}
            {...rest}
            editable={!disabled}
            style={[inputStyle, !isRightPaddingRequired && RIGHT_PADDING]}
            ref={forwardedRef}
            autoCorrect={false}
            allowFontScaling={false}
            // onFocus={() => {
            //   onPress();
            // }}
            {...(autoCompleteOff && {autoCompleteType: 'off'})}
          />
        </View>
      </View>
      {!loading ? (
        icon && (
          <TouchableOpacity
            style={RIGHT_CONTAINER}
            activeOpacity={0.8}
            hitSlop={{top: 15, left: 15, bottom: 15, right: 15}}
            onPress={onIconPress}>
            <Image source={icon} style={iconStyle} resizeMode={'contain'} />
          </TouchableOpacity>
        )
      ) : (
        <View style={RIGHT_CONTAINER}>
          <ActivityIndicator color={color.primary} size={'small'} />
        </View>
      )}
      {/* </View> */}
      {!!errorMessage && (
        <Text variant="fieldError" style={errorStyle}>
          {errorMessage.includes('server') || errorMessage.includes('undefined')
            ? null
            : errorMessage}
        </Text>
      )}
    </View>
    // </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  check: {
    height: 12,
    width: 12,
    // position: 'absolute',
    // left: 110,
    // top: 5,
    marginTop: 5,
    marginLeft: 5,
  },
  verify: {
    marginLeft: 5,
    backgroundColor: color.palette.brown,
    height: 23,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
  },
  v_text: {
    fontFamily: typography.secondary,
    fontSize: 12,
    lineHeight: 15.08,
    color: color.palette.white,
  },
});
