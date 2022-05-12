import React from 'react';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10   
    }
})
const Row = ({ children, style }) => {
    return <View style={{...styles.container, ...style}}>{children}</View>;
};
 export default Row;