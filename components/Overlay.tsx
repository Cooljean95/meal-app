import React from 'react';
import { View, Modal, StyleSheet, TouchableWithoutFeedback, Dimensions } from 'react-native';

interface OverlayProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  animationType?: 'fade' | 'slide' | 'none';
  transparent?: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Overlay({
  visible,
  onClose,
  children,
  animationType = 'fade',
  transparent = true,
}: OverlayProps) {
  return (
    <Modal
      animationType={animationType}
      transparent={transparent}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.container}>{children}</View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    maxWidth: screenWidth * 0.9,
    maxHeight: screenHeight * 0.8,
    minWidth: screenWidth * 0.7,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
