import React from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Image, ScrollView } from 'react-native';

const RecipesScreen = ({ route, navigation }) => {
    const { category } = route.params;

   
    const recipes = [
        { 
            id: 1, 
            name: 'Пирог', 
            author: 'Иван Иванов', 
            description: 'Очень вкусно, из простых продуктов, праздник каждый день!', 
            servings: 2, 
            cookingTime: '>60 мин', 
            categoryId: 1,
            categoryName: 'Завтрак',
            image: require('../assets/testRecipe.png'),
            ingredients: [],
            steps: [],
        },
        { 
            id: 2, 
            name: 'Салат Цезарь', 
            author: 'Мария Петрова', 
            description: 'Классический салат Цезарь с курицей.', 
            servings: 4, 
            cookingTime: '>20 мин', 
            categoryId: 1,
            categoryName: 'Салаты',
            image: require('../assets/testRecipe.png'),
            ingredients: [],
            steps: [],
        },
        { 
            id: 3, 
            name: 'Паста', 
            author: 'Алексей Смирнов', 
            description: 'Паста с томатным соусом и базиликом.', 
            servings: 3, 
            cookingTime: '>30 мин', 
            categoryId: 1,
            categoryName: 'Ужин',
            image: require('../assets/testRecipe.png'), 
            ingredients: [],
            steps: [],
        },
        { 
            id: 4, 
            name: 'Торт', 
            author: 'Елена Кузнецова', 
            description: 'Шоколадный торт с кремом.', 
            servings: 8, 
            cookingTime: '>1 час', 
            categoryId: 1,
            categoryName: 'Десерты',
            image: require('../assets/testRecipe.png'), 
            ingredients: [],
            steps: [],
        },
        { 
            id: 5, 
            name: 'Бутерброды', 
            author: 'Светлана Васильева', 
            description: 'Бутерброды с ветчиной и сыром.', 
            servings: 2, 
            cookingTime: '>10 мин', 
            categoryId: 1,
            categoryName: 'Закуски',
            image: require('../assets/testRecipe.png'), 
            ingredients: [],
            steps: [],
        },
        { 
            id: 6, 
            name: 'Яичница', 
            author: 'Дмитрий Федоров', 
            description: 'Простая яичница с помидорами.', 
            servings: 1, 
            cookingTime: '>5 мин', 
            categoryId: 1,
            categoryName: 'Завтрак',
            image: require('../assets/testRecipe.png'),
            ingredients: [],
            steps: [],
        },
        { 
            id: 7, 
            name: 'Куриный суп', 
            author: 'Анна Сергеева', 
            description: 'Суп с курицей и овощами.', 
            servings: 4, 
            cookingTime: '>40 мин', 
            categoryId: 1,
            categoryName: 'Ужин',
            image: require('../assets/testRecipe.png'),
            ingredients: [],
            steps: [],
        },
    ];

    // Фильтруем рецепты по выбранной категории
    const filteredRecipes = recipes.filter(recipe => recipe.categoryId === category.id);

    const renderRecipeItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.recipeItem} 
            onPress={() => navigation.navigate('RecipeDetailsScreen', { recipe: item })} 
        >
            <Image source={item.image} style={styles.recipeImage} />
            <TouchableOpacity style={styles.favoriteButton}>
                <Image source={require('../assets/favorite.png')} style={styles.favoriteIcon} />
            </TouchableOpacity>
            <Text style={styles.recipeName}>{item.name}</Text>
            <Text style={styles.recipeCookingTime}>{category.name} • {item.cookingTime}</Text>
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
                />
            </View>
            <FlatList
                data={filteredRecipes}
                renderItem={renderRecipeItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2} 
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
        paddingBottom: 20,
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
        marginTop: 5
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
        tintColor: '#FFFFFF'
    },
});

export default RecipesScreen;