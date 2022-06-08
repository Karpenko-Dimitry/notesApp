import React, { useReducer, useState } from 'react';
// Import required components
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';
import FileService from '../../services/FileService';

// Import Document Picker
import DocumentPicker from 'react-native-document-picker';
import { Icon } from 'react-native-eva-icons';

const FilePicker = ({ files = [], onChange = null, detailes = true, multiple = true, style = {} }) => {
    const upload = async (uploadedFiles) => {
        let result = [];

        for (const file of uploadedFiles) {
            const formData = new FormData();
            formData.append('user_file[]', file, file['name']);

            await FileService.store(formData, { 'Content-Type': 'multipart/form-data' }).then(
                (res) => {
                    result.push(res.data.data);
                },
                (res) => {
                    if (res.status === 422) {
                        return setErrors(res.data.errors);
                    }

                    Alert.alert(JSON.stringify(res.status), JSON.stringify(res.data.message));
                },
            );
        }

        return result;
    };

    const remove = (object) => {
        FileService.remove(object.id).then(
            (res) => {
                // setMultipleFile({action: 'remove', object});
                let result = [...files];
                let index = result.findIndex((el) => el.id == object.id);
                if (index != -1) {
                    result.splice(index, 1);
                }
                console.log(result);
                if (onChange) {
                    onChange(result);
                }  
            },
            (res) => {
                Alert.alert(JSON.stringify(res.status), JSON.stringify(res.data.message));
            },
        );
    };

    const selectOneFile = async () => {
        //Opening Document Picker for selection of one file
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
                //There can me more options as well
                // DocumentPicker.types.allFiles
                // DocumentPicker.types.images
                // DocumentPicker.types.plainText
                // DocumentPicker.types.audio
                // DocumentPicker.types.pdf
            });

            upload(result).then((res) => onChange(res));
        } catch (err) {
            //Handling any exception (If any)
            if (DocumentPicker.isCancel(err)) {
                //If user canceled the document selection
                alert('Canceled from single doc picker');
            } else {
                //For Unknown Error
                alert('Unknown Error: ' + JSON.stringify(err));
                throw err;
            }
        }
    };

    const selectMultipleFile = async () => {
        //Opening Document Picker for selection of multiple file
        try {
            const results = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.allFiles],
                //There can me more options as well
                // DocumentPicker.types.allFiles
                // DocumentPicker.types.images
                // DocumentPicker.types.plainText
                // DocumentPicker.types.audio
                // DocumentPicker.types.pdf
            });

            upload(results).then(
                (res) => {
                    if (onChange) {
                        onChange([...res, ...files])
                    }
                },
                (res) => {
                    Alert.alert(JSON.stringify(res.status), JSON.stringify(res.data.message));
                },
            );
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                //If user canceled the document selection
                alert('Canceled from multiple doc picker');
            } else {
                //For Unknown Error
                alert('Unknown Error: ' + JSON.stringify(err));
                throw err;
            }
        }
    };

    return (
        <SafeAreaView>
            <View style={style}>
                <TouchableOpacity
                    style={{ flexDirection: 'row' }}
                    activeOpacity={0.5}
                    onPress={multiple ? selectMultipleFile : selectOneFile}>
                    <Text style={styles.buttonStyle}>Upload file</Text>
                </TouchableOpacity>
                {detailes && (
                    <ScrollView style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {files.map((item, key) => (
                                <View
                                    key={key}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 10,
                                    }}>
                                    <TouchableOpacity onPress={() => remove(item)}>
                                        <Icon
                                            name="close-outline"
                                            fill="black"
                                            width={20}
                                            height={20}
                                        />
                                    </TouchableOpacity>
                                    <Text style={styles.textStyle}>
                                        {item.name ? item.name : ''}{' '}
                                        {files.length == key + 1 ? '' : '; '}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
};

export default FilePicker;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'red',
        padding: 16,
    },
    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 20,
    },
    textStyle: {
        backgroundColor: '#fff',
        fontSize: 12,
        color: 'black',
    },
    buttonStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#DDDDDD',
        borderRadius: 7,
        padding: 7,
    },
});
