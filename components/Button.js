import { Pressable, StyleSheet, Text, useColorScheme } from 'react-native';
import React, { useCallback } from 'react';
import{ darkMode, lightMode } from '../config/theme'
export const Button = ({
  children,
  onPress,
  activeOpacity = 0.3,
  borderless = false,
  title,
  style
}) => {
  const colorScheme = useColorScheme();
  const _style = useCallback(({ pressed }) => [
    style,
    { opacity: pressed ? activeOpacity : 1 }
  ]);

  if (borderless) {
    return (
      <Pressable onPress={onPress} style={_style}>
        <Text style={
          colorScheme == "dark" ? darkMode.Text : lightMode.Text
        }>{title}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={_style}>
      {children}
    </Pressable>
  );
};
