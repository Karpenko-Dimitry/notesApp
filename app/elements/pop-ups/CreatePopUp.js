import React, { useState, useEffect, useReducer, useContext } from 'react';
import { StyleSheet, TextInput, Alert, Text, Keyboard, View, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import PopUp from './PopUp';
import Row from '../components/Row';
import { globalStyles, textColor, borderColor } from '../../share/globalStyles';
import NoteService from '../../services/NoteService';
import CategoryService from '../../services/CategoryService';
import Button from '../components/Button';
import FormError from '../forms/FormError';
import { popupContext } from '../../contexts/PopupContext';
import FilePicker from '../components/FilePicker';
import SelectBox from 'react-native-multi-selectbox';
import { xorBy } from 'lodash';
import TagService from '../../services/TagService';

const CreatePopUp = () => {
    let popup = useContext(popupContext);

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

    useEffect(() => {
        CategoryService.list().then((res) => setAllCategories(res.data.data));
        TagService.list().then((res) => {
            res.data.data.map((item) => {
                item.item = '#' + item.name;
                item.name = item.name;
                return item;
            });
            setAllTags(res.data.data);
        });
    }, []);

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
        NoteService.store(data).then(
            (res) => {
                popup.setPopup('');
            },
            (res) => {
                if (res.status === 422) {
                    return setErrors(res.data.errors);
                }

                Alert.alert(JSON.stringify(res.status), JSON.stringify(res.data.message));
            },
        );
    };

    return (
        <PopUp header="Create note">
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
                <View style={{borderColor: borderColor, borderWidth: 1, padding: 7, borderRadius: 7}}>
                    <SelectBox
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
            </Row>
            <Row>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CheckBox value={_public} onValueChange={() => setPublic(!_public)} />
                    <TouchableOpacity onPress={() => setPublic(!_public)}>
                        <Text>is public ?</Text>
                    </TouchableOpacity>
                </View>
            </Row>
            <Row>
                <Text style={{padding: 7, fontSize: 16}}>Categories:</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                    {allCategories.map((item) => (
                        <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                <Button title="Create" onPress={handlerPress} />
            </Row>
        </PopUp>
    );
};

export default CreatePopUp;
