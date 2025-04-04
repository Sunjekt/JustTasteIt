import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const ProfileScreen = ({route, navigation}) => {
  const { user, setUser  } = route.params;
  const [recipes, setRecipes] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const removeFavourite = (removeId) =>
  setFavourites(favourites.filter(({ id }) => id !== removeId))

  useEffect(() => {
      getRecipes();
      getFavourites();

      const unsubscribe = navigation.addListener('focus', () => {
          getFavourites();
          getRecipes();
      });

      return unsubscribe;

  }, [setFavourites, navigation]);

  const getRecipes = () => {
    const requestOptions = {
        method: "GET",
    };
    fetch('https://localhost:7108/api/Recipes', requestOptions)
        .then((response) => response.json())
        .then(
            (data) => {
                console.log("Data:", data);
                setRecipes(data.filter(recipe => recipe.userId === user.id));
            },
            (error) => {
                console.log(error);
            }
        );
  };

  const getFavourites = () => {
    const requestOptions = {
        method: "GET",
    };
    fetch('https://localhost:7108/api/Favourites', requestOptions)
        .then((response) => response.json())
        .then(
            (data) => {
                console.log("Data:", data);
                setFavourites(data.filter(item => item.userId === user.id).map(fav => ({ recipeId: fav.recipeId, id: fav.id })));
                console.log(favourites);
            },
            (error) => {
                console.log(error);
            }
        );
};

const postFavorite = async (recipeId) => {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: user.id,
            recipeId: recipeId,
        }),
    };

    try {
        console.log(user.id, recipeId);
        const response = await fetch("https://localhost:7108/api/favourites", requestOptions);
        const data = await response.json();

        if (response.status === 201) {
            const newFavouriteId = data.id;
            setFavourites(prevFavourites => [...prevFavourites, { recipeId: recipeId, id: newFavouriteId }]);
            console.log("Успех");
        } else {
            if (data.error) {
                setErrorMessages(data.error);
            }
        }
    } catch (error) {
        console.log(error);
    }
};

const deleteFavourite = async (id) => {
    const requestOptions = {
        method: "DELETE",
    };

    try {
        const response = await fetch(`https://localhost:7108/api/favourites/${id}`, requestOptions);

        if (response.status === 204) {
            removeFavourite(id);
        } else {
            console.error("Не вышло");
        }
    } catch (error) {
        console.error(error);
    }
};

  const renderRecipeItem = ({ item }) => {
    const favouriteItem = favourites.find(fav => fav.recipeId === item.id);

    const handleFavoritePress = async () => {
        if (favouriteItem) {
            await deleteFavourite(favouriteItem.id);
        } else {
            await postFavorite(item.id);
        }
    };

    return ( 
        <TouchableOpacity 
            style={styles.recipeItem} 
            onPress={() => navigation.navigate('RecipeDetailsScreen', { recipe: item, user, favouriteItem })}
        >
            <Image source={{uri: item.imagePath}} style={styles.recipeImage} />
            <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoritePress}>
                    <Image source={require('../assets/favorite.png')} style={[styles.favoriteIcon, { tintColor: favouriteItem ? '#FF0000' : '#FFFFFF' }]} />
                </TouchableOpacity>
            <Text style={styles.recipeName}>{item.name}</Text>
            <Text style={styles.recipeCookingTime}>{item.category.name} • {item.time}</Text>
        </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton}>
        <Image
          source={require('../assets/logout.png')} 
          style={styles.logoutImage}
        />
      </TouchableOpacity>
  
      <View style={styles.profileContainer}>
        <Image
          source={require('../assets/registrationIcons/username.png')}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{user.userName}</Text>
        <Text style={styles.recipeCount}>{recipes.length} рецептов</Text>
      </View>
  
      <Text style={styles.recipesHeading}>Мои рецепты:</Text>
      <FlatList
        data={recipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={1}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3E5481',
  },
  recipeCount: {
    fontSize: 16,
    color: '#9FA5C0',
  },
  recipesHeading: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3E5481',
    marginBottom: 20,
  },
  recipeItem: {
    flex: 1, // Занимает равное пространство
    margin: 8, // Отступ между элементами

    backgroundColor: '#FFFFFF',
    borderRadius: 10,

},
recipeImage: {
    width: '100%',
    height: 150,
    borderRadius: 16,
    marginBottom: 8,
},
recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3E5481',
},
recipeCookingTime: {
    fontSize: 12,
    color: '#9FA5C0',
    marginTop: 5
},

  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
  },
  logoutImage: {
    width: 40,
    height: 40,
    tintColor: '#FF0000',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10, 
    right: 10, 
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    borderRadius: 10, 
    padding: 5, 
  },
  favoriteIcon: {
      width: 24, 
      height: 24, 
  },
});

export default ProfileScreen;
