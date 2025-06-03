import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';

const UsersScreen = ({ route }) => {
    const { user } = route.params;
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = () => {
        const requestOptions = {
            method: "GET"
        };
        
        fetch('https://localhost:7108/api/account/getallusers', requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                return response.json();
            })
            .then(
                (data) => {
                    const filteredUsers = data.filter(u => 
                        u.userRole === 'user'
                    );
                    setUsers(filteredUsers);
                    console.log(filteredUsers);
                    setLoading(false);
                },
                (error) => {
                    console.error(error);
                    setLoading(false);
                }
            );
    };

    const deleteUser = async (userId) => {
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        try {
            const response = await fetch(`https://localhost:7108/api/account/delete/${userId}`, requestOptions);
            if (response.ok) {
                getUsers();
            }
        } catch (error) {
            console.error('Ошибка удаления:', error);
        }
    };

    const restoreUser = async (userId) => {
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        try {
            const response = await fetch(`https://localhost:7108/api/account/restore/${userId}`, requestOptions);
            if (response.ok) {
                getUsers();
            }
        } catch (error) {
            console.error('Ошибка восстановления:', error);
        }
    };

    const renderUserItem = ({ item }) => {
        return (
            <View style={styles.userItem}>
                <TouchableOpacity 
                    style={styles.userInfoContainer}
                >
                    {item.imagePath ? (
                        <Image source={{ uri: item.imagePath }} style={styles.userImage} />
                    ) : (
                        <View style={styles.defaultUserImage}>
                            <Text style={styles.defaultImageText}>
                                {item.userName ? item.userName.charAt(0).toUpperCase() : 'U'}
                            </Text>
                        </View>
                    )}
                    <View style={styles.userTextContainer}>
                        <Text style={styles.userName}>{item.userName}</Text>
                        {item.deleted && (
                            <Text style={styles.deletedText}>Удален: {item.deleted}</Text>
                        )}
                    </View>
                </TouchableOpacity>
                
                {user.userRole === 'admin' && (
                    item.deleted ? (
                        <TouchableOpacity 
                            onPress={() => restoreUser(item.id)}
                            style={styles.restoreButton}
                        >
                            <Image 
                                source={require('../assets/restore.png')} 
                                style={styles.restoreIcon}
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity 
                            onPress={() => deleteUser(item.id)}
                            style={styles.deleteButton}
                        >
                            <Image 
                                source={require('../assets/delete.png')} 
                                style={styles.deleteIcon}
                            />
                        </TouchableOpacity>
                    )
                )}
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.screenContainer}>
                <Text>Загрузка пользователей...</Text>
            </View>
        );
    }

    const filteredUsers = users.filter(user => 
        user.userName.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <View style={styles.screenContainer}>
            <Text style={styles.title}>Пользователи</Text>
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
                data={filteredUsers}
                renderItem={renderUserItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Пользователи не найдены</Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        alignSelf: 'center',
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
    container: {
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 50,
        textAlign: 'center',
        color: '#3E5481',
    },
    userItem: {
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#F7F4F4',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    userTextContainer: {
        flex: 1,
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    defaultUserImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#3E5481',
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    defaultImageText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    userName: {
        fontSize: 18,
        color: '#3E5481',
    },
    deletedText: {
        fontSize: 12,
        color: '#FF0000',
        marginTop: 4,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
    deleteButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 5,
        borderColor: '#FF0000',
        borderWidth: 2,
        borderRadius: 10,
        marginLeft: 10,
    },
    restoreButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 5,
        borderColor: '#1FCC79',
        borderWidth: 2,
        borderRadius: 10,
        marginLeft: 10,
    },
    deleteIcon: {
        width: 25,
        height: 25,
        tintColor: '#FF0000'
    },
    restoreIcon: {
        width: 25,
        height: 25,
        tintColor: '#1FCC79'
    },
});

export default UsersScreen;