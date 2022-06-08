import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { Icon } from 'react-native-eva-icons';
import { store } from '../../contexts/AuthContext';
import { popupContext } from '../../contexts/PopupContext';
import LanguageService from '../../services/LanguageService';
import { globalStyles, borderColor, textColor } from '../../share/globalStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Header = ({ params }) => {
    const insets = useSafeAreaInsets();
    const { navigation, route, options, back } = params;

    const [languages, setLaguages] = useState([]);
    const auth = useContext(store);
    const popup = useContext(popupContext);

    useEffect(() => {
        LanguageService.list().then((res) => setLaguages(res.data.data));
    }, []);

    const styles = StyleSheet.create({
        container: {
            backgroundColor: '#ededed',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 14,
            paddingTop: insets.top || 20,
        },
        text: {
            textTransform: 'uppercase',
            letterSpacing: 1,
            fontSize: 16,
            fontWeight: 'bold',
            color: textColor,
        },
        icon: {
            fill: textColor,
            width: 30,
            height: 30,
        },
    });

    return (
        <View style={{ ...styles.container, ...styles.main }}>
            {back ? (
                <TouchableOpacity onPress={navigation.goBack}>
                    <Icon name="undo-outline" style={styles.icon} />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={navigation.openDrawer}>
                    <Icon name="menu-outline" style={styles.icon} />
                </TouchableOpacity>
            )}
            <Text style={styles.text}>{options.title || route.title}</Text>

            {auth.isSignedIn && (
                <TouchableOpacity
                    onPress={() => navigation.navigate('Note edit', { title: 'Create note' })}>
                    <Icon name="plus-square-outline" style={styles.icon} />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default Header;
