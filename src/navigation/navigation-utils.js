import {color} from '../theme';

export const dialogOptions = {
  headerShown: false,
  cardStyle: {backgroundColor: 'transparent'},
  cardOverlayEnabled: true,
  cardStyleInterpolator: ({current: {progress}}) => ({
    cardStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    },
    overlayStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
        extrapolate: 'clamp',
      }),
      backgroundColor: color.palette.black,
    },
  }),
};
