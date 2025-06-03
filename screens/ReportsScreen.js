import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';

const ReportsScreen = ({ route, navigation }) => {
    const { user } = route.params;
    const [recipes, setRecipes] = useState([]);
    const [reports, setReports] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [recipesWithReportsCount, setRecipesWithReportsCount] = useState([]);

    useEffect(() => {
        getRecipes();
        getReports();

        const unsubscribe = navigation.addListener('focus', () => {
            getRecipes();
        });

        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        if (recipes.length > 0 && reports.length > 0) {
            const recipesWithCount = recipes.map(recipe => {
                const reportCount = reports.filter(report => report.recipeId === recipe.id).length;
                return { ...recipe, reportCount };
            })
            // Фильтруем рецепты, оставляем только те, у которых reportCount > 0
            .filter(recipe => recipe.reportCount > 0)
            // Сортируем по убыванию количества жалоб
            .sort((a, b) => b.reportCount - a.reportCount);
            
            setRecipesWithReportsCount(recipesWithCount);
        } else {
            setRecipesWithReportsCount([]);
        }
    }, [recipes, reports]);

    const getRecipes = () => {
        const requestOptions = {
            method: "GET",
        };
        fetch(`https://localhost:7108/api/Recipes`, requestOptions)
            .then((response) => response.json())
            .then(
                (data) => {
                    console.log("Data:", data);
                    setRecipes(data.filter(item => item.deletedBy === null));
                },
                (error) => {
                    console.log(error);
                }
            );
    };

    const getReports = () => {
        const requestOptions = {
            method: "GET",
        };
        fetch(`https://localhost:7108/api/Reports`, requestOptions)
            .then((response) => response.json())
            .then(
                (data) => {
                    console.log("Data:", data);
                    setReports(data);
                },
                (error) => {
                    console.log(error);
                }
            );
    };

    const renderRecipeItem = ({ item }) => {
        return (
            <TouchableOpacity 
                style={styles.recipeItem} 
                onPress={() => navigation.navigate('RecipeDetailsScreen', { recipe: item, user, favouriteItem: { id: 30, recipeId: 40 } })} 
            >
                <Image source={{ uri: item.imagePath }} style={styles.recipeImage} /> 
                <Text style={styles.recipeName}>{item.name}</Text>
                <Text style={styles.recipeCookingTime}>{item.categoryName} • {item.time}</Text>
                <Text style={styles.reportCount}>Количество жалоб: {item.reportCount}</Text>
            </TouchableOpacity>
        );
    };

    const filteredRecipes = recipesWithReportsCount.filter(recipe => 
        recipe.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Жалобы</Text>
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
            {filteredRecipes.length === 0 ? (
                <Text style={styles.noReportsText}>Нет рецептов с жалобами</Text>
            ) : (
                <FlatList
                    data={filteredRecipes}
                    renderItem={renderRecipeItem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={1} 
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
        marginBottom: 16,
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
    reportCount: {
        fontSize: 14,
        color: '#FF3B30',
        marginTop: 5,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 50,
        textAlign: 'center',
        color: '#3E5481',
    },
    noReportsText: {
        fontSize: 16,
        color: '#9FA5C0',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default ReportsScreen;