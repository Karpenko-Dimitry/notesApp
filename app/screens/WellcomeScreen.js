import React, { useState, useContext } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableWithoutFeedback,
    Modal,
    Pressable,
    Alert,
} from 'react-native';
import { globalStyles } from '../share/globalStyles';
import Button from '../elements/components/Button';
import LoginPopUp from '../elements/pop-ups/LoginPopUp';
import RegisterPopUp from '../elements/pop-ups/RegisterPopUp';
import Row from '../elements/components/Row';
import { store } from '../contexts/AuthContext';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    item: {
        flex: 1,
    },
    logoBlock: {
        flex: 2,
        justifyContent: 'flex-end',
    },
    buttonsBlock: {
        flex: 1,
        justifyContent: 'center',
    },
    logoText: {
        fontFamily: 'Hurricane-Regular',
        color: globalStyles.global.color_ylw,
        textAlign: 'center',
        fontSize: 35,
        letterSpacing: 5,
        textTransform: 'uppercase',
    },
    button: {
        marginVertical: 10,

        borderRadius: 15,
        padding: 5,
        elevation: 2,
    },
});

const WellcomeScreen = ({ navigation }) => {
    const [logIn, setLogin] = useState(false);
    const [register, setRegister] = useState(false);
    const authContext = useContext(store);

    const imgBg = require('../../assets/images/auth-background.jpg');

    return (
        <ImageBackground style={styles.container} source={imgBg}>
            <TouchableWithoutFeedback
                onPress={() => {
                    setLogin(false);
                }}>
                <View style={styles.item}>
                    <View style={styles.logoBlock}>
                        <Text style={styles.logoText}>My Notes</Text>
                    </View>
                    <Row>
                        <View style={styles.buttonsBlock}>
                            <Button
                                title="Public notes"
                                type="white"
                                style={styles.button}
                                onPress={() => navigation.navigate('Notes')}
                            />
                            {(!authContext.isSignedIn && (
                                <>
                                    <Button
                                        title="Login"
                                        style={styles.button}
                                        onPress={() => {
                                            setLogin(true);
                                        }}
                                    />
                                    <Button
                                        title="Register"
                                        style={styles.button}
                                        onPress={() => setRegister(true)}
                                    />
                                </>
                            )) || (
                                <Button
                                    title="Logout"
                                    style={styles.button}
                                    onPress={() => authContext.signOut()}
                                />
                            )}
                        </View>
                    </Row>
                </View>
            </TouchableWithoutFeedback>
            {logIn && (
                <LoginPopUp
                    navigation={navigation}
                    onClose={() => {
                        setLogin(false);
                    }}
                />
            )}
            {register && (
                <RegisterPopUp
                    navigation={navigation}
                    onClose={() => {
                        setRegister(false);
                    }}
                />
            )}
        </ImageBackground>
    );
};

export default WellcomeScreen;
