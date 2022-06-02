import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-eva-icons';
import { store } from '../../contexts/AuthContext';
import { popupContext } from '../../contexts/PopupContext';
import LanguageService from '../../services/LanguageService';
import { globalStyles, borderColor, textColor } from '../../share/globalStyles';
const Header = ({ params }) => {
    const { navigation, route, options, back } = params;

    const [languages, setLaguages] = useState([]);
    const auth = useContext(store);
    const popup = useContext(popupContext);

    useEffect(() => {
        LanguageService.list().then((res) => setLaguages(res.data.data));
    }, []);

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: textColor
        },
        text: {
            textTransform: 'uppercase',
            letterSpacing: 1,
            fontSize: 16,
            fontWeight: 'bold',
            color: textColor
        },
        icon: {
            fill: textColor,
            width: 30,
            height: 30
        }
    });

    return (
        <View style={{...styles.container, ...styles.main}}>

            {back && (
                <TouchableOpacity onPress={navigation.goBack}>
                    <Icon name="undo-outline" style={styles.icon} />
                </TouchableOpacity>
            )}
            <Text style={styles.text}>{options.title}</Text>
            {languages.length > 0 &&
                languages.map((language) => (
                    <View key={language.id}>
                        <TouchableOpacity onPress={() => console.log(language.type)}>
                            <View>
                                <Text style={styles.text}>{language.type}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))}
            {auth.isSignedIn && (
                <TouchableOpacity onPress={() => navigation.navigate('Note edit')}>
                    <Icon name="plus-square-outline" style={styles.icon} />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default Header;
