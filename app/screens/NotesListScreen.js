import React, { useState, useEffect } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import NoteService from '../services/NoteService';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
});

const NotesListScreen = () => {
    const [notes, setNotes] = useState(null);

    useEffect(() => {
        NoteService.list().then((res) => {
            setNotes(res.data.data);
        });
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                style={{ borderWidth: 1, borderColor: 'white' }}
                data={notes}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.title}</Text>
                    </View>
                )}
            />
        </View>
    );
};

export default NotesListScreen;
