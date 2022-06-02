import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { globalStyles } from '../../share/globalStyles';

const defaultColor = globalStyles.global.color_ylw;

const Button = ({ title, onPress, style, type = "yellow" }) => {
    let color = 'white';
    let bg = defaultColor;

    switch(type) {
        case "white": {
            color = 'black',
            bg = 'white'
        }
    }
    const styles = StyleSheet.create({
        container: {
            backgroundColor: bg,
            elevation: 20,
            borderWidth: 1,
            borderColor: bg,
            borderRadius: 7,
            shadowOffset: {
                width: 5,
                height: 5
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
            color: color,
            textTransform: 'uppercase'
        },
    });

    return (
        <TouchableOpacity style={{...styles.container, ...style}} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
};

export default Button;
