import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { globalStyles } from '../../share/globalStyles';

const NoteCard = ({ item, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={globalStyles.card}>
                <Text>{item.title}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    box: {
        padding: 10,
        borderWidth: 1,
    },
});

export default NoteCard;
