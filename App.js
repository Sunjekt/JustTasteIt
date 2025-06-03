import React, { useEffect, useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './screens/SplashScreen';
import MainTabs from './screens/MainTabs';
import RegistrationScreen from './screens/RegistrationScreen';
import LoginScreen from './screens/LoginScreen';
import RecipesScreen from './screens/RecipesScreen';
import RecipeDetailsScreen from './screens/RecipeDetailsScreen';
import FavoriteScreen from './screens/FavoriteScreen';
import ProfileScreen from './screens/ProfileScreen';
import RecipeSearchScreen from './screens/RecipeSearchScreen';
import UsersScreen from './screens/UsersScreen';
import ReportsScreen from './screens/ReportsScreen';
import StatementScreen from './screens/StatementScreen';
import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState({ 
    isAuthenticated: false, 
    id: "", 
    userName: "", 
    imagePath: "",
    userRole: "" 
  });
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("https://localhost:7108/api/account/isauthenticated", {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          if (data?.userName) {
            setUser({ 
              isAuthenticated: true, 
              id: data.id, 
              userName: data.userName, 
              imagePath: data.imagePath,
              userRole: data.userRole 
            });
            console.log("Data: ", data);
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsAuthCheckComplete(true);
      }
    };

    checkAuth();
  }, []);

  if (!isAuthCheckComplete) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={user.isAuthenticated ? "Main" : "Splash"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen} 
          options={{ headerShown: false }} 
          initialParams={{ user, setUser }}
        />
        <Stack.Screen 
          name="Registration" 
          component={RegistrationScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Main" 
          component={MainTabs} 
          options={{ headerShown: false }}
          initialParams={{ user, setUser }}
        />
        <Stack.Screen 
          name="Recipes" 
          component={RecipesScreen} 
          options={{ headerShown: true }} 
        />
        <Stack.Screen 
          name="Favorites" 
          component={FavoriteScreen} 
          options={{ headerShown: true }} 
        />
        <Stack.Screen 
          name="RecipeDetailsScreen" 
          component={RecipeDetailsScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ProfileScreen" 
          component={ProfileScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="RecipeSearchScreen" 
          component={RecipeSearchScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="UsersScreen" 
          component={UsersScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Reports" 
          component={ReportsScreen} 
          options={{ headerShown: true }} 
        />
        <Stack.Screen 
          name="StatementaScreen" 
          component={StatementScreen} 
          options={{ headerShown: true }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}