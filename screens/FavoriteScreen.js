import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Image, ScrollView } from 'react-native';

const FavoriteScreen = ({ route, navigation }) => {
    const { user } = route.params;
    const [favourites, setFavourites] = useState([]);
    const [searchText, setSearchText] = useState('');
    const removeFavourite = (removeId) =>
        setFavourites(favourites.filter(({ id }) => id !== removeId))

    useEffect(() => {
        getFavourites();

        const unsubscribe = navigation.addListener('focus', () => {
            getFavourites(); // Обновляем избранные рецепты при фокусе на экране
        });

        return unsubscribe; // Убираем слушатель при размонтировании компонента
    }, [navigation, setFavourites]);


    const getFavourites = () => {
        const requestOptions = {
            method: "GET",
        };
        fetch(`https://localhost:7108/api/Favourites/ByUserId/${user.id}`, requestOptions)
            .then((response) => response.json())
            .then(
                (data) => {
                    console.log("Data:", data);
                    setFavourites(data);
                },
                (error) => {
                    console.log(error);
                }
            );
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

    const filteredRecipes = favourites.filter(favourite => 
        favourite.recipeName.toLowerCase().includes(searchText.toLowerCase())
    );

    const renderRecipeItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.recipeItem} 
            onPress={() => navigation.navigate('RecipeDetailsScreen', {
                recipe: {
                    id: item.recipeId,
                    name: item.recipeName,
                    time: item.recipeTime,
                    categoryName: item.recipeCategoryName,
                    imagePath: item.recipeImagePath,
                    portion: item.recipePortion,
                    description: item.recipeDescription
                },
                user, favouriteItem: {
                    id: item.id,
                    recipeId: item.recipeId
                }
            })}
        >
            <Image source={{uri: item.recipeImagePath}} style={styles.recipeImage} />
            <TouchableOpacity style={styles.favoriteButton} onPress={() => deleteFavourite(item.id)}>
                <Image source={require('../assets/favorite.png')} style={styles.favoriteIcon} />
            </TouchableOpacity>
            <Text style={styles.recipeName}>{item.recipeName}</Text>
            <Text style={styles.recipeCookingTime}>{item.recipeCategoryName} • {item.recipeTime}</Text>
        </TouchableOpacity>
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
    scrollView: {
        paddingBottom: 20, // Отступ внизу для удобства прокрутки
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
        fontSize: 15
      },
    listContainer: {
        paddingBottom: 16,
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
    favoriteButton: {
        position: 'absolute',
        top: 10, // Расположение иконки сверху
        right: 10, // Расположение иконки справа
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Полупрозрачный фон
        borderRadius: 10, // Круглая кнопка
        padding: 5, // Отступы вокруг иконки
    },
    favoriteIcon: {
        width: 24, // Ширина иконки
        height: 24, // Высота иконки
        tintColor: '#FF0000'
    },
});

export default FavoriteScreen;