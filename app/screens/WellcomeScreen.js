import React, { useState, useContext } from 'react';
import {
    FlatList,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    ImageBackground,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Modal,
    Keyboard,
} from 'react-native';
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
    logoText: {
        fontFamily: 'Hurricane-Regular',
        color: globalStyles.global.color_ylw,
        textAlign: 'center',
        fontSize: 35,
        letterSpacing: 5,
        textTransform: 'uppercase',
    },
});

const WellcomeScreen = () => {
    const [logIn, setLogin] = useState(false);
    const authContext = useContext(store);

    console.log(authContext.getToken());

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
                                style={{ marginVertical: 20 }}
                                title="Login"
                                onPress={() => {
                                    setLogin(true);
                                }}
                            />
                            <Button title="Register" onPress={() => setLogin(true)} />
                        </View>
                    </Row>
                </View>
            </TouchableWithoutFeedback>

            {logIn && <LoginPopUp onClose={() => setLogin(false)} />}
        </ImageBackground>
    );
};

export default WellcomeScreen;
