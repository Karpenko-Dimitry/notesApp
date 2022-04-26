import React from "react";
import {View, Text, StyleSheet} from 'react-native';

const FormError = ({errors, style, align = 'left'}) => {
    
    return (
        <View>
            {Array.isArray(errors) && errors.map((error, index) => {
                return (
                    <Text style={styles.text} key={index}>{error}</Text>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        color: 'red'
    }
});

export default FormError;