import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const ProfileScreen = ({navigation}) => {
  const user = {
    id: 1,
    name: 'Sunjekt',
  };
  
  const recipes = [
    { 
        id: 1, 
        name: 'Пирог', 
        authorId: 1, 
        description: 'Очень вкусно, из простых продуктов, праздник каждый день!', 
        servings: 2, 
        cookingTime: '>60 мин', 
        categoryId: 1,
        categoryName: 'Завтрак',
        image: require('../assets/testRecipe.png'), // URL изображения
        ingredients: [],
        steps: [],
    },
    { 
        id: 2, 
        name: 'Салат Цезарь', 
        authorId: 1, 
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
        authorId: 1, 
        description: 'Паста с томатным соусом и базиликом.', 
        servings: 3, 
        cookingTime: '>30 мин', 
        categoryId: 1,
        categoryName: 'Ужин',
        image: require('../assets/testRecipe.png'), // URL изображения
        ingredients: [],
        steps: [],
    },
    { 
        id: 4, 
        name: 'Торт', 
        authorId: 1, 
        description: 'Шоколадный торт с кремом.', 
        servings: 8, 
        cookingTime: '>1 час', 
        categoryId: 1,
        categoryName: 'Десерты',
        image: require('../assets/testRecipe.png'), // URL изображения
        ingredients: [],
        steps: [],
    },
    { 
        id: 5, 
        name: 'Бутерброды', 
        authorId: 1,  
        description: 'Бутерброды с ветчиной и сыром.', 
        servings: 2, 
        cookingTime: '>10 мин', 
        categoryId: 1,
        categoryName: 'Закуски',
        image: require('../assets/testRecipe.png'), // URL изображения
        ingredients: [],
        steps: [],
    },
    { 
        id: 6, 
        name: 'Яичница', 
        authorId: 4, 
        description: 'Простая яичница с помидорами.', 
        servings: 1, 
        cookingTime: '>5 мин', 
        categoryId: 1,
        categoryName: 'Завтрак',
        image: require('../assets/testRecipe.png'), // URL изображения
        ingredients: [],
        steps: [],
    },
    { 
        id: 7, 
        name: 'Куриный суп', 
        authorId: 1,  
        description: 'Суп с курицей и овощами.', 
        servings: 4, 
        cookingTime: '>40 мин', 
        categoryId: 1,
        categoryName: 'Ужин',
        image: require('../assets/testRecipe.png'), // URL изображения
        ingredients: [],
        steps: [],
    },
  ];
  
  const filteredRecipes = recipes.filter(recipe => recipe.authorId === user.id);

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity 
        style={styles.recipeItem} 
        onPress={() => navigation.navigate('RecipeDetailsScreen', { recipe: item })}
    >
        <Image source={item.image} style={styles.recipeImage} />
        <Text style={styles.recipeName}>{item.name}</Text>
        <Text style={styles.recipeCookingTime}>{item.categoryName} • {item.cookingTime}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton}>
        <Image
          source={require('../assets/logout.png')} // Замените на путь к вашему изображению для кнопки выхода
          style={styles.logoutImage}
        />
      </TouchableOpacity>
  
      <View style={styles.profileContainer}>
        <Image
          source={require('../assets/registrationIcons/username.png')} // Замените на путь к вашему изображению профиля
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.recipeCount}>{filteredRecipes.length} рецептов</Text>
      </View>
  
      <Text style={styles.recipesHeading}>Мои рецепты:</Text>
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
});

export default ProfileScreen;
