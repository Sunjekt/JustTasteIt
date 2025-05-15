import React, { useState, useEffect } from 'react';
import { View, Image, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const RecipeSearchScreen = ({ route, navigation }) => {
    const [ingredients, setIngredients] = useState([]);
    const [ingredientNames, setIngredientNames] = useState([]);
    const [measurements, setMeasurements] = useState([]);
    
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState(0);
    const [selectedUnit, setSelectedUnit] = useState(0);
    const [ingredientAmount, setIngredientAmount] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [recipes, setRecipes] = useState([]);
    const [showRecipes, setShowRecipes] = useState(false);

    useEffect(() => {
        getMeasurements();
        getIngredientNames();
    }, []);

    const getMeasurements = () => {
        const requestOptions = {
            method: "GET",
        };
        fetch('https://localhost:7108/api/Measurements', requestOptions)
            .then((response) => response.json())
            .then(
                (data) => {
                    setMeasurements(data);
                },
                (error) => {
                    console.log(error);
                }
            );
    };

    const getIngredientNames = () => {
        const requestOptions = {
            method: "GET",
        };
        fetch('https://localhost:7108/api/IngredientNames', requestOptions)
            .then((response) => response.json())
            .then(
                (data) => {
                    setIngredientNames(data);
                },
                (error) => {
                    console.log(error);
                }
            );
    };

    const handleAddIngredient = () => {
        const ingredientExists = ingredients.some(
            ingredient => ingredient.ingredientName.id === Number(selectedIngredient)
        );

        if (ingredientExists) {
            setErrorMessage('Ингредиент уже добавлен!');
            return;
        }

        const measurement = measurements.find(item => item.id === Number(selectedUnit));
        const ingredientName = ingredientNames.find(item => item.id === Number(selectedIngredient));

        if (!ingredientName || !measurement || !ingredientAmount) {
            setErrorMessage('Заполните все поля!');
            return;
        }

        const newIngredient = {
            ingredientName: ingredientName,
            count: parseInt(ingredientAmount),
            measurement: measurement,
        };

        setIngredients([...ingredients, newIngredient]);
        setErrorMessage('');
        setModalVisible(false);
        setSelectedIngredient(0);
        setSelectedUnit(0);
        setIngredientAmount('');
    };

    const handleRemoveIngredient = (id) => {
        setIngredients(ingredients.filter(ingredient => ingredient.ingredientName.id !== id));
    };

    const searchRecipes = () => {
        const requestOptions = {
            method: "GET",
        };
        
        fetch('https://localhost:7108/api/Recipes', requestOptions)
            .then((response) => response.json())
            .then(
                (data) => {
                    const recipesWithMatch = data.map(recipe => {
                        const recipeIngredientsMap = {};
                        recipe.ingredients.forEach(ing => {
                            recipeIngredientsMap[ing.ingredientNameId] = {
                                neededAmount: ing.count,
                                measurement: ing.measurement
                            };
                        });
    
                        const userIngredientsMap = {};
                        ingredients.forEach(ing => {
                            userIngredientsMap[ing.ingredientName.id] = {
                                availableAmount: ing.count,
                                measurement: ing.measurement
                            };
                        });
    
                        let matchedIngredients = 0;
                        let totalScore = 0;
                        let maxPossibleScore = 0;
    
                        Object.entries(recipeIngredientsMap).forEach(([id, recipeIng]) => {
                            const userIng = userIngredientsMap[id];
                            
                            if (userIng) {
                                
                                const percentage = Math.min(
                                    (userIng.availableAmount / recipeIng.neededAmount) * 100, 
                                    100
                                );
                                
                                matchedIngredients++;
                                totalScore += percentage;
                            }
                            
                            maxPossibleScore += 100;
                        });
    
                        const matchPercentage = maxPossibleScore > 0 
                            ? Math.round((totalScore / maxPossibleScore) * 100) 
                            : 0;
    
                        const missingIngredientsCount = Object.keys(recipeIngredientsMap).length - matchedIngredients;
    
                        return {
                            ...recipe,
                            matchPercentage,
                            missingIngredientsCount,
                            hasAllIngredients: missingIngredientsCount === 0
                        };
                    });
                    
                    const filteredRecipes = recipesWithMatch.filter(recipe => 
                        recipe.matchPercentage >= 30
                    );
                    
                    const sortedRecipes = filteredRecipes.sort((a, b) => {
                        if (a.hasAllIngredients !== b.hasAllIngredients) {
                            return a.hasAllIngredients ? -1 : 1;
                        }
                        return b.matchPercentage - a.matchPercentage;
                    });
                    
                    setRecipes(sortedRecipes);
                    setShowRecipes(true);
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
                onPress={() => navigation.navigate('RecipeDetailsScreen', { recipe: item, user: route.params.user })} 
            >
                <Image source={{ uri: item.imagePath }} style={styles.recipeImage} />
                
                <View style={styles.matchContainer}>
                    <View style={[
                        styles.matchBar, 
                        { 
                            width: `${item.matchPercentage}%`,
                            backgroundColor: item.hasAllIngredients ? '#1FCC79' : 
                                           item.matchPercentage > 50 ? '#FFA500' : '#FF0000'
                        }
                    ]} />
                    <Text style={styles.matchText}>
                        {item.matchPercentage}% • {item.hasAllIngredients ? 'Все есть' : `Не хватает ${item.missingIngredientsCount} ингредиентов`}
                    </Text>
                </View>
                
                <Text style={styles.recipeName}>{item.name}</Text>
                <Text style={styles.recipeCookingTime}>{item.categoryName} • {item.time}</Text>
                
                {/* Дополнительная информация о недостающих ингредиентах */}
                {!item.hasAllIngredients && (
                    <Text style={styles.missingIngredientsText}>
                        Не хватает: {item.ingredients
                            .filter(ing => !ingredients.some(userIng => userIng.ingredientName.id === ing.ingredientNameId))
                            .map(ing => ing.ingredientName)
                            .join(', ')}
                    </Text>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
                <Text style={styles.heading}>Что есть в холодильнике?</Text>
                
                {ingredients.map(ingredient => (
                    <View key={ingredient.ingredientName.id} style={styles.ingredientItem}>
                        <Image source={require('../assets/mark.png')} style={styles.icon} />
                        <Text style={styles.ingredientText}>
                            {ingredient.ingredientName.name}: {ingredient.count} {ingredient.measurement.name}
                        </Text>
                        <TouchableOpacity 
                            onPress={() => handleRemoveIngredient(ingredient.ingredientName.id)}
                            style={styles.removeButton}
                        >
                            <Image 
                                source={require('../assets/delete.png')}
                                style={styles.removeIcon}
                            />
                        </TouchableOpacity>
                    </View>
                ))}

                <TouchableOpacity 
                    style={styles.addButton} 
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.addButtonText}>Добавить ингредиент</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.searchButton, { backgroundColor: ingredients.length === 0 ? '#D0DBEA' : '#1FCC79' }]}
                    onPress={searchRecipes}
                    disabled={ingredients.length === 0}
                >
                    <Text style={styles.searchButtonText}>Найти рецепты</Text>
                </TouchableOpacity>

                {showRecipes && recipes.length === 0 && (
                    <View style={styles.noResultsContainer}>
                        <Image 
                            source={require('../assets/no-results.png')} 
                            style={styles.noResultsImage}
                        />
                        <Text style={styles.noResultsTitle}>Рецепты не найдены</Text>
                    </View>
                )}

                {/* Список рецептов */}
                {showRecipes && (
                    <FlatList
                        data={recipes}
                        renderItem={renderRecipeItem}
                        keyExtractor={(item) => item.id.toString()}
                        scrollEnabled={false}
                        contentContainerStyle={styles.listContainer}
                    />
                )}

                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Добавить ингредиент</Text>
                            
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={selectedIngredient}
                                    onValueChange={(itemValue) => setSelectedIngredient(itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Выберите ингредиент" value={0} />
                                    {ingredientNames.map((ingredient) => (
                                        <Picker.Item 
                                            key={ingredient.id} 
                                            label={ingredient.name} 
                                            value={ingredient.id} 
                                        />
                                    ))}
                                </Picker>
                            </View>
                            
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Количество"
                                    keyboardType="numeric"
                                    value={ingredientAmount}
                                    onChangeText={setIngredientAmount}
                                    placeholderTextColor="#9FA5C0"
                                />
                            </View>
                            
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={selectedUnit}
                                    onValueChange={(itemValue) => setSelectedUnit(itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Выберите единицу измерения" value={0} />
                                    {measurements.map((unit) => (
                                        <Picker.Item 
                                            key={unit.id} 
                                            label={unit.name} 
                                            value={unit.id} 
                                        />
                                    ))}
                                </Picker>
                            </View>

                            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity 
                                    style={[styles.modalButton, { backgroundColor: '#FF0000' }]}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.modalButtonText}>Отмена</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.modalButton, { backgroundColor: (!selectedUnit || !selectedIngredient || ingredientAmount === '')  ? '#D0DBEA' : '#1FCC79' }]}
                                    disabled={(!selectedUnit || !selectedIngredient || ingredientAmount === '')}
                                    onPress={handleAddIngredient}
                                >
                                    <Text style={styles.modalButtonText}>Добавить</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    scrollView: {
        flexGrow: 1,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3E5481',
        textAlign: 'center',
        marginTop: 15,
        marginBottom: 30,
    },
    ingredientItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5
    },
    ingredientText: {
        fontSize: 16,
        color: '#3E5481',
        flex: 1,
    },
    addButton: {
        width: '100%', // Ширина кнопки на 100% экрана
        height: 50, // Высота кнопки
        backgroundColor: '#FFFFFF', // Цвет фона кнопки
        borderColor: '#D0DBEA', // Цвет рамки
        borderWidth: 2, // Ширина рамки
        borderRadius: 32, // Закругленные углы
        alignItems: 'center', // Центрирует содержимое по горизонтали
        justifyContent: 'center', // Центрирует содержимое по вертикали
        marginVertical: 20, // Отступ сверху и снизу
    },
    addButtonText: {
        color: '#3E5481', // Цвет текста кнопки
        fontSize: 16, // Размер текста
        fontWeight: 'bold', // Жирный текст
    },
    searchButton: {
        width: '100%', // Ширина кнопки на 100% экрана
        height: 50, // Высота кнопки
        backgroundColor: '#FFFFFF', // Цвет фона кнопки
        borderRadius: 32, // Закругленные углы
        alignItems: 'center', // Центрирует содержимое по горизонтали
        justifyContent: 'center', // Центрирует содержимое по вертикали
        marginVertical: 20, // Отступ сверху и снизу
    },
    searchButtonText: {
        color: '#FFFFFF', // Цвет текста кнопки
        fontSize: 16, // Размер текста
        fontWeight: 'bold', // Жирный текст
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3E5481'
    },
    pickerContainer: {
        borderColor: '#D0DBEA', // Цвет рамки
        borderWidth: 2, // Ширина рамки
        width: '100%',
        borderRadius: 32,
        marginVertical: 10,
        overflow: 'hidden', // Чтобы закругленные углы работали
    },
    picker: {
        height: 50,
        borderColor: '#D0DBEA', // Цвет рамки
        borderWidth: 2, // Ширина рамки
        borderRadius: 32,
        width: '100%',
        color: '#3E5481', // Цвет текста в Picker
        padding: 15
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderColor: '#D0DBEA', // Цвет рамки
        borderWidth: 2, // Ширина рамки
        borderRadius: 32,
        marginVertical: 10,
    },
    input: {
        height: 50,
        flex: 1,
        color: '#3E5481',
        fontSize: 15,
        marginLeft: 20,
    },
    errorText: {
        color: 'red',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '100%',
    },
    modalButton: {
        borderRadius: 20,
        width: '40%',
        padding: 10,
        elevation: 2,
        marginVertical: 10,
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
    icon: {
        width: 24,
        height: 24,
        marginRight: 7,
    },
    removeButton: {
        marginLeft: 10,
    },
    removeIcon: {
        width: 24,
        height: 24,
        tintColor: '#FF0000',
    },
    listContainer: {
        paddingBottom: 16,
    },
    recipeItem: {
        marginVertical: 8,
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
    matchContainer: {
        height: 20,
        width: '100%',
        backgroundColor: '#708090',
        borderRadius: 10,
        marginBottom: 8,
        overflow: 'hidden',
        position: 'relative',
    },
    matchBar: {
        height: '100%',
        borderRadius: 10,
    },
    matchText: {
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: 'bold',
        lineHeight: 20,
    },
    missingIngredientsText: {
        fontSize: 12,
        color: '#FF0000',
        marginTop: 5,
        fontStyle: 'italic',
    },
    noResultsContainer: {
        alignItems: 'center',
        marginTop: 40,
        paddingHorizontal: 20,
    },
    noResultsImage: {
        width: 120,
        height: 120,
        marginBottom: 20,
        tintColor: '#D0DBEA',
    },
    noResultsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3E5481',
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default RecipeSearchScreen;