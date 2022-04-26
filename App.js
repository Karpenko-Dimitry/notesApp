import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, useColorScheme } from 'react-native';

import WellcomeScreen from './app/screens/WellcomeScreen';
import { AuthProvider } from './app/contexts/AuthContext';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
});

const App = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? 'black' : 'white',
    };

    return (
        <SafeAreaView style={{ ...backgroundStyle, ...{ flex: 1 } }}>
            <AuthProvider>
                <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
                <WellcomeScreen />
            </AuthProvider>
        </SafeAreaView>
    );
};

export default App;
