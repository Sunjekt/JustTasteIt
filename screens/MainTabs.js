import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'react-native';

import CreateScreen from './CreateScreen';
import FavoriteScreen from './FavoriteScreen';
import ProfileScreen from './ProfileScreen';

import RecipeSearchScreen from './RecipeSearchScreen';

import CategoryScreen from './CategoryScreen';
import RecipesScreen from './RecipesScreen';
import RecipeDetailsScreen from './RecipeDetailsScreen';

import UsersScreen from './UsersScreen';
import ReportsScreen from './ReportsScreen';
import StatementScreen from './StatementScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack({route}) {
    const { user, setUser } = route.params;
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="CategoryScreen" 
                component={CategoryScreen} 
                initialParams={{ user }}
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
                initialParams={{ user }}
                options={{ title: 'Избранное' }} 
            />
            <Stack.Screen 
                name="RecipeSearchScreen" 
                component={RecipeSearchScreen} 
                initialParams={{ user }}
                options={{ title: 'Поиск рецептов' }} 
            />
            <Stack.Screen 
                name="ReportsScreen" 
                component={ReportsScreen} 
                initialParams={{ user }}
                options={{ title: 'Жалобы' }} 
            />
        </Stack.Navigator>
    );
}

function MainTabs({route}) {

    const { user, setUser } = route.params;

    return (
        <Tab.Navigator 
            initialRouteName="Главный экран"
            screenOptions={{
                tabBarActiveTintColor: '#1FCC79',
            }}
        >
            <Tab.Screen 
                name="Главный экран" 
                component={HomeStack}
                initialParams={{ user, setUser  }}
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
            {user.userRole === 'user' && (
                <>
                    <Tab.Screen 
                        name="Поиск рецептов" 
                        component={RecipeSearchScreen}
                        initialParams={{ user, setUser  }}
                        options={{
                            headerTitleStyle: {
                                color: '#3E5481',
                            },
                            tabBarIcon: ({ color, size }) => (
                                <Image 
                                    source={require('../assets/screensIcons/search.png')}
                                    style={{ width: size, height: size, tintColor: color }}
                                />
                            ),
                            tabBarLabel: () => null,
                        }} 
                    />
                    <Tab.Screen 
                        name="Создание рецепта" 
                        component={CreateScreen}
                        initialParams={{ user, setUser  }} 
                        options={{
                            headerTitleStyle: {
                                color: '#3E5481',
                            },
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
                        initialParams={{ user }}
                        options={{
                            headerTitleStyle: {
                                color: '#3E5481',
                            },
                            tabBarIcon: ({ color, size }) => (
                                <Image 
                                    source={require('../assets/screensIcons/favorite.png')}
                                    style={{ width: size, height: size, tintColor: color }}
                                />
                            ),
                            tabBarLabel: () => null,
                        }} 
                    />
                </>
            )}
            {user.userRole === 'admin' && (
                <>
                    <Tab.Screen 
                        name="Пользователи"
                        component={UsersScreen}
                        initialParams={{ user, setUser  }}
                        options={{
                            headerTitleStyle: {
                                color: '#3E5481',
                            },
                            headerShown: false,
                            tabBarIcon: ({ color, size }) => (
                                <Image 
                                    source={require('../assets/screensIcons/users.png')}
                                    style={{ width: size, height: size, tintColor: color }}
                                />
                            ),
                            tabBarLabel: () => null,
                        }} 
                    />
                    <Tab.Screen 
                    name="Жалобы"
                    component={ReportsScreen}
                    initialParams={{ user, setUser  }}
                    options={{
                        headerTitleStyle: {
                            color: '#3E5481',
                        },
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <Image 
                                source={require('../assets/report.png')}
                                style={{ width: size, height: size, tintColor: color }}
                            />
                        ),
                        tabBarLabel: () => null,
                    }} 
                    />
                    <Tab.Screen 
                    name="Отчеты"
                    component={StatementScreen}
                    initialParams={{ user, setUser  }}
                    options={{
                        headerTitleStyle: {
                            color: '#3E5481',
                        },
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <Image 
                                source={require('../assets/screensIcons/statement.png')}
                                style={{ width: size, height: size, tintColor: color }}
                            />
                        ),
                        tabBarLabel: () => null,
                    }} 
                    />
                </>
            )}
            
            <Tab.Screen 
                name="Профиль"
                component={ProfileScreen}
                initialParams={{ user, setUser  }}
                options={{
                    headerTitleStyle: {
                        color: '#3E5481',
                    },
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