import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import { Modal } from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

const CreateScreen = ({route}) => {
  const { user, setUser  } = route.params;

  const [selectedImage, setSelectedImage] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [selectedDescription, setSelectedDescription] = useState('');
  const [selectedPortion, setSelectedPortion] = useState(0);
  
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [cookingTime, setCookingTime] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState(0);
  const [ingredientAmount, setIngredientAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [stepModalVisible, setStepModalVisible] = useState(false);
  const [selectedStepDescription, setSelectedStepDescription] = useState('');
  const [selectedStepImage, setSelectedStepImage] = useState('');

  const [ingredients, setIngredients] = useState([]);
  const [ingredientNames, setIngredientNames] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [recipeSteps, setRecipeSteps] = useState([]);

  useEffect(() => {
    getCategories();
    getMeasurements();
    getIngredientNames();
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

  const getMeasurements = () => {
    const requestOptions = {
        method: "GET",
    };
    fetch('https://localhost:7108/api/Measurements', requestOptions)
        .then((response) => response.json())
        .then(
            (data) => {
                console.log("Data:", data);
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
                console.log("Data:", data);
                setIngredientNames(data);
            },
            (error) => {
                console.log(error);
            }
        );
  };  

  const postRecipe = async () => {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: selectedName,
            description: selectedDescription,
            portion: selectedPortion,
            time: cookingTimeLabels[cookingTime],
            userId: user.id,
            categoryId: selectedCategory,
            imagePath: selectedImage.uri,
        }),
    };

    try {
        const response = await fetch("https://localhost:7108/api/recipes", requestOptions);
        const data = await response.json();

        if (response.status === 201) {
            const newRecipeId = data.id;
            await addIngredients(newRecipeId);
            await addCookingSteps(newRecipeId);
            console.log("Успех");
            clearScreen();
        } else {
            if (data.error) {
              console.log(data.error);
            }
        }
    } catch (error) {
        console.log(error);
    }
};

const clearScreen = () => {
  setSelectedImage('');
  setSelectedName('');
  setSelectedDescription('');
  setSelectedPortion(0);
  setSelectedCategory(0);
  setCookingTime(0);
  setIngredients([]);
  setRecipeSteps([]);
}

const addIngredients = async (recipeId) => {
  const promises = ingredients.map(async (ingredient) => {
      const ingredientData = {
          ingredientNameId: ingredient.ingredientName.id,
          count: ingredient.count,
          measurementId: ingredient.measurement.id,
          recipeId: recipeId,
      };

      const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ingredientData),
      };

      try {
          const response = await fetch("https://localhost:7108/api/ingredients", requestOptions);
          const data = await response.json();

          if (response.status === 201) {
              console.log("Ингредиент добавлен:", ingredientData.ingredientNameId);
          } else {
              if (data.error) {
                  console.log("Ошибка при добавлении ингредиента:", data.error);
              }
          }
      } catch (error) {
          console.log("Ошибка при добавлении ингредиента:", error);
      }
  });

  await Promise.all(promises);
};

