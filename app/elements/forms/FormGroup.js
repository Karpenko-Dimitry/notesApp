import React from 'react';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        width: '100%'
    }
});
const FormGroup = ({ children }) => {
    return <View>{children}</View>;
};

export default FormGroup;
