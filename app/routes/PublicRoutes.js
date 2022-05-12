import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WellcomeScreen from '../screens/WellcomeScreen';
import NotesListScreen from '../screens/NotesListScreen';
import NotesDetailesScreen from '../screens/NotesDetailesScreen';
import { store } from '../contexts/AuthContext';

const Stack = createNativeStackNavigator();

const PublicRoutes = () => {
    const { isSignedIn } = useContext(store);

    console.log(isSignedIn ? 'da' : 'net');
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={isSignedIn ? 'Notes' : 'Wellcome'}>
                <Stack.Screen
                    name="Wellcome"
                    options={{ headerShown: false }}
                    component={WellcomeScreen}
                />
                <Stack.Screen name="Notes" component={NotesListScreen} />
                <Stack.Screen
                    name="NotesDetailes"
                    component={NotesDetailesScreen}
                    options={({ route }) => ({ title: route.params.title })}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default PublicRoutes;
