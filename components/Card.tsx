import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'small' | 'medium' | 'large';
}

export default function Card({ children, style, padding = 'medium' }: CardProps) {
  return (
    <View style={[styles.card, styles[padding], style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    marginVertical: 5,
  },
  small: {
    padding: 10,
  },
  medium: {
    padding: 15,
  },
  large: {
    padding: 20,
  },
});