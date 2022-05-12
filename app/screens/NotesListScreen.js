import React, { useState, useEffect, useReducer, Component } from 'react';
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
import NoteCard from '../elements/components/NoteCard';
import { globalStyles, borderColor, textColor } from './../share/globalStyles';
import SelectBox from 'react-native-multi-selectbox';
import { xorBy } from 'lodash';

let lastPage = 2;

const NotesListScreen = ({ navigation, route }) => {
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState([]);
    const [categories, setCategory] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [pagination, setPagination] = useReducer(
        (_old, _new) => {
            return { ..._old, ..._new };
        },
        {
            per_page: 15,
            page: 1,
        },
    );

    const onMultiChange = () => {
        return (item) => {
            let categories = xorBy(selectedCategories, [item], 'id');
            setSelectedCategories(categories);
            setFilter({ category: categories.map((item) => item.id).join(',') });
        };
    };

    const [filter, setFilter] = useReducer((_old, _new) => {
        setPagination({ page: 1 });
        return { ..._old, ..._new };
    }, {});

    useEffect(() => {
        const { params } = route;

        if (params && params.filter) {
            setFilter(params.filter);
        }
        if (params && params.category) {
            const doMultiChange = onMultiChange();

            doMultiChange(params.category);
        }

    }, [route]);

    useEffect(() => {
        CategoryService.list().then((res) => {
            res.data.data.map((item) => {
                item.item = item.name;
                return item;
            });
            setCategory(res.data.data);
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

    const handleOnEndReached = () => {
        if (!loading && pagination.page < lastPage) {
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

    return (
        <Row>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                    <View style={styles.searchBox}>
                        <TextInput
                            placeholder="Search..."
                            placeholderTextColor={textColor}
                            value={filter.query || ''}
                            onChangeText={(query) => setFilter({ query })}
                            style={{ ...styles.search, ...{ paddingVertical: 15 } }}
                            returnKeyType="search"
                            selectionColor="#fc8c03"
                            selectTextOnFocus={true}
                        />
                        {categories.length > 0 && (
                            <View style={{ ...styles.search, ...{ paddingVertical: 8 } }}>
                                <SelectBox
                                    label="Categories"
                                    labelStyle={{ display: 'none' }}
                                    options={categories || []}
                                    selectedValues={selectedCategories || []}
                                    onMultiSelect={onMultiChange()}
                                    onTapClose={onMultiChange()}
                                    arrowIconColor={textColor}
                                    searchIconColor={textColor}
                                    toggleIconColor={textColor}
                                    inputPlaceholder="Categories..."
                                    containerStyle={{
                                        borderColor: 'white',
                                        paddingVertical: 15,
                                    }}
                                    optionsLabelStyle={{ fontSize: 15 }}
                                    multiListEmptyLabelStyle={{
                                        fontSize: 15,
                                        color: textColor,
                                    }}
                                    inputFilterStyle={{ paddingHorizontal: 15, fontSize: 15 }}
                                    searchInputProps={{ placeholderTextColor: textColor }}
                                    optionContainerStyle={{
                                        backgroundColor: 'white',
                                        paddingVertical: 7,
                                        paddingHorizontal: 15,
                                    }}
                                    multiOptionContainerStyle={{ backgroundColor: textColor }}
                                    isMulti
                                />
                            </View>
                        )}
                    </View>
                    <View>
                        <FlatList
                            data={notes}
                            keyExtractor={(item) => item.id}
                            onEndReached={handleOnEndReached}
                            renderItem={({ item }) => (
                                <NoteCard
                                    item={item}
                                    onPress={() => navigation.navigate('NotesDetailes', item)}
                                />
                            )}
                            ListEmptyComponent={() => <EmptyList />}
                            ListFooterComponent={() => loading && <ListFooterComponent />}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Row>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    searchBox: {
        paddingVertical: 20,
    },
    search: {
        marginBottom: 10,
        borderRadius: 7,
        paddingHorizontal: 10,
        backgroundColor: 'white',
    },
    emptyList: {
        textAlign: 'center',
        fontWeight: 'bold',
        letterSpacing: 1,
        fontSize: 16,
    },
});

export default NotesListScreen;
