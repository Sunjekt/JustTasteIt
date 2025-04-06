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

const Stack = createNativeStackNavigator();

export default function App() {

  const [user, setUser] = useState({ isAuthenticated: false, id: "", userName: "", ImagePath: ""});

  useEffect(() => {
      const getUser  = async () => {
          try {
              const response = await fetch("https://localhost:7108/api/account/isauthenticated", {
                method: 'GET',
                credentials: 'include',
            });
              if (response.status === 401) {
                  setUser ({ isAuthenticated: false, id: "", userName: "", ImagePath: ""});
              } else {
                  const data = await response.json();
                  if (data && data.userName && data.userRole) {
                      setUser ({ isAuthenticated: true, id: data.id, userName: data.userName});
                  }
              }
          } catch (error) {
              console.log(error);
          }
      };
      getUser ();
  }, [setUser ]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
