import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { store } from '../../contexts/AuthContext';
import { borderColor } from '../../share/globalStyles';
import { Icon } from 'react-native-eva-icons';
import AuthService from '../../services/AuthService';

const DrowerMenu = ({ route, navigation }) => {
    const { signOut } = useContext(store);
    const [user, setUser] = useState(null);

    const menuItems = [
        {
            icon: 'home-outline',
            name: 'All notes',
            screen: 'DrowerNotelist',
            params: { title: 'All notes', filter: {} },
        },
        {
            icon: 'person-outline',
            name: 'Profile',
            screen: 'DrowerProfile',
            params: { title: 'Profile', user },
        },
        {
            icon: 'book-open-outline',
            name: 'My notes',
            screen: 'DrowerNotelist',
            params: { title: 'My notes', user_id: user?.id},
        },
        {
            icon: 'log-out-outline',
            name: 'Log out',
            onPress: () => signOut(),
        },
    ];

    useEffect(() => {
        AuthService.profile().then(
            (res) => {
                setUser(res.data.data);
            },
            (res) => {
                if (res.status === 401) {
                    signOut().then(() => navigation.navigate('Wellcome'));
                }
            },
        );
    }, [navigation, signOut]);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingVertical: 15,
        },
        top: {},
        topText: {
            fontFamily: 'Hurricane-Regular',
            textAlign: 'center',
            fontSize: 25,
            letterSpacing: 5,
            textTransform: 'uppercase',
        },
        menuContainer: {
            flex: 1,
        },
        menuItem: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: borderColor,
        },
        menuItemText: {
            fontSize: 16,
        },
        menuItemIcon: {
            width: 22,
            height: 22,
            fill: 'grey',
            marginRight: 10,
        },
        closeIcon: {
            width: 30,
            height: 30,
            alignSelf: 'flex-end',
            fill: 'black',
            marginRight: 10,
        },
    });

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.top}>
                    <TouchableOpacity onPress={navigation.closeDrawer}>
                        <Icon style={styles.closeIcon} name="close-outline" />
                    </TouchableOpacity>
                    <Text style={styles.topText}>Notes</Text>
                </View>
                <ScrollView style={styles.menuContainer}>
                    {menuItems.map((item, key) => (
                        <TouchableOpacity
                            key={key}
                            style={styles.menuItem}
                            onPress={() => {
                                item.onPress
                                    ? item.onPress()
                                    : item.screen
                                    ? navigation.navigate(item.screen, item.params || {})
                                    : null;
                            }}>
                            <View>
                                <Icon style={styles.menuItemIcon} name={item.icon} />
                            </View>
                            <Text style={styles.menuItemText}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default DrowerMenu;
