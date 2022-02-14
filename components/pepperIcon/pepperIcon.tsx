import React from 'react';
import { Text } from 'react-native';
import { useFonts } from 'expo-font';
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import { black } from '../../styles/common';

const ReactIcon = createIconSetFromIcoMoon(
  require('../../assets/selection.json'),
  'IcoMoon',
  'icomoon.ttf'
);

// This is a generic component and style can actually be anything
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PepperIcon = (iconProps: { name: string, size: number, color?: string, style?: any}): JSX.Element => {
  // Load the icon font before using it
  // disabling lint as it is an external library that forces the use of PascalCase
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [fontsLoaded] = useFonts({ IcoMoon: require('../../assets/fonts/icomoon.ttf') });
  if (!fontsLoaded) {
    // TODO: put default icon
    return <><Text>Loading...</Text></>;
  }

  return (
    <ReactIcon name={iconProps.name} size={iconProps.size} color={iconProps.color ? iconProps.color : black} style={iconProps.style} />
  );
};

export default PepperIcon;
