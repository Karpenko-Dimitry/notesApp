import React, { useContext } from 'react';
import {
    View,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Keyboard,
    StyleSheet,
    Text,
    KeyboardAvoidingView,
} from 'react-native';
import { Icon } from 'react-native-eva-icons';
import Row from '../components/Row';
import { globalStyles } from '../../share/globalStyles';
import { popupContext } from '../../contexts/PopupContext';

const PopUpContainer = ({ children }) => {
    return Platform.OS === 'ios' ? (
        <KeyboardAvoidingView behavior="position">{children}</KeyboardAvoidingView>
    ) : (
        <View>{children}</View>
    );
};

const PopUp = ({ children, onClose, header }) => {
    const popup = useContext(popupContext);
    const handlerOnClose = () => {
        if (onClose) {
            onClose();
        }
        popup.setPopup('');
    };

    return (
        <PopUpContainer>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View
                    style={{
                        ...globalStyles.container,
                        ...styles.loginForm,
                        paddingBottom: 20
                    }}>
                    <Row style={styles.header}>
                        <View style={styles.headerItem}>
                            <TouchableOpacity
                                onPress={handlerOnClose}
                                style={{ alignSelf: 'flex-start' }}>
                                <Icon name="close-outline" fill="black" width={30} height={30} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.headerItem}>{header}</Text>
                        <Text style={styles.headerItem} />
                    </Row>
                    {children}
                </View>
            </TouchableWithoutFeedback>
        </PopUpContainer>
    );
};

const styles = StyleSheet.create({
    loginForm: {
        borderRadius: 20,
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor: 'white',
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#f2f2f2',
        borderBottomWidth: 1,
        paddingBottom: 10,
    },
    headerItem: {
        flex: 1,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
});

export default PopUp;