const addCookingSteps = async (recipeId) => {
  const promises = recipeSteps.map(async (step) => {
      const stepData = {
          number: step.number,
          description: step.description,
          imagePath: step.image,
          recipeId: recipeId
      };

      const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(stepData),
      };

      try {
          const response = await fetch("https://localhost:7108/api/recipeSteps", requestOptions);
          const data = await response.json();

          if (response.status === 201) {
              console.log("Шаг добавлен:", stepData.description);
          } else {
              if (data.error) {
                  console.log("Ошибка при добавлении шага:", data.error);
              }
          }
      } catch (error) {
          console.log("Ошибка при добавлении шага:", error);
      }
  });

  await Promise.all(promises);
};

  const cookingTimeLabels = ['<10 мин', '30 мин', '>60 мин'];

  const handleAddIngredient = () => {
    const ingredientExists = ingredients.some(ingredient => ingredient.ingredientName.id === Number(selectedIngredient));

    if (ingredientExists) {
      setErrorMessage('Ингредиент уже добавлен!');
      return;
    }

    const meas = measurements.find(item => item.id === Number(selectedUnit));
    const ingName = ingredientNames.find(item => item.id === Number(selectedIngredient));

    if (!ingredientAmount || !meas || !ingName) {
      setErrorMessage('Заполните все поля!');
      return;
    }

    const newIngredient = {
      ingredientName: ingName,
      count: parseInt(ingredientAmount),
      measurement: meas,
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

  const handleAddStep = () => {

    const newStep = {
      number: recipeSteps.length + 1,
      image: selectedStepImage.uri,
      description: selectedStepDescription,
    };

    setRecipeSteps([...recipeSteps, newStep]);

    setStepModalVisible(false);
    setSelectedStepDescription('');
    setSelectedStepImage('');
  };

  const openImagePickerForRecipe = () => {
    const options = {
      mediaType: 'photo', // Убедитесь, что вы указали тип медиа
    };
  
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('Пользователь отменил выбор');
      } else if (response.error) {
        console.log('Ошибка при выборе: ', response.error);
      } else {
        // Проверяем, существует ли assets и не пуст ли он
        if (response.assets && response.assets.length > 0) {
          const source = { uri: response.assets[0].uri }; // Получаем URI изображения
          setSelectedImage(source); // Устанавливаем выбранное изображение
          console.log("Данные", source)
        } else {
          console.log('Нет доступных изображений');
        }
      }
    });
  };

  const openImagePickerForStep = () => {
    const options = {
      mediaType: 'photo', // Убедитесь, что вы указали тип медиа
    };
  
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('Пользователь отменил выбор');
      } else if (response.error) {
        console.log('Ошибка при выборе: ', response.error);
      } else {
        // Проверяем, существует ли assets и не пуст ли он
        if (response.assets && response.assets.length > 0) {
          const source = { uri: response.assets[0].uri }; // Получаем URI изображения
          setSelectedStepImage(source); // Устанавливаем выбранное изображение
          console.log("Данные", source)
        } else {
          console.log('Нет доступных изображений');
        }
      }
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.uplouadImageContainer}>
          {!selectedImage ? (
            <TouchableOpacity style={styles.uploadButton} onPress={openImagePickerForRecipe}>
              <Image 
                source={require('../assets/uploadImage.png')}
                style={styles.uploadImage} 
              />
              <Text style={styles.uploadText}>Загрузить фотографию</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={openImagePickerForRecipe}>
              <Image
                source={{ uri: selectedImage.uri }}
                style={styles.selectedImage}
              />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.heading}>Название</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Введите название рецепта"
            placeholderTextColor="#9FA5C0"
            value={selectedName}
            onChangeText={setSelectedName}
          />
        </View>
        <Text style={styles.heading}>Описание</Text>
        <View>
          <TextInput
            style={styles.inputDescription}
            placeholder="Введите описание рецепта"
            placeholderTextColor="#9FA5C0"
            multiline={true}
            numberOfLines={4}
            value={selectedDescription}
            onChangeText={setSelectedDescription}
          />
        </View>
        <Text style={styles.heading}>Категория</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Выберите категорию:"/>
            {categories.map((category) => (
              <Picker.Item key={category.id} label={category.name} value={category.id} />
            ))}
          </Picker>
        </View>
        <Text style={styles.heading}>Количество порций</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Введите количество порций"
            placeholderTextColor="#9FA5C0"
            value={selectedPortion}
            onChangeText={setSelectedPortion}
          />
        </View>
        <View style={styles.footer}>
          <Text style={styles.heading}>Время готовки </Text>
          <Text style={styles.title}>(В минутах)</Text>
        </View>
        <View style={styles.sliderLabelContainer}>
          {cookingTimeLabels.map((label, index) => (
            <Text key={index} style={styles.sliderLabel}>
              {label}
            </Text>
          ))}
        </View>

        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={2}
            step={1}
            value={cookingTime}
            onValueChange={(value) => setCookingTime(value)}
            minimumTrackTintColor="#1FCC79"
            maximumTrackTintColor="#D0DBEA"
            thumbTintColor="#1FCC79"
          />
        </View>
        <Text style={styles.heading}>Ингредиенты</Text>
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
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>Добавить</Text>
        </TouchableOpacity>

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
                      <Picker.Item label="Выберите ингредиент"/>
                      {ingredientNames.map((ingredientName) => (
                          <Picker.Item key={ingredientName.id} label={ingredientName.name} value={ingredientName.id} />
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
                      <Picker.Item label="Выберите единицу"/>
                      {measurements.map((unit) => (
                          <Picker.Item key={unit.id} label={unit.name} value={unit.id} />
                      ))}
                  </Picker>
              </View>
              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#FF0000' }]} onPress={() => setModalVisible(false)}>
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
        <Text style={styles.heading}>Шаги</Text>
        {recipeSteps.map(step => (
          <View key={step.number} style={styles.stepContainer}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>{step.number}</Text>
            </View>
            <View style={styles.stepDescriptionContainer}>
              <Text style={styles.stepDescription}>{step.description}</Text>
              {step.image && (
                <Image source={{ uri: step.image }} style={styles.stepImage} />
              )}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={() => setStepModalVisible(true)}>
          <Text style={styles.addButtonText}>Добавить</Text>
        </TouchableOpacity>
        <Modal
          animationType='fade'
          transparent={true}
          visible={stepModalVisible}
          onRequestClose={() => setStepModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Добавить шаг</Text>
              <View style={styles.uplouadImageContainer}>
                {!selectedStepImage ? (
                  <TouchableOpacity style={styles.uploadStepButton} onPress={openImagePickerForStep}>
                    <Image 
                      source={require('../assets/uploadImage.png')}
                      style={styles.uploadStepImage} 
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={openImagePickerForStep}>
                    <Image
                      source={{ uri: selectedStepImage.uri }}
                      style={styles.selectedStepImage}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <TextInput
                style={styles.multilineInput}
                placeholder="Опишите шаг приготовления"
                placeholderTextColor="#9FA5C0"
                multiline={true}
                numberOfLines={4}
                value={selectedStepDescription}
                onChangeText={setSelectedStepDescription}
                textAlignVertical="top"
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#FF0000' }]} onPress={() => setStepModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Отмена</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: (selectedStepDescription === '' || !selectedStepImage)  ? '#D0DBEA' : '#1FCC79' }]}
                  disabled={(selectedStepDescription === '' || !selectedStepImage)}
                  onPress={handleAddStep}
                >
                  <Text style={styles.modalButtonText}>Добавить</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <TouchableOpacity style={[styles.acceptButton, { backgroundColor: '#1FCC79' }]} onPress={postRecipe}>
          <Text style={styles.acceptButtonText}>Готово</Text>
        </TouchableOpacity>
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
  uplouadImageContainer: {
    alignItems: 'center',
  },
  uploadButton: {
    width: '90%', // Ширина кнопки на 90% экрана
    height: 170, // Высота кнопки
    borderColor: '#D0DBEA', // Цвет рамки
    borderWidth: 2, // Ширина рамки
    borderRadius: 20, // Закругленные углы
    borderStyle: 'dashed', // Стиль рамки (пунктирная)
    alignItems: 'center', // Центрирует содержимое по горизонтали
    justifyContent: 'center', // Центрирует содержимое по вертикали
    marginVertical: 20, // Отступ сверху
  },
  uploadImage: {
    width: 50, // Ширина изображения
    height: 50, // Высота изображения
    tintColor: '#9FA5C0',
    marginBottom: 10, // Отступ между изображением и текстом
  },
  uploadText: {
    color: '#3E5481', // Цвет текста
    fontSize: 16, // Размер текста
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
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3E5481',
    marginVertical: 10, // Отступ сверху и снизу для заголовка
  },
  title: {
    fontSize: 18,
    color: '#9FA5C0',
    marginVertical: 10, // Отступ сверху и снизу для заголовка
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
  footer: {
    flexDirection: 'row',
  },
  sliderContainer: {
    marginTop: 10, // Отступ сверху для контейнера слайдера
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Распределение меток по горизонтали
    marginBottom: 0, // Отступ снизу для меток
  },
  sliderLabel: {
    fontSize: 16,
    color:'#1FCC79',
    fontWeight: 'bold',
    marginTop: 20,
  },
  scrollView: {
    paddingBottom: 20, // Отступ внизу для удобства прокрутки
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
  
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3E5481'
  },
  
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center', // Выравнивает элементы по центру по вертикали
    marginVertical: 5
},
icon: {
    width: 24,
    height: 24,
    marginRight: 7, // Отступ между иконкой и именем автора
},
ingredientText: {
  fontSize: 17,
  color: '#3E5481',
  flex: 1,
},
errorText: {
  color: 'red',
  fontSize: 16,
  marginVertical: 10,
},
uploadStepButton: {
  width: 200,
  height: 150, // Высота кнопки
  backgroundColor: '#F4F5F7',
  borderRadius: 20,
  alignItems: 'center', // Центрирует содержимое по горизонтали
  justifyContent: 'center', // Центрирует содержимое по вертикали
  marginVertical: 10, // Отступ сверху
},
uploadStepImage: {
  width: 35, // Ширина изображения
  height: 35, // Высота изображения
  tintColor: '#9FA5C0',
},
multilineInput: {
  height: "50%", // Высота текстового поля
  width: "100%",
  borderColor: '#D0DBEA', // Цвет рамки
  borderWidth: 2, // Ширина рамки
  borderRadius: 10, // Закругленные углы
  padding: 10, // Отступ внутри текстового поля
  color: '#3E5481', // Цвет текста
  fontSize: 15, // Размер текста
  marginTop: 10, // Отступ сверху и снизу
},
inputDescription: {
  height: 300, // Высота текстового поля
  width: "100%",
  borderColor: '#D0DBEA', // Цвет рамки
  borderWidth: 2, // Ширина рамки
  borderRadius: 10, // Закругленные углы
  padding: 10, // Отступ внутри текстового поля
  color: '#3E5481', // Цвет текста
  fontSize: 15, // Размер текста
  marginTop: 10, // Отступ сверху и снизу
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
acceptButton: {
  width: '100%', // Ширина кнопки на 100% экрана
  height: 50, // Высота кнопки
  backgroundColor: '#FFFFFF', // Цвет фона кнопки
  borderRadius: 32, // Закругленные углы
  alignItems: 'center', // Центрирует содержимое по горизонтали
  justifyContent: 'center', // Центрирует содержимое по вертикали
  marginVertical: 20, // Отступ сверху и снизу
},
acceptButtonText: {
  color: '#FFFFFF', // Цвет текста кнопки
  fontSize: 16, // Размер текста
  fontWeight: 'bold', // Жирный текст
},
selectedImage: {
  width: 300, // Ширина кнопки на 90% экрана
  height: 170, // Высота кнопки
  borderColor: '#D0DBEA', // Цвет рамки
  borderWidth: 2, // Ширина рамки
  borderRadius: 20, // Закругленные углы
  alignItems: 'center', // Центрирует содержимое по горизонтали
  justifyContent: 'center', // Центрирует содержимое по вертикали
  marginVertical: 20, // Отступ сверху
},
selectedStepImage: {
  width: 200, // Ширина кнопки на 90% экрана
  height: 150, // Высота кнопки
  borderColor: '#D0DBEA', // Цвет рамки
  borderWidth: 2, // Ширина рамки
  borderRadius: 20, // Закругленные углы
  alignItems: 'center', // Центрирует содержимое по горизонтали
  justifyContent: 'center', // Центрирует содержимое по вертикали
  marginVertical: 10, // Отступ сверху
},
removeButton: {
  marginLeft: 10,
},
removeIcon: {
  width: 24,
  height: 24,
  tintColor: '#FF0000',
}
});

export default CreateScreen;