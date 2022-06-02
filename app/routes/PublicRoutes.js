import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WellcomeScreen from '../screens/WellcomeScreen';
import NotesListScreen from '../screens/NotesListScreen';
import NotesDetailesScreen from '../screens/NotesDetailesScreen';
import { store } from '../contexts/AuthContext';
import Header from '../elements/components/Header';
import { popupContext } from '../contexts/PopupContext';
import CreatePopUp from '../elements/pop-ups/CreatePopUp';
import NoteEditScreen from '../screens/NoteEditScreen';
const Stack = createNativeStackNavigator();

const PublicRoutes = () => {
    const auth = useContext(store);
    const popup = useContext(popupContext);

    useEffect(() => {
        auth.restoreToken();
    }, [auth]);

    return (
        <>
            {auth.isSignedIn != null && (
                <NavigationContainer>
                    <Stack.Navigator
                        screenOptions={{
                            header: (params) => <Header params={params} />,
                        }}
                        initialRouteName={auth.isSignedIn ? 'Notes' : 'Wellcome'}>
                        <Stack.Screen
                            name="Wellcome"
                            options={{ headerShown: false }}
                            component={WellcomeScreen}
                        />
                        <Stack.Screen name="Notes" component={NotesListScreen} />
                        <Stack.Screen name="Note edit" component={NoteEditScreen} />
                        <Stack.Screen
                            name="NotesDetailes"
                            component={NotesDetailesScreen}
                            options={({ route }) => ({ title: route.params.title })}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            )}
            {popup.popupName == 'create' && <CreatePopUp />}
        </>
    );
};

export default PublicRoutes;
