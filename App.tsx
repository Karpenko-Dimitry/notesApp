import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';

const App = () => {
    const isDarkMode = useColorScheme() === 'dark';
    console.log(useColorScheme())
    const backgroundStyle = {
        backgroundColor: isDarkMode ? 'black' :'white',
    };

    return (
        <SafeAreaView style={backgroundStyle}>
            <StatusBar barStyle={'light-content'} />
            <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
               
            </ScrollView>
        </SafeAreaView>
    );
};

export default App;
