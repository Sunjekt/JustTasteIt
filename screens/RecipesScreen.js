import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';

const RecipesScreen = ({ route, navigation }) => {
    const { category, user } = route.params;
    const [recipes, setRecipes] = useState([]);
    const [favourites, setFavourites] = useState([]);
    const [searchText, setSearchText] = useState('');

    const removeFavourite = (removeId) =>
        setFavourites(favourites.filter(({ id }) => id !== removeId));

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
                    setRecipes(data.filter(recipe => recipe.categoryId === category.id));
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
                <Image source={{ uri: item.imagePath }} style={styles.recipeImage} /> 
                <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoritePress}>
                    <Image source={require('../assets/favorite.png')} style={[styles.favoriteIcon, { tintColor: favouriteItem ? '#FF0000' : '#FFFFFF' }]} />
                </TouchableOpacity>
                <Text style={styles.recipeName}>{item.name}</Text>
                <Text style={styles.recipeCookingTime}>{category.name} • {item.time}</Text>
            </TouchableOpacity>
        );
    };

    const filteredRecipes = recipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Image source={require('../assets/search.png')} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Поиск"
                    placeholderTextColor="#9FA5C0"
                    autoCapitalize="none"
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>
            <FlatList
                data={filteredRecipes}
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
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#F4F5F7',
        borderRadius: 32,
        marginTop: 15,
        marginBottom: 15,
    },
    icon: {
        width: 24,
        height: 24,
        marginHorizontal: 20,
        tintColor: '#3E5481',
    },
    input: {
        height: 50,
        flex: 1,
        color: '#3E5481',
        fontSize: 15,
    },
    listContainer: {
        paddingBottom: 16,
    },
    recipeItem: {
        flex: 1, 
        margin: 8,
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
        marginTop: 5,
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

export default RecipesScreen;