import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';

interface LoadingSpinnerProps {
    size?: 'small' | 'large';
    color?: string;
    text?: string;
}

export default function LoadingSpinner({
    size = 'large',
    color = '#9900ffff',
    text = 'Loading...',
}: LoadingSpinnerProps) {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={color} />
            {text && <Text style={styles.text}>{text}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    text: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
});