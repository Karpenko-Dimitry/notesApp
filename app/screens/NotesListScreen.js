import React, { useState, useEffect, useReducer } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import Row from '../elements/components/Row';
import NoteService from '../services/NoteService';
import CategoryService from '../services/CategoryService';
import TagService from '../services/TagService';
import NoteCard from '../elements/components/NoteCard';
import { globalStyles, borderColor, textColor } from './../share/globalStyles';
import Chosen from '../elements/components/Chosen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

let lastPage = 2;

const NotesListScreen = ({ navigation, route }) => {
    const [filter, setFilter] = useState({});
    const [scrollBegin, setScrollBegin] = useState(false);
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState([]);
    const [categories, setCategory] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [pagination, setPagination] = useReducer(
        (_old, _new) => {
            return { ..._old, ..._new };
        },
        {
            per_page: 15,
            page: 1,
        },
    );

    const onTagChange = (tag) => {
        setSelectedTags(tag);   
        setFilter({...filter, tag: tag.map((item) => item.id).join(',')});
    }
    
    const onCategoryChange = (categories) => {
        setSelectedCategories(categories);   
        setFilter({...filter, category: categories.map((item) => item.id).join(',')});
    }

    const handleOnEndReached = () => {
        if (!loading && scrollBegin && pagination.page < lastPage) {
            setLoading(true);
            setPagination({ page: pagination.page + 1 });
        }
    };

    const ListFooterComponent = () => {
        return <Text style={{ textAlign: 'center' }}>Loading...</Text>;
    };

    const EmptyList = () => (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={styles.emptyList}>Any item found...</Text>
        </View>
    );

    useEffect(() => {
        const params = route.params;

        if (params && params.filter) {
            setFilter(params.filter);
            setSelectedCategories([]);
            setSelectedTags([]);
        }
        if (params && params.category) {
            onCategoryChange([params.category]);
        }
        if (params && params.tag) {
            onTagChange([params.tag]);
        }
        if (params && params.user_id) {
            setFilter({user_id: params.user_id});
        }
    }, [route]);

    useEffect(() => {
        CategoryService.list().then(
            (res) => {
                setCategory(res.data.data);
            },
            (res) => {
                if (res.status === 422) {
                    return setErrors(res.data.errors);
                }

                Alert.alert(JSON.stringify(res.status), JSON.stringify(res.data.message));
            },
        );

        TagService.list().then((res) => {
            setTags(res.data.data);
        });
    }, []);

    useEffect(() => {
        NoteService.list({ ...filter, ...pagination }).then((res) => {
            lastPage = res.data.meta.last_page;

            if (pagination.page == 1) {
                setNotes(res.data.data);
            } else {
                setNotes([...notes, ...res.data.data]);
            }

            setLoading(false);
        });
    }, [filter, pagination]);

    const styles = StyleSheet.create({
        searchBox: {
            paddingVertical: 20,
        },
        search: {
            marginBottom: 10,
            borderRadius: 7,
            paddingHorizontal: 10,
            backgroundColor: 'white',
            borderBottomWidth: 1,
            borderBottomColor: borderColor,
        },
        emptyList: {
            textAlign: 'center',
            fontWeight: 'bold',
            letterSpacing: 1,
            fontSize: 16,
        },
    });

    return (
        <View style={{ ...globalStyles.container, paddingBottom: insets.bottom }}>
            <Row>
                <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.searchBox}>
                            <TextInput
                                placeholder="Search..."
                                placeholderTextColor={textColor}
                                value={filter.query || ''}
                                onChangeText={(query) => setFilter({...filter, query})}
                                style={{ ...styles.search, ...{ paddingVertical: 15 } }}
                                returnKeyType="search"
                                selectionColor="#fc8c03"
                                selectTextOnFocus={true}
                            />
                            {categories.length > 0 && (
                                <View>
                                    <Chosen
                                        items={categories}
                                        selectedItems={selectedCategories}
                                        onChange={onCategoryChange}
                                        closeDropDown={null}
                                        placeholder="Categories..."
                                        containerStyle={{
                                            borderWidth: 0,
                                            paddingHorizontal: 0,
                                            borderBottomWidth: 1,
                                            borderBottomColor: borderColor,
                                        }}
                                    />
                                </View>
                            )}
                            {tags?.length > 0 && (
                                <View>
                                    <Chosen
                                        items={tags}
                                        selectedItems={selectedTags}
                                        onChange={onTagChange}
                                        closeDropDown={null}
                                        placeholder="Tags..."
                                        containerStyle={{
                                            borderWidth: 0,
                                            paddingHorizontal: 0,
                                            borderBottomWidth: 1,
                                            borderBottomColor: borderColor,
                                        }}
                                    />
                                </View>
                            )}
                        </View>
                        <View style={{ flex: 1 }}>
                            <FlatList
                                data={notes}
                                keyExtractor={(item) => item.id}
                                onEndReached={handleOnEndReached}
                                onScrollBeginDrag={() => setScrollBegin(true)}
                                renderItem={({ item }) => (
                                    <NoteCard
                                        item={item}
                                        onPress={() =>
                                            navigation.navigate('DrowerNotesDetailes', item)
                                        }
                                    />
                                )}
                                ListEmptyComponent={() => <EmptyList />}
                                ListFooterComponent={() => loading && <ListFooterComponent />}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Row>
        </View>
    );
};

export default NotesListScreen;
