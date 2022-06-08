import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Row from '../elements/components/Row';
import { globalStyles } from '../share/globalStyles';
import FileService from '../services/FileService';
import FileDownload from '../elements/components/FileDownload';
import Button from '../elements/components/Button';
import NoteService from '../services/NoteService';

const NotesDetailesScreen = ({ route, navigation }) => {
    const {
        uid,
        title,
        content,
        created_at_locale,
        user,
        categories,
        tags,
        files,
        can_edit,
        can_delete,
    } = route.params;
    const Box = ({ children }) => <View style={styles.box}>{children}</View>;

    const deleteNote = () => {
        NoteService.remove(uid).then(
            (res) => {
                navigation.navigate('Notes', {
                    filter: {
                        per_page: 15,
                        page: 1,
                    },
                });
            },
            (res) => {
                Alert.alert(JSON.stringify(res.status), JSON.stringify(res.data.message));
            },
        );
    };

    const deleteHandler = () => {
        Alert.alert('Delete', `Delete ${title} note?`, [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            { text: 'OK', onPress: () => deleteNote() },
        ]);
    };
    return (
        <Row style={globalStyles.container}>
            <Box>
                <Text style={styles.title}>Created at: </Text>
                <Text>
                    {created_at_locale} by {user.name}
                </Text>
            </Box>
            <Box>
                <Text style={styles.title}>Categories: </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {categories.length &&
                        categories.map((category, index) => (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('DrowerNotelist', { category: category })}
                                style={{ flexDirection: 'row' }}
                                key={category.id}>
                                <Text style={globalStyles.link}>{category.name}</Text>
                                <Text>{categories.length > index + 1 ? ', ' : ''}</Text>
                            </TouchableOpacity>
                        ))}
                </View>
            </Box>
            <Box>
                <Text style={styles.title}>Tags</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {tags.length > 0 &&
                        tags.map((tag, index) => (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('DrowerNotelist', { tag: tag })}
                                style={{ flexDirection: 'row' }}
                                key={tag.id}>
                                <Text style={globalStyles.link}>{tag.name}</Text>
                                <Text>{tags.length > index + 1 ? ', ' : ''}</Text>
                            </TouchableOpacity>
                        ))}
                </View>
            </Box>
            <Box>
                <Text style={styles.title}>Content</Text>
                <Text>{content}</Text>
            </Box>
            <Box>
                <Text style={styles.title}>Files: </Text>
                <View style={{ flexDirection: 'row' }}>
                    {files.length > 0 &&
                        files.map((file, index) => (
                            <View
                                source={file.path}
                                onPress={() => FileService.download(file.id)}
                                style={{ flexDirection: 'row' }}
                                key={file.id}>
                                <FileDownload path={file.path}>
                                    <Text style={globalStyles.link}>{file.name}</Text>
                                </FileDownload>
                                <Text>{files.length > index + 1 ? ', ' : ''}</Text>
                            </View>
                        ))}
                </View>
            </Box>
            {can_edit && (
                <Box>
                    <Button
                        title="Edit"
                        onPress={() =>
                            navigation.navigate('Note edit', { uid, title: 'Edit note' })
                        }
                    />
                </Box>
            )}
            {can_delete && (
                <Box>
                    <Button title="Delete" onPress={deleteHandler} />
                </Box>
            )}
            <Box>
                <Button
                    type="white"
                    title="Back"
                    onPress={() =>
                        navigation.navigate('DrowerNotelist', { title: 'All notes', filter: {} })
                    }
                />
            </Box>
        </Row>
    );
};

const styles = StyleSheet.create({
    box: {
        paddingVertical: 10,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 20,
    },
});

export default NotesDetailesScreen;
