import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const RecipeDetailsScreen = ({ route, navigation }) => {
    const { recipe, user, favouriteItem } = route.params;

    const [ingredients, setIngredients] = useState([]);
    const [steps, setSteps] = useState([]);
    const [isRecipeFavorite, setIsRecipeFavorite] = useState(favouriteItem);

    useEffect(() => {
        getIngredients();
        getSteps();
    }, [isRecipeFavorite]);

    const getIngredients = () => {
        const requestOptions = {
            method: "GET",
        };
        fetch('https://localhost:7108/api/Ingredients', requestOptions)
            .then((response) => response.json())
            .then(
                (data) => {
                    console.log("Data:", data);
                    setIngredients(data.filter(ingredient => ingredient.recipeId === recipe.id));
                },
                (error) => {
                    console.log(error);
                }
            );
    };

    const getSteps = () => {
        const requestOptions = {
            method: "GET",
        };
        fetch('https://localhost:7108/api/RecipeSteps', requestOptions)
            .then((response) => response.json())
            .then(
                (data) => {
                    console.log("Data:", data);
                    const sortedSteps = data.filter(step => step.recipeId === recipe.id).sort((a, b) => a.number - b.number);
                    setSteps(sortedSteps);
                    },
                (error) => {
                    console.log(error);
                }
            );
    };

    const postFavorite = async () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: user.id,
                recipeId: recipe.id,
            }),
        };
    
        try {
            const response = await fetch("https://localhost:7108/api/favourites", requestOptions);
            const data = await response.json();
    
            if (response.status === 201) {
                const newFavouriteId = data.id;
                setIsRecipeFavorite({ recipeId: recipe.id, id: newFavouriteId });
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
                setIsRecipeFavorite(null);
            } else {
                console.error("Не вышло");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleFavoritePress = async () => {
        if (isRecipeFavorite) {
            await deleteFavourite(favouriteItem.id);
        } else {
            await postFavorite();
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
                <Image source={{uri: recipe.imagePath}} style={styles.recipeImage} />
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Image source={require('../assets/arrowBack.png')} style={styles.backIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoritePress}>
                    <Image source={require('../assets/favorite.png')} style={[styles.favoriteIcon, { tintColor: isRecipeFavorite ? '#FF0000' : '#FFFFFF' }]}  />
                </TouchableOpacity>
                <View style={styles.detailsContainer}>
                    <Text style={styles.heading}>{recipe.name}</Text>
                    <View style={styles.footer}>
                        <View style={styles.footerLeft}>
                            <Text style={styles.title}>{recipe.category.name} • {recipe.time}</Text>
                        </View>
                        <View style={styles.footerRight}>
                            <Text style={styles.recipeAuthor}>Порций: {recipe.portion}</Text>
                        </View>
                    </View>
                    <View style={styles.separator} />
                    <Text style={styles.heading}>Описание</Text>
                    <Text style={styles.title}>{recipe.description}</Text>
                    <View style={styles.separator} />
                    <Text style={styles.heading}>Ингредиенты</Text>
                    {ingredients.map(ingredient => (
                        <View key={ingredient.id} style={styles.footerLeft}>
                            <Image source={require('../assets/mark.png')} style={styles.icon} />
                            <Text style={styles.ingredientText}>
                                {ingredient.ingredientName.name}: {ingredient.count} {ingredient.measurement.name} 
                            </Text>
                        </View>
                    ))}
                    <View style={styles.separator} />
                    <Text style={styles.heading}>Шаги</Text>
                    {steps.map(step => (
                        <View key={step.id} style={styles.stepContainer}>
                            <View style={styles.stepNumberContainer}>
                                <Text style={styles.stepNumber}>{step.number}</Text>
                            </View>
                            <View style={styles.stepDescriptionContainer}>
                                <Text style={styles.stepDescription}>{step.description}</Text>
                                {step.imagePath && (
                                    <Image source={{uri: step.imagePath}} style={styles.stepImage} />
                                )}
                            </View>
                        </View>
                    ))}

                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollView: {
        paddingBottom: 20, // Отступ внизу для удобства прокрутки
    },
    recipeImage: {
        width: '100%',
        height: 350,
    },
    detailsContainer: {
        backgroundColor: '#FFFFFF', // Фон для контейнера
        padding: 20,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: -30, // Поднимает контейнер вверх, чтобы он накладывался на изображение
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3E5481',
        marginBottom: 8,
    },
    ingredientText: {
        fontSize: 17,
        color: '#3E5481',
    },
    recipeAuthor: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3E5481',
        marginTop: 4,
    },
    title: {
        fontSize: 15,
        color: '#9FA5C0',
    },
    favoriteButton: {
        position: 'absolute',
        top: 50, // Расположение иконки сверху
        right: 15, // Расположение иконки справа
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Полупрозрачный фон
        borderRadius: 10, // Круглая кнопка
        padding: 5, // Отступы вокруг иконки
    },
    favoriteIcon: {
        width: 35, // Ширина иконки
        height: 35, // Высота иконки
    },
    backButton: {
        position: 'absolute',
        top: 50, // Расположение иконки сверху
        left: 15, // Расположение иконки слева
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Полупрозрачный фон
        borderRadius: 50, // Круглая кнопка
        padding: 5, // Отступы вокруг иконки
    },
    backIcon: {
        width: 35, // Ширина иконки
        height: 35, // Высота иконки
        tintColor: '#FFFFFF',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Распределяет пространство между элементами
        alignItems: 'center', // Выравнивает элементы по центру по вертикали
        marginTop: 0,
    },
    footerLeft: {
        flexDirection: 'row',
        alignItems: 'center', // Выравнивает элементы по центру по вертикали
        marginVertical: 5
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 7, // Отступ между иконкой и именем автора
    },
    separator: {
        height: 2,
        backgroundColor: '#D0DBEA',
        marginVertical: 20,
    },
    stepContainer: {
        flexDirection: 'row', // Располагает элементы в строку
        alignItems: 'flex-start', // Выравнивает элементы по верхнему краю
        marginVertical: 10, // Отступ между шагами
    },
    stepNumberContainer: {
        width: 25, // Ширина круга
        height: 25, // Высота круга
        borderRadius: 20, // Полукруг для создания круга
        backgroundColor: '#3E5481', // Цвет фона круга
        justifyContent: 'center', // Центрирует содержимое по вертикали
        alignItems: 'center', // Центрирует содержимое по горизонтали
        marginRight: 10, // Отступ между кругом и описанием
    },
    stepNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF', // Цвет текста внутри круга
    },
    stepDescriptionContainer: {
        flex: 1, // Занимает оставшееся пространство
    },
    stepDescription: {
        fontSize: 16,
        color: '#3E5481',
        marginBottom: 5, // Отступ между описанием и изображением
    },
    stepImage: {
        width: '100%', // Ширина изображения
        height: 200, // Высота изображения
        borderRadius: 10, // Закругленные углы
    },
});

export default RecipeDetailsScreen;