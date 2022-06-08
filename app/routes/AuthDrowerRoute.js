import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import NotesListScreen from '../screens/NotesListScreen';
import Header from '../elements/components/Header';
import DrowerMenu from '../elements/components/DrowerMenu';
import ProfileScreen from '../screens/ProfileScreen';
import NotesDetailesScreen from '../screens/NotesDetailesScreen';
const Drawer = createDrawerNavigator();

const AuthDroweRoute = () => {
    return (
        <Drawer.Navigator
            screenOptions={{
                // headerShown: true,
                header: (params) => <Header params={params} />,
            }}
            drawerContent={(props) => <DrowerMenu {...props} />}>
            <Drawer.Screen
                options={({ route }) => ({ title: route.params?.title })}
                name="DrowerNotelist"
                component={NotesListScreen}
            />
            <Drawer.Screen
                options={({ route }) => ({ title: route.params?.title })}
                name="DrowerProfile"
                component={ProfileScreen}
            />
            <Drawer.Screen
                name="DrowerNotesDetailes"
                component={NotesDetailesScreen}
                options={({ route }) => ({ title: route.params?.title })}
            />
        </Drawer.Navigator>
    );
};

export default AuthDroweRoute;
