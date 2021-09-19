import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './pages/Home';
import Readit from './pages/Readit';
import Profile from './pages/Profile';

import Navbar from './components/Navbar';
import Listen from './pages/Listen';
import MovieLines from './pages/Readit/MovieLines';
import Shakespeare from './pages/Readit/Shakespeare';
import Onboarding from './pages/Onboarding';
import Register from './pages/Register';
import Login from './pages/Login';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={Login} />

        <Stack.Screen name="Home" component={Home} />

        <Stack.Screen name="Readit" component={Readit} />
        <Stack.Screen name="Movie Lines" component={MovieLines} />
        <Stack.Screen name="Shakespeare" component={Shakespeare} />

        <Stack.Screen name="Listen" component={Listen} />

        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>

      <Navbar />
    </NavigationContainer>
  );
}