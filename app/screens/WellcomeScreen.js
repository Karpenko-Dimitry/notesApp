import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import { globalStyles } from '../share/globalStyles';
import Button from '../elements/components/Button';
import LoginPopUp from '../elements/pop-ups/LoginPopUp';
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
    button: {
        marginVertical: 10,
    },
    logoText: {
        fontFamily: 'Hurricane-Regular',
        color: globalStyles.global.color_ylw,
        textAlign: 'center',
        fontSize: 35,
        letterSpacing: 5,
        textTransform: 'uppercase',
    },
});

const WellcomeScreen = ({ navigation }) => {
    const [logIn, setLogin] = useState(false);
    const authContext = useContext(store);

    const imgBg = require('../../assets/images/auth-background.jpg');

    return (
        <ImageBackground style={styles.container} source={imgBg}>
            <TouchableWithoutFeedback
                onPress={() => {
                    setLogin(false);
                    console.log(1);
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
                                onPress={() => setLogin(true)}
                            />
                        </View>
                    </Row>
                </View>
            </TouchableWithoutFeedback>

            {logIn && (
                <LoginPopUp
                    navigation={navigation}
                    onClose={() => {
                        setLogin(false);
                        console.log('closed');
                    }}
                />
            )}
        </ImageBackground>
    );
};

export default WellcomeScreen;
