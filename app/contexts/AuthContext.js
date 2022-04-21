import React from 'react';
import { createContext, useReducer, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService from '../services/AuthService';
import { Platform } from 'react-native';

export const store = createContext();
const { Provider } = store;

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(
        (prevState, action) => {
            switch (action.type) {
                case 'RESTORE_TOKEN':
                    return {
                        ...prevState,
                        isLoading: false,
                        isSignedIn: !!action.token,
                        token: action.token,
                    };
                case 'SIGN_IN':
                    return {
                        ...prevState,
                        isSignedIn: true,
                        token: action.token,
                    };
                case 'SIGN_OUT':
                    return {
                        ...prevState,
                        isSignedIn: false,
                        token: null,
                    };
            }
        },
        { isLoading: true, isSignedIn: null, token: null },
    );

    const authContext = useMemo(
        () => ({
            signIn: async (access_token) => {
                await AsyncStorage.setItem('access_token', access_token);
                dispatch({ type: 'SIGN_IN', token: access_token });
            },
            signOut: async () => {
                const access_token = await AsyncStorage.getItem('access_token');
                const notification_token = await AsyncStorage.getItem('notification_token');

                if (access_token) {
                    try {
                        if (notification_token) {
                            await AuthService.signOut(
                                { ios: 'apn', android: 'firebase' }[Platform.OS],
                                notification_token,
                            );
                        }
                    } catch (e) {
                        console.error(e);
                    }

                    await AsyncStorage.removeItem('access_token');
                    dispatch({ type: 'SIGN_OUT' });
                }
            },
            isSignedIn: state.isSignedIn,
            isLoading: state.isLoading,
            getToken: () => state.token,
            restoreToken: () => {
                AsyncStorage.getItem('access_token').then((access_token) => {
                    dispatch({
                        type: 'RESTORE_TOKEN',
                        token: access_token,
                    });
                });
            },
        }),
        [state.isSignedIn, state.token, state.isLoading],
    );

    return <Provider value={authContext}>{children}</Provider>;
};

export default { store, AuthProvider };
