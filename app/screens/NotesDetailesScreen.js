import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Row from '../elements/components/Row';
import { globalStyles } from '../share/globalStyles';
const NotesDetailesScreen = ({ route, navigation }) => {
    const { content, created_at_locale, user, categories, tags } = route.params;
    const Box = ({ children }) => <View style={styles.box}>{children}</View>;
    return (
        <Row>
            <Box sty>
                <Text style={styles.title}>Created at: </Text>
                <Text>
                    {created_at_locale} by {user.name}
                </Text>
            </Box>
            <Box>
                <Text style={styles.title}>Categories: </Text>
                <View style={{ flexDirection: 'row' }}>
                    {categories.length &&
                        categories.map((category, index) => (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Notes', { category: category })}
                                style={{ flexDirection: 'row' }}
                                key={category.id}>
                                <Text style={globalStyles.link}>{category.name}</Text>
                                <Text>{categories.length > index + 1 ? ', ' : ''}</Text>
                            </TouchableOpacity>
                        ))}
                </View>
            </Box>
            <Box>
                <Text style={styles.title}>Tags: </Text>
                <View style={{ flexDirection: 'row' }}>
                    {tags.length &&
                        tags.map((tag, index) => (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Notes', { tag: tag })}
                                style={{ flexDirection: 'row' }}
                                key={tag.id}>
                                <Text style={globalStyles.link}>#{tag.name}</Text>
                                <Text>{tags.length > index + 1 ? ', ' : ''}</Text>
                            </TouchableOpacity>
                        ))}
                </View>
            </Box>
            <Box>
                <Text style={styles.title}>Content</Text>
                <Text>{content}</Text>
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
