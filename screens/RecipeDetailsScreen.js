import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const RecipeDetailsScreen = ({ route, navigation }) => {
    const { recipe } = route.params;

    const ingredients = [
        { id: 1, name: 'лук', count: 200, measurementName: 'г', recipeId: 1 },
        { id: 2, name: 'морковь', count: 150, measurementName: 'г', recipeId: 1 },
        { id: 3, name: 'картофель', count: 300, measurementName: 'г', recipeId: 1 },
        { id: 4, name: 'чеснок', count: 5, measurementName: 'зубчиков', recipeId: 1 },
        { id: 5, name: 'помидоры', count: 250, measurementName: 'г', recipeId: 1 },
        { id: 6, name: 'перец сладкий', count: 100, measurementName: 'г', recipeId: 1 },
        { id: 7, name: 'оливковое масло', count: 50, measurementName: 'мл', recipeId: 1 },
        { id: 8, name: 'соль', count: 1, measurementName: 'ч.л.', recipeId: 2 },
        { id: 9, name: 'перец черный', count: 0.5, measurementName: 'ч.л.', recipeId: 2 },
        { id: 10, name: 'зелень (петрушка, укроп)', count: 30, measurementName: 'г', recipeId: 2 },
        { id: 11, name: 'куриное филе', count: 400, measurementName: 'г', recipeId: 2 },
        { id: 12, name: 'бульон', count: 1, measurementName: 'л', recipeId: 2 },
        { id: 13, name: 'лавровый лист', count: 2, measurementName: 'шт.', recipeId: 2 },
    ];

    const steps = [
        {id: 1, number: 1, image: require('../assets/testStepsImages/testStepImage1.jpg'), description: 'Как сделать шашлык на шпажках из свинины в духовке? Мясо для него лучше подходит не постное, с небольшим количеством жира. Лучший вариант - свиная шея. Также можно взять вырезку, карбонад или лопатку. Кроме перца вы можете взять абсолютно любые приправы и специи, по своему вкусу', recipeId: 1},
        {id: 2, number: 2, image: require('../assets/testStepsImages/testStepImage2.jpg'), description: 'Мясо обмойте, обсушите и нарежьте на одинаковые куски размером около 4 см', recipeId: 1},
        {id: 3, number: 3, image: require('../assets/testStepsImages/testStepImage3.jpg'), description: 'Лук почистите и нарежьте крупными кольцами.', recipeId: 1},
    ]
    const recipeIngredients = ingredients.filter(ingredient => ingredient.recipeId === recipe.id);
    const recipeSteps = steps.filter(step => step.recipeId === recipe.id);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
                <Image source={recipe.image} style={styles.recipeImage} />
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Image source={require('../assets/arrowBack.png')} style={styles.backIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.favoriteButton}>
                    <Image source={require('../assets/favorite.png')} style={styles.favoriteIcon} />
                </TouchableOpacity>
                <View style={styles.detailsContainer}>
                    <Text style={styles.heading}>{recipe.name}</Text>
                    <View style={styles.footer}>
                        <View style={styles.footerLeft}>
                            <Text style={styles.title}>{recipe.categoryName} • {recipe.cookingTime}</Text>
                        </View>
                        <View style={styles.footerRight}>
                            <Text style={styles.recipeAuthor}>Порций: {recipe.servings}</Text>
                        </View>
                    </View>
                    <View style={styles.separator} />
                    <Text style={styles.heading}>Описание</Text>
                    <Text style={styles.title}>{recipe.description}</Text>
                    <View style={styles.separator} />
                    <Text style={styles.heading}>Ингредиенты</Text>
                    {recipeIngredients.map(ingredient => (
                        <View key={ingredient.id} style={styles.footerLeft}>
                            <Image source={require('../assets/mark.png')} style={styles.icon} />
                            <Text style={styles.ingredientText}>
                                {ingredient.name}: {ingredient.count} {ingredient.measurementName} 
                            </Text>
                        </View>
                    ))}
                    <View style={styles.separator} />
                    <Text style={styles.heading}>Шаги</Text>
                    {recipeSteps.map(step => (
                        <View key={step.id} style={styles.stepContainer}>
                            <View style={styles.stepNumberContainer}>
                                <Text style={styles.stepNumber}>{step.number}</Text>
                            </View>
                            <View style={styles.stepDescriptionContainer}>
                                <Text style={styles.stepDescription}>{step.description}</Text>
                                {step.image && (
                                    <Image source={step.image} style={styles.stepImage} />
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
        tintColor: '#FFFFFF',
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