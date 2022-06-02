import React, { useContext} from 'react';
import { SafeAreaView, StatusBar, StyleSheet, useColorScheme } from 'react-native';

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
        <SafeAreaView style={{ ...backgroundStyle, ...{ flex: 1 } }}>
            <PopupProvider>
                <AuthProvider>
                    <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
                    <PublicRoutes />                    
                </AuthProvider>
            </PopupProvider>
        </SafeAreaView>
    );
};

export default App;
