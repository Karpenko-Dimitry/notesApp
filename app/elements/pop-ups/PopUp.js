import React from 'react';
import {
    View,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Keyboard,
    StyleSheet,
    Text,
} from 'react-native';
import { Icon } from 'react-native-eva-icons';
import Row from '../components/Row';
import { globalStyles } from '../../share/globalStyles';

const PopUp = ({ children, onClose }) => {
    return (
        <View
            style={{
                ...globalStyles.container,
                ...styles.loginForm,
            }}>
            <Row style={styles.header}>
                <View style={styles.headerItem}>
                    <TouchableOpacity onPress={onClose} style={{ alignSelf: 'flex-start' }}>
                        <Icon name="close-outline" fill="black" width={30} height={30} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.headerItem}>Login</Text>
                <Text style={styles.headerItem} />
            </Row>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    loginForm: {
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
