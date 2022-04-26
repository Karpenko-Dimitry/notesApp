import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { globalStyles } from '../../share/globalStyles';

const color = globalStyles.global.color_ylw;

const styles = StyleSheet.create({
    container: {
        backgroundColor: color,
        elevation: 20,
        borderWidth: 1,
        borderColor: color,
        borderRadius: 7,
        shadowOffset: {
            width: 10,
            height: 10
        },
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    text: {
        paddingVertical: 10,
        textAlign: 'center',
        fontSize: 15,
        letterSpacing: 1,
        color: 'white',
        textTransform: 'uppercase'
    },
});

const Button = ({ title, onPress, style }) => {
    return (
        <TouchableOpacity style={{...styles.container, ...style}} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
};

export default Button;
