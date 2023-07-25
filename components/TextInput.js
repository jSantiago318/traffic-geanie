import { TextInput as RNTextInput, useColorScheme } from 'react-native';
import { darkMode, lightMode } from '../config';

import { Button } from './Button';
import { Icon } from './Icon';
import React from 'react';
import { View } from './View';

export const TextInput = ({
  width = '100%',
  leftIconName,
  rightIcon,
  handlePasswordVisibility,
  ...otherProps
}) => {
  const colorScheme = useColorScheme();
  return (
    <View
      style={colorScheme == 'dark' ? darkMode.TextInput : lightMode.TextInput}
    >
      {leftIconName ? (
        <Icon
          name={leftIconName}
          size={22}
          color={'grey'}
          style={{ marginRight: 10 }}
        />
      ) : null}
      <RNTextInput
        style={{
          flex: 1,
          width: '100%',
          fontSize: 18,
          color: 'black'
        }}
        placeholderTextColor={'grey'}
        {...otherProps}
      />
      {rightIcon ? (
        <Button onPress={handlePasswordVisibility}>
          <Icon
            name={rightIcon}
            size={22}
            color={'grey'}
            style={{ marginRight: 10 }}
          />
        </Button>
      ) : null}
    </View>
  );
};
