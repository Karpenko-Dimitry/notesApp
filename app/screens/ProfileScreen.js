import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { globalStyles } from '../share/globalStyles';
import AuthService from '../services/AuthService';
import Button from '../elements/components/Button';
import FormError from '../elements/forms/FormError';
import { useIsFocused } from '@react-navigation/native';
import FilePicker from '../elements/components/FilePicker';
import { API_URL } from '../../env';

const ProfileScreen = ({ route, navigation }) => {
    const user = route.params.user;
    const isFocused = useIsFocused();
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [avatar, setAvatar] = useState(user.avatar);
    const [errors, setErrors] = useState([]);

    const updateStates = (user) => {
        setName(user.name);
        setEmail(user.email);
        setAvatar(user.avatar);
    };

    const onSubmit = () => {
        let data = {
            name,
            email,
            avatar
        };

        AuthService.updateProfile(data).then(
            (res) => {
                updateStates(res.data.data);
            },
            (res) => {
                if (res.status === 422) {
                    return setErrors(res.data.errors);
                }

                Alert.alert(JSON.stringify(res.status), JSON.stringify(res.data.message));
            },
        );
    };

    useEffect(() => {
        if (isFocused) {
            AuthService.profile().then(
                (res) => {
                    updateStates(res.data.data);
                },
                (res) => {
                    if (res.status === 422) {
                        return setErrors(res.data.errors);
                    }

                    Alert.alert(JSON.stringify(res.status), JSON.stringify(res.data.message));
                },
            );
        }
    }, [isFocused]);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'white',
        },
        avatar: {
            width: 150,
            height: 150,
            alignSelf: 'center',
        },

        label: {
            padding: 7,
            fontSize: 16,
        },
    });

    return (
        <View style={{ ...styles.container, justifyContent: 'flex-start' }}>
            <View style={{ paddingHorizontal: 20, paddingVertical: 10, justifyContent: 'center' }}>
                <Image
                    style={styles.avatar}
                    source={{ uri: avatar.includes('http') ? avatar : API_URL + '/' + avatar }}
                />
            </View>
            <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                <FilePicker
                    onChange={(res) => setAvatar(res[0]['path'])}
                    multiple={false}
                    detailes={false}
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                />
            </View>
            <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                <Text style={styles.label}>Name:</Text>
                <TextInput
                    autoCapitalize="none"
                    style={globalStyles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                />
                <FormError errors={errors.name} />
            </View>
            <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                <Text style={styles.label}>Email:</Text>
                <TextInput
                    autoCapitalize="none"
                    style={globalStyles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />
                <FormError errors={errors.email} />
            </View>
            <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                <Button title="Update" onPress={onSubmit} />
            </View>
        </View>
    );
};

export default ProfileScreen;
