import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

const ReportsScreen = ({ route }) => {
    const { user } = route.params;
    const [recipes, setRecipes] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const screenWidth = Dimensions.get('window').width;

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = () => {
        const requestOptions = {
            method: "GET",
        };
        fetch('https://localhost:7108/api/Recipes', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setRecipes(data);
                processCategoryData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    };

    const processCategoryData = (recipesData) => {
        const categoryCount = {};
        
        recipesData.forEach(recipe => {
            const categoryName = recipe.categoryName;
            if (categoryName) {
                categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
            }
        });

        const colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
            '#9966FF', '#FF9F40', '#8AC24A', '#607D8B'
        ];

        const total = Object.values(categoryCount).reduce((sum, count) => sum + count, 0);
        
        const data = Object.keys(categoryCount).map((category, index) => ({
            name: category,
            count: categoryCount[category],
            percentage: (categoryCount[category] / total) * 100,
            color: colors[index % colors.length],
        }));

        setCategoryData(data);
    };

    const getDeletedStats = () => {
        const totalRecipes = recipes.length;
        const deletedRecipes = recipes.filter(r => r.deletedBy !== null).length;
        const deletedByUser = recipes.filter(r => r.deletedBy === 'user').length;
        const deletedByAdmin = recipes.filter(r => r.deletedBy === 'admin').length;

        return {
            totalRecipes,
            deletedRecipes,
            deletedByUser,
            deletedByAdmin,
            activeRecipes: totalRecipes - deletedRecipes
        };
    };

    const renderPieChart = () => {
        if (categoryData.length === 0) return null;

        const chartSize = screenWidth - 60; // Уменьшаем размер для вписывания в экран
        const radius = chartSize / 3; // Радиус круга
        const center = chartSize / 2; // Центр диаграммы
        const circumference = 2 * Math.PI * radius;
        
        let lastAngle = 0;
        const total = categoryData.reduce((sum, item) => sum + item.count, 0);

        return (
            <View style={styles.chartContainer}>
                <Svg width={chartSize} height={chartSize}>
                    <G transform={`translate(${center}, ${center})`}>
                        {categoryData.map((item, index) => {
                            const angle = (item.count / total) * 360;
                            const strokeDashoffset = circumference - (circumference * item.count / total);
                            const rotation = lastAngle;
                            lastAngle += angle;
                            
                            return (
                                <Circle
                                    key={index}
                                    r={radius}
                                    cx={0}
                                    cy={0}
                                    fill="transparent"
                                    stroke={item.color}
                                    strokeWidth={radius}
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    rotation={rotation}
                                    originX={0}
                                    originY={0}
                                />
                            );
                        })}
                    </G>
                </Svg>
                <View style={styles.legendContainer}>
                    {categoryData.map((item, index) => (
                        <View key={index} style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                            <Text style={styles.legendText}>
                                {item.name} ({item.count} - {item.percentage.toFixed(1)}%)
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    const stats = getDeletedStats();

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
                <Text style={styles.header}>Статистика рецептов</Text>
                
                {loading ? (
                    <Text style={styles.loadingText}>Загрузка данных...</Text>
                ) : (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Распределение по категориям</Text>
                            {categoryData.length > 0 ? (
                                renderPieChart()
                            ) : (
                                <Text style={styles.noDataText}>Нет данных для отображения</Text>
                            )}
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Общая статистика</Text>
                            <View style={styles.statsContainer}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{stats.totalRecipes}</Text>
                                    <Text style={styles.statLabel}>Всего рецептов</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{stats.activeRecipes}</Text>
                                    <Text style={styles.statLabel}>Активных</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{stats.deletedRecipes}</Text>
                                    <Text style={styles.statLabel}>Удаленных</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Детализация удалений</Text>
                            <View style={styles.statsContainer}>
                                <View style={styles.statItem}>
                                    <Text style={[styles.statValue, styles.deletedByUser]}>{stats.deletedByUser}</Text>
                                    <Text style={styles.statLabel}>Удалено пользователями</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={[styles.statValue, styles.deletedByAdmin]}>{stats.deletedByAdmin}</Text>
                                    <Text style={styles.statLabel}>Удалено администраторами</Text>
                                </View>
                            </View>
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    scrollView: {
        paddingBottom: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3E5481',
        marginBottom: 20,
        textAlign: 'center',
    },
    section: {
        marginBottom: 25,
        backgroundColor: '#F4F5F7',
        borderRadius: 12,
        padding: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3E5481',
        marginBottom: 15,
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    statItem: {
        alignItems: 'center',
        minWidth: 90, // Фиксированная минимальная ширина
    },
    statValue: {
        fontSize: 22, // Уменьшенный размер шрифта
        fontWeight: 'bold',
        color: '#1FCC79',
    },
    statLabel: {
        fontSize: 13, // Уменьшенный размер шрифта
        color: '#9FA5C0',
        textAlign: 'center',
        marginTop: 5,
    },
    deletedByUser: {
        color: '#FF647C',
    },
    deletedByAdmin: {
        color: '#FF9F1C',
    },
    adminStats: {
        marginTop: 10,
    },
    adminStatText: {
        fontSize: 14,
        color: '#3E5481',
    },
    loadingText: {
        fontSize: 16,
        color: '#3E5481',
        textAlign: 'center',
        marginTop: 20,
    },
    noDataText: {
        fontSize: 16,
        color: '#9FA5C0',
        textAlign: 'center',
        marginVertical: 20,
    },
    legendContainer: {
        marginTop: 15,
        paddingHorizontal: 10,
        width: '100%',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    legendColor: {
        width: 14,
        height: 14,
        borderRadius: 7,
        marginRight: 8,
    },
    legendText: {
        fontSize: 13,
        color: '#3E5481',
        flexShrink: 1, // Позволяет тексту переноситься
    },
});

export default ReportsScreen;