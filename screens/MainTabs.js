import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'react-native';

import CreateScreen from './CreateScreen';
import FavoriteScreen from './FavoriteScreen';
import ProfileScreen from './ProfileScreen';

import CategoryScreen from './CategoryScreen';
import RecipesScreen from './RecipesScreen';
import RecipeDetailsScreen from './RecipeDetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="CategoryScreen" 
                component={CategoryScreen} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="RecipesScreen" 
                component={RecipesScreen} 
                options={{ title: 'Рецепты' }} 
            />
            <Stack.Screen 
                name="RecipeDetailsScreen" 
                component={RecipeDetailsScreen} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="FavoriteScreen" 
                component={FavoriteScreen} 
                options={{ title: 'Избранное' }} // Добавьте заголовок, если нужно
            />
        </Stack.Navigator>
    );
}

function MainTabs() {
    return (
        <Tab.Navigator 
            initialRouteName="Главный экран"
            screenOptions={{
                tabBarActiveTintColor: '#1FCC79',
            }}
        >
            <Tab.Screen 
                name="Главный экран" 
                component={HomeStack} // Используйте стек для главного экрана
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Image 
                            source={require('../assets/screensIcons/home.png')}
                            style={{ width: size, height: size, tintColor: color }}
                        />
                    ),
                    tabBarLabel: () => null,
                }} 
            />
            <Tab.Screen 
                name="Создание рецепта" 
                component={CreateScreen} 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Image 
                            source={require('../assets/screensIcons/create.png')}
                            style={{ width: size, height: size, tintColor: color }}
                        />
                    ),
                    tabBarLabel: () => null,
                }} 
            />
            <Tab.Screen 
                name="Избранное" 
                component={FavoriteScreen} 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Image 
                            source={require('../assets/screensIcons/favorite.png')}
                            style={{ width: size, height: size, tintColor: color }}
                        />
                    ),
                    tabBarLabel: () => null,
                }} 
            />
            <Tab.Screen 
                name="Профиль"
                component={ProfileScreen} 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Image 
                            source={require('../assets/screensIcons/profile.png')}
                            style={{ width: size, height: size, tintColor: color }}
                        />
                    ),
                    tabBarLabel: () => null,
                }} 
            />
        </Tab.Navigator>
    );
}

export default MainTabs;