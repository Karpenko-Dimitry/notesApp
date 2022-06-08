import React, { useState, useContext } from 'react';
import { StyleSheet, TextInput, Alert, Keyboard } from 'react-native';
import Button from '../components/Button';
import { globalStyles } from '../../share/globalStyles';
import Row from '../components/Row';
import AuthService from '../../services/AuthService';
import FormError from '../forms/FormError';
import PopUp from './PopUp';
import { store } from '../../contexts/AuthContext';

const LoginPopUp = ({ onClose, navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const authContext = useContext(store);

    const onSubmit = async () => {
        if (loading) {
            return;
        }
        Keyboard.dismiss();
        setLoading(true);
        setErrors({});

        AuthService.signUp({ email, name, password, password_confirmation: confirmation }).then(
            async (res) => {
                await authContext.signIn(res.data.access_token);
                onClose();
                navigation.navigate('AuthDrower');
            },
            (res) => {
                setLoading(false);

                if (res.status === 422) {
                    console.log(res.data.errors);
                    return setErrors(res.data.errors);
                } else {
                    Alert.alert(JSON.stringify(res.status), JSON.stringify(res.data.message));
                }
            },
        );
    };

    return (
        <PopUp onClose={onClose} header="Register">
            <Row>
                <TextInput
                    style={globalStyles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                />
                <FormError errors={errors.name} />
            </Row>
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
                    secureTextEntry
                    style={globalStyles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                />
                <FormError errors={errors.password} />
            </Row>
            <Row>
                <TextInput
                    secureTextEntry
                    style={globalStyles.input}
                    placeholder="Confirmation"
                    value={confirmation}
                    onChangeText={setConfirmation}
                />
            </Row>

            <Row>
                <Button title="Submit" type="light" onPress={onSubmit} />
            </Row>
        </PopUp>
    );
};

const styles = StyleSheet.create();

export default LoginPopUp;
