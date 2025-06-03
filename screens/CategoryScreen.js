import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';

const CategoryScreen = ({ route, navigation }) => {
    const { user } = route.params;
    const [categories, setCategories] = useState([]);



    const iconMap = {
        1: require('../assets/categoryIcons/category1.png'),
        2: require('../assets/categoryIcons/category2.png'),
        3: require('../assets/categoryIcons/category3.png'),
        4: require('../assets/categoryIcons/category4.png'),
        5: require('../assets/categoryIcons/category5.png'),
        6: require('../assets/categoryIcons/category6.png'),
    };

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = () => {
        const requestOptions = {
            method: "GET",
        };
        fetch('https://localhost:7108/api/Categories', requestOptions)
            .then((response) => response.json())
            .then(
                (data) => {
                    console.log("Data:", data);
                    setCategories(data);
                },
                (error) => {
                    console.log(error);
                }
            );
    };

    const renderCategoryItem = ({ item }) => {
        const iconPath = iconMap[item.id];
        return (
            <TouchableOpacity 
                style={styles.categoryItem} 
                onPress={() => navigation.navigate('RecipesScreen', { category: item, user })}
            >
                <Text style={styles.categoryName}>{item.name}</Text>
                <Image source={iconPath} style={styles.icon} />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.screenContainer}>
            <Text style={styles.title}>Категории</Text>
            <FlatList
                data={categories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',

    },
    container: {
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 100,
        textAlign: 'center',
        color: '#3E5481',
    },
    categoryItem: {
        padding: 16,
        width: '70%',
        alignSelf: 'center',
        marginVertical: 8,
        backgroundColor: '#F7F4F4',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryName: {
        fontSize: 18,
        color: '#3E5481',
    },
    icon: {
        width: 36,
        height: 36,
    },
});

export default CategoryScreen;