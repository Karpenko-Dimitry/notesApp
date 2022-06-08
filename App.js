import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useContext } from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';

import { AuthProvider } from './app/contexts/AuthContext';
import { PopupProvider } from './app/contexts/PopupContext';
import PublicRoutes from './app/routes/PublicRoutes';

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
        <PopupProvider>
            <AuthProvider>
                <SafeAreaProvider>
                    <PublicRoutes />
                </SafeAreaProvider>
            </AuthProvider>
        </PopupProvider>
    );
};

export default App;
