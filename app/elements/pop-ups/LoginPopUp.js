import React, { useState, useContext } from 'react';
import {
    StyleSheet,
    TextInput,
    Alert,
    Keyboard,
    TouchableOpacity,
    View,
    Dimensions,
} from 'react-native';
import Button from '../components/Button';
import { globalStyles, textColor } from '../../share/globalStyles';
import Row from '../components/Row';
import AuthService from '../../services/AuthService';
import FormError from '../forms/FormError';
import PopUp from './PopUp';
import { store } from '../../contexts/AuthContext';
import { Icon } from 'react-native-eva-icons';

const LoginPopUp = ({ onClose, navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPass, setShowPass] = useState(false);
    const authContext = useContext(store);

    const onSubmit = async () => {
        if (loading) {
            return;
        }
        Keyboard.dismiss();
        setLoading(true);
        setErrors({});

        AuthService.signIn(email, password).then(
            async (res) => {
                await authContext.signIn(res.data.access_token);
                onClose();
                navigation.navigate('AuthDrower');
            },
            (res) => {
                setLoading(false);

                if (res.status === 422) {
                    return setErrors(res.data.errors);
                } else {
                    Alert.alert(JSON.stringify(res));
                }
            },
        );
    };

    const styles = StyleSheet.create({
        passIconContainer: {
            position: 'absolute',
            right: 15,
            top: 0,
            transform: [{ translateY: 7 }],
        },
        passIcon: {
            width: 30,
            height: 30,
            fill: textColor,
        },
    });
    

    return (
        <PopUp onClose={onClose} header="Login">
            <Row>
                <TextInput
                    autoCapitalize="none"
                    style={globalStyles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />
                <FormError errors={errors.email} />
            </Row>
            <Row>
                <View style={{ position: 'relative' }}>
                    <TextInput
                        secureTextEntry={!showPass}
                        autoCapitalize="none"
                        style={globalStyles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity
                        style={styles.passIconContainer}
                        onPress={() => setShowPass(!showPass)}>
                        <Icon
                            style={styles.passIcon}
                            name={showPass ? 'unlock-outline' : 'lock-outline'}
                        />
                    </TouchableOpacity>
                    <FormError errors={errors.password} />
                </View>
            </Row>
            <Row>
                <Button title="Submit" type="light" onPress={onSubmit} />
            </Row>
        </PopUp>
    );
};


export default LoginPopUp;
