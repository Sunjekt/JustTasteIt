import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const RecipeDetailsScreen = ({ route, navigation }) => {
    const { recipe, user, favouriteItem } = route.params;

    const [ingredients, setIngredients] = useState([]);
    const [steps, setSteps] = useState([]);
    const [comments, setComments] = useState([]);
    const [commentsCount, setCommentsCount] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [isRecipeFavorite, setIsRecipeFavorite] = useState(favouriteItem);

    useEffect(() => {
        getIngredients();
        getSteps();
        getComments();
        console.log(recipe);
    }, [isRecipeFavorite]);

    const getIngredients = () => {
        const requestOptions = {
            method: "GET",
        };
        fetch(`https://localhost:7108/api/Ingredients/ByRecipeId/${recipe.id}`, requestOptions)
            .then((response) => response.json())
            .then(
                (data) => {
                    console.log("Ингредиенты:", data);
                    setIngredients(data);
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
        fetch(`https://localhost:7108/api/RecipeSteps/ByRecipeId/${recipe.id}`, requestOptions)
            .then((response) => response.json())
            .then(
                (data) => {
                    console.log("Шаги:", data);
                    setSteps(data);
                    },
                (error) => {
                    console.log(error);
                }
            );
    };

    const getComments = () => {
        const requestOptions = {
            method: "GET",
        };
        fetch(`https://localhost:7108/api/Comments/ByRecipeId/${recipe.id}`, requestOptions)
            .then((response) => response.json())
            .then(
                (data) => {
                    console.log("Комментарии:", data);
                    console.log("Количество комментариев:", data.length);
                    setComments(data);
                    setCommentsCount(data.length);
                },
                (error) => {
                    console.log(error);
                }
            );
    };

    const postComment = async () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: user.id,
                recipeId: recipe.id,
                description: newComment,
                userName: user.userName,
                userImagePath: user.imagePath
            }),
        };

        try {
            const response = await fetch("https://localhost:7108/api/Comments", requestOptions);
            const data = await response.json();

            if (response.status === 201) {
                console.log(data);
                const newComment = {
                    id: data.id,
                    description: data.description,
                    userName: data.userName,
                    userImagePath: data.userImagePath,
                    userId: data.userId,
                    recipeId: data.recipeId,
                  };
                setComments([...comments, newComment]);
                setNewComment('');
                setCommentsCount(prevCount => prevCount + 1)
            } else {
                if (data.error) {
                    setErrorMessages(data.error);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deleteComment = async (id) => {
        const requestOptions = {
            method: "DELETE",
        };
    
        try {
            const response = await fetch(`https://localhost:7108/api/Comments/${id}`, requestOptions);
            
            if (response.status === 204) {
                setComments(prev => prev.filter(comment => comment.id !== id));
                setCommentsCount(prev => prev - 1);
                console.log("Комментарий удален");
            } else {
                console.error("Не удалось удалить комментарий");
            }
        } catch (error) {
            console.error("Ошибка при удалении:", error);
        }
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
                            <Text style={styles.title}>{recipe.categoryName} • {recipe.time}</Text>
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
                                {ingredient.ingredientName}: {ingredient.count} {ingredient.measurementName} 
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
                    <View style={styles.separator} />
                    <Text style={styles.heading}>{commentsCount} комментариев</Text>
                </View>
                <View style={styles.addCommentContainer}>
                <View style={styles.avatarContainer}>
                    <Image 
                    source={{uri: user.imagePath}} 
                    style={styles.avatarImage}
                    />
                </View>
                <View style={styles.addCommentContent}>
                    <TextInput
                    style={styles.commentInput}
                    placeholder="Добавить комментарий..."
                    placeholderTextColor="#9FA5B4"
                    multiline
                    value={newComment}
                    onChangeText={setNewComment}
                    />
                    <TouchableOpacity 
                    style={styles.addButton}
                    onPress={postComment}
                    disabled={!newComment.trim()}
                    >
                    <Text style={styles.addButtonText}>Отправить</Text>
                    </TouchableOpacity>
                </View>
                </View>
                {comments.map(comment => (
                    <View key={comment.id} style={styles.commentContainer}>
                        <View style={styles.avatarContainer}>
                            <Image 
                                source={{uri: comment.userImagePath}} 
                                style={styles.avatarImage}
                            />
                        </View>
                        <View style={styles.commentContent}>
                            <View style={styles.commentHeader}>
                                <Text style={styles.userName}>{comment.userName}</Text>
                                {comment.userId === user.id && (
                                    <TouchableOpacity 
                                        onPress={() => deleteComment(comment.id)}
                                        style={styles.deleteButton}
                                    >
                                        <Image 
                                            source={require('../assets/delete.png')} 
                                            style={styles.deleteIcon}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                            <Text style={styles.commentText}>{comment.description}</Text>
                        </View>
                    </View>
                ))}
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
        paddingBottom: 20,
    },
    recipeImage: {
        width: '100%',
        height: 350,
    },
    detailsContainer: {
        backgroundColor: '#FFFFFF', 
        padding: 20,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: -30,
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
        top: 50, 
        right: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 10, 
        padding: 5, 
    },
    favoriteIcon: {
        width: 35,
        height: 35,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 50,
        padding: 5,
    },
    backIcon: {
        width: 35,
        height: 35, 
        tintColor: '#FFFFFF',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: 0,
    },
    footerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 7,
    },
    separator: {
        height: 2,
        backgroundColor: '#D0DBEA',
        marginVertical: 20,
    },
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 10, 
    },
    stepNumberContainer: {
        width: 25,
        height: 25,
        borderRadius: 20,
        backgroundColor: '#3E5481', 
        justifyContent: 'center', 
        alignItems: 'center',
        marginRight: 10, 
    },
    stepNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF', 
    },
    stepDescriptionContainer: {
        flex: 1,
    },
    stepDescription: {
        fontSize: 16,
        color: '#3E5481',
        marginBottom: 5, 
    },
    stepImage: {
        width: '100%', 
        height: 200, 
        borderRadius: 10, 
    },
    commentContainer: {
        flexDirection: 'row', 
        marginVertical: 12,    
        paddingHorizontal: 16, 
      },
      avatarContainer: {
        marginRight: 12,        
      },
      avatarImage: {
        width: 40,    
        height: 40,
        borderRadius: 20,
        borderColor: '#3E5481',
        borderWidth: 1,  
      },
      commentContent: {
        flex: 1,               
      },
      userName: {
        fontSize: 14,
        fontWeight: '600',    
        color: '#3E5481',
        marginBottom: 4,          
      },
      commentText: {
        fontSize: 14,
        color: '#2D3748',         
        lineHeight: 20,        
      },
      addCommentContainer: {
        flexDirection: 'row',
        marginVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'flex-start',
      },
      addCommentContent: {
        flex: 1,
      },
      commentInput: {
        fontSize: 14,
        color: '#2D3748',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 12,
        minHeight: 50,
        textAlignVertical: 'top',
        marginBottom: 8,
      },
      addButton: {
        backgroundColor: '#1FCC79',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 32,
        alignSelf: 'flex-end',
      },
      addButtonText: {
        color: 'white',
        fontWeight: '600',
      },
      addButtonDisabled: {
        backgroundColor: '#C5C7D0',
      },
      commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    deleteButton: {
        padding: 5,
    },
    deleteIcon: {
        width: 25,
        height: 25,
        tintColor: '#FF0000',
    },
});

export default RecipeDetailsScreen;