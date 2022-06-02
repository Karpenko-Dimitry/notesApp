import { StyleSheet } from "react-native";

export const borderColor = '#e0dede';
export const textColor = '#6d756f';

export const globalStyles = StyleSheet.create({
    global: {
        color_ylw: '#fc8c03',
        color_border: borderColor,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    input: {
        borderColor: borderColor,
        borderWidth: 1,
        borderRadius: 7,
        paddingHorizontal: 15,
    }, 
    card: {
        borderColor: borderColor,
        borderWidth: 1,
        borderRadius: 7,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 10
    }, 
    link: {
        color: 'blue',
        textDecorationLine: 'underline'
    }
});