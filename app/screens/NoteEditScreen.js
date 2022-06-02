import React, { useState, useEffect, useReducer } from 'react';
import {
    StyleSheet,
    TextInput,
    Alert,
    Text,
    Keyboard,
    View,
    TouchableOpacity,
    ScrollView,
    TouchableWithoutFeedback,
    SafeAreaView,
    KeyboardAvoidingView,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Row from '../elements/components/Row';
import { globalStyles, borderColor } from '../share/globalStyles';
import NoteService from '../services/NoteService';
import CategoryService from '../services/CategoryService';
import Button from '../elements/components/Button';
import FormError from '../elements/forms/FormError';
import FilePicker from '../elements/components/FilePicker';
import SelectBox from 'react-native-multi-selectbox';
import { xorBy } from 'lodash';
import TagService from '../services/TagService';
import Chosen from '../elements/components/Chosen';

const NoteEditScreen = ({ route, navigation }) => {
    const uid = route.params?.uid;
    const [translations, setTranslations] = useReducer(
        (_old, _new) => {
            let result = {};

            for (const language in _new) {
                result = { ..._old, ...{ [language]: { ..._old[language], ..._new[language] } } };
            }
            return result;
        },
        { en: {} },
    );

    const [category, setCategory] = useReducer((_old, _new) => {
        let result = [..._old];

        let index = result.indexOf(_new);
        if (index >= 0) {
            result.splice(index, 1);
        } else {
            result.push(_new);
        }

        return result;
    }, []);

    const [allCategories, setAllCategories] = useState([]);
    const [allTags, setAllTags] = useState([]);
    const [tags, setTags] = useState([]);
    const [tagText, setTagText] = useState('');
    const [_public, setPublic] = useState(true);
    const [errors, setErrors] = useState({});
    const [files, setFiles] = useState([]);
    const [close, setClose] = useState(null);
    const [_keyboard, setKeyboard] = useState(false);
    const [_keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        fetchModels();
    }, []);

    const fetchModels = async () => {
        await CategoryService.list().then((res) => setAllCategories(res.data.data));
        await TagService.list().then((res) => {
            setAllTags(res.data.data);
        });

        if (uid) {
            await NoteService.read(uid).then(
                (res) => {
                    let data = res.data.data;
                    data.categories
                        .map((item) => item.id)
                        .forEach((item) => {
                            setCategory(item);
                        });

                    setTranslations(data.translation);
                    setPublic(!!data.public);
                    setFiles(data.files);
                    setTags(data.tags);
                },
                (res) => {
                    Alert.alert(JSON.stringify(res.status), JSON.stringify(res.data.message));
                },
            );
        }
    };

    const onMultiChangeTags = () => {
        return (item) => {
            let selectedTags = xorBy(tags, [item], 'name');
            setTags(selectedTags);
        };
    };

    const handlerPress = () => {
        let _files = files.map((item) => item.id);
        let _tags = tags.map((item) => item.name);
        let data = { translations, public: _public ? 1 : 0, category, files: _files, tags: _tags };
        let promise = null;

        if (uid) {
            promise = NoteService.update(uid, data);
        } else {
            promise = NoteService.store(data);
        }

        promise?.then(
            (res) => {
                if (uid) {
                    navigation.navigate('NotesDetailes', res.data.data);
                } else {
                    navigation.navigate('Notes', { filter: { per_page: 15, page: 1 } });
                }
            },
            (res) => {
                if (res.status === 422) {
                    return setErrors(res.data.errors);
                }

                Alert.alert(JSON.stringify(res.status), JSON.stringify(res.data.message));
            },
        );
    };

    const closeHandler = (item = null) => {
        if (item != null) {
            setClose(item);
        }
    };

    // Keyboard.addListener('keyboardDidShow', (e) => {
    //     setKeyboard(true);
    //     setKeyboardHeight(e.endCoordinates.height);
    // });
    // Keyboard.addListener('keyboardDidHide', () => {
    //     setKeyboard(false);
    //     setKeyboardHeight(0);
    // });

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                Keyboard.dismiss();
            }}>
            <ScrollView style={globalStyles.container} nestedScrollEnabled={true}>
                <Row>
                    <TextInput
                        placeholder="Title"
                        style={globalStyles.input}
                        value={translations['en'].title}
                        onChangeText={(data) => setTranslations({ en: { title: data } })}
                    />
                    <FormError errors={errors['translations.en.title']} />
                </Row>
                <Row>
                    <TextInput
                        placeholder="Text"
                        style={{ ...globalStyles.input, ...{ minHeight: 70 } }}
                        value={translations['en'].content}
                        onChangeText={(data) => setTranslations({ en: { content: data } })}
                        multiline={true}
                    />
                    <FormError errors={errors['translations.en.content']} />
                </Row>
                <Row>
                    <Chosen
                        items={allTags}
                        selectedItems={tags}
                        onChange={setTags}
                        closeDropDown={close}
                    />
                </Row>
                {/* <Row>
                    <View
                        style={{
                            borderColor: borderColor,
                            borderWidth: 1,
                            padding: 7,
                            borderRadius: 7,
                        }}>
                        <SelectBox
                            listOptionProps={{}}
                            canAddItems={true}
                            label="Tags"
                            labelStyle={{ display: 'none' }}
                            options={allTags || []}
                            selectedValues={tags || []}
                            onMultiSelect={onMultiChangeTags()}
                            onTapClose={onMultiChangeTags()}
                            onAddItem={(name) => console.log(name)}
                            arrowIconColor={textColor}
                            searchIconColor={textColor}
                            toggleIconColor={textColor}
                            inputPlaceholder="Tags..."
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
                </Row> */}
                <Row>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <CheckBox value={_public} onValueChange={() => setPublic(!_public)} />
                        <TouchableOpacity onPress={() => setPublic(!_public)}>
                            <Text>is public ?</Text>
                        </TouchableOpacity>
                    </View>
                </Row>
                <Row>
                    <Text style={{ padding: 7, fontSize: 16 }}>Categories:</Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                        }}>
                        {allCategories.map((item) => (
                            <View
                                key={item.id}
                                style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <CheckBox
                                    value={category.includes(item.id)}
                                    onValueChange={() => setCategory(item.id)}
                                />
                                <TouchableOpacity onPress={() => setCategory(item.id)}>
                                    <Text>{item.name}</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                    <View>
                        <FormError errors={errors.category} />
                    </View>
                </Row>
                <Row>
                    <FilePicker files={files} onChange={setFiles} />
                </Row>
                <Row>
                    <Button title={uid ? 'Edit' : 'Create'} onPress={handlerPress} />
                </Row>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
};

export default NoteEditScreen;
