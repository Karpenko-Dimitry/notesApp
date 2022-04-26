import React, { useState, useContext } from 'react';
import { StyleSheet, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button';
import { globalStyles } from '../../share/globalStyles';
import Row from '../components/Row';
import AuthService from '../../services/AuthService';
import FormError from '../forms/FormError';
import PopUp from './PopUp';
import { store } from '../../contexts/AuthContext';

const LoginPopUp = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const authContext = useContext(store);

    const onSubmit = async () => {
        if (loading) {
            return;
        }

        setLoading(true);
        setErrors({});

        AuthService.signIn(email, password).then(
            async (res) => {
                await authContext.signIn(res.data.access_token);

                // navigation.navigate('drawer', { screen: 'Home' });
            },
            (res) => {
                setLoading(false);

                if (res.status === 422) {
                    console.log(res.data.errors);
                    return setErrors(res.data.errors);
                } else {
                    Alert.alert(res.status);
                }
            },
        );
    };

    return (
        <PopUp onClose={onClose}>
            <Row>
                <TextInput
                    style={globalStyles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />
                <FormError errors={errors.email} />
            </Row>
            <Row>
                <TextInput
                    style={globalStyles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                />
                <FormError errors={errors.password} />
            </Row>
            <Row>
                <Button title="Submit" type="light" onPress={onSubmit} />
            </Row>
        </PopUp>
    );
};

const styles = StyleSheet.create();

export default LoginPopUp;
