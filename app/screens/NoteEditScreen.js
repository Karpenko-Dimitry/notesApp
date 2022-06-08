import React, { useState, useEffect, useReducer } from 'react';
import {
    TextInput,
    Alert,
    Text,
    Keyboard,
    View,
    TouchableOpacity,
    ScrollView,
    TouchableWithoutFeedback,
    Platform,
    SafeAreaView
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Row from '../elements/components/Row';
import { globalStyles } from '../share/globalStyles';
import NoteService from '../services/NoteService';
import CategoryService from '../services/CategoryService';
import Button from '../elements/components/Button';
import FormError from '../elements/forms/FormError';
import FilePicker from '../elements/components/FilePicker';
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
    const [_public, setPublic] = useState(true);
    const [errors, setErrors] = useState({});
    const [files, setFiles] = useState([]);
    const [close, setClose] = useState(null);

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
                    navigation.navigate('DrowerNotesDetailes', res.data.data);
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

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TouchableWithoutFeedback
                onPress={() => {
                    Keyboard.dismiss();
                    setClose(!close);
                    console.log(close);
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
                            placeholder="Tags..."
                        />
                    </Row>
                    <Row>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <CheckBox
                                boxType="square"
                                style={
                                    Platform.OS == 'ios'
                                        ? { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }
                                        : {}
                                }
                                value={_public}
                                onValueChange={() => setPublic(!_public)}
                            />
                            <TouchableOpacity onPress={() => setPublic(!_public)}>
                                <Text>is public ?</Text>
                            </TouchableOpacity>
                        </View>
                    </Row>
                    <Row>
                        <Text style={{ padding: 7, fontSize: 16 }}>Categories:</Text>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                                flexWrap: 'wrap',
                            }}>
                            {allCategories.map((item) => (
                                <View
                                    key={item.id}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginRight: 5,
                                    }}>
                                    <CheckBox
                                        boxType="square"
                                        style={
                                            Platform.OS == 'ios'
                                                ? { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }
                                                : {}
                                        }
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
                        <Button title={uid ? 'Update' : 'Create'} onPress={handlerPress} />
                    </Row>
                </ScrollView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

export default NoteEditScreen;
