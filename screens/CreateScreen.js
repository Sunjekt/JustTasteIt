import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import { Modal } from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

const CreateScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cookingTime, setCookingTime] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [ingredientAmount, setIngredientAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [stepModalVisible, setStepModalVisible] = useState(false);
  const [selectedStepDescription, setSelectedStepDescription] = useState('');
  const [selectedStepImage, setSelectedStepImage] = useState('');

  const staticCategories = [
    { id: 1, name: 'Завтрак' },
    { id: 2, name: 'Обед' },
    { id: 3, name: 'Ужин' },
    { id: 4, name: 'Салаты' },
    { id: 5, name: 'Закуски' },
    { id: 6, name: 'Десерты' },
  ];

  const cookingTimeLabels = ['<10 мин', '30 мин', '>60 мин'];

  const [ingredients, setIngredients] = useState([]);
  const [recipeSteps, setRecipeSteps] = useState([]);

  const ingredientsName = ['Мука', 'Сахар', 'Соль', 'Яйца', 'Молоко'];
  const units = ['г', 'кг', 'мл', 'л', 'шт'];

  const handleAddIngredient = () => {
    const ingredientExists = ingredients.some(ingredient => ingredient.name === selectedIngredient);

    if (ingredientExists) {
      setErrorMessage('Ингредиент уже добавлен!'); // Устанавливаем сообщение об ошибке
      return; // Прерываем выполнение функции
    }

    const newIngredient = {
      name: selectedIngredient,
      count: parseInt(ingredientAmount),
      measurementName: selectedUnit,
    };

    setIngredients([...ingredients, newIngredient]);
    setErrorMessage('');

    setModalVisible(false);
    setSelectedIngredient('');
    setSelectedUnit('');
    setIngredientAmount('');
  };

  const handleAddStep = () => {

    const newStep = {
      number: recipeSteps.length + 1,
      image: selectedStepImage,
      description: selectedStepDescription,
    };

    setRecipeSteps([...recipeSteps, newStep]);

    setStepModalVisible(false);
    setSelectedStepDescription('');
    setSelectedStepImage('');
  };

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo', // Убедитесь, что вы указали тип медиа
    };
  
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('Пользователь отменил выбор');
      } else if (response.error) {
        console.log('Ошибка при выборе: ', response.error);
      } else if (response.customButton) {
        console.log('Отправлено пользовательское нажатие на кнопку: ', response.customButton);
      } else {
        // Проверяем, существует ли assets и не пуст ли он
        if (response.assets && response.assets.length > 0) {
          const source = { uri: response.assets[0].uri }; // Получаем URI изображения
          setSelectedStepImage(source); // Устанавливаем выбранное изображение
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
          <TouchableOpacity style={styles.uploadButton}>
            <Image 
              source={require('../assets/uploadImage.png')}
              style={styles.uploadImage} 
            />
            <Text style={styles.uploadText}>Загрузить фотографию</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.heading}>Название</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Введите название рецепта"
            placeholderTextColor="#9FA5C0"
          />
        </View>
        <Text style={styles.heading}>Описание</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Введите описание рецепта"
            placeholderTextColor="#9FA5C0"
          />
        </View>
        <Text style={styles.heading}>Категория</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Выберите категорию:" value="" />
            {staticCategories.map((category) => (
              <Picker.Item key={category.id} label={category.name} value={category.id} />
            ))}
          </Picker>
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
          <View key={ingredient.name} style={styles.footerLeft}>
            <Image source={require('../assets/mark.png')} style={styles.icon} />
            <Text style={styles.ingredientText}>
              {ingredient.name}: {ingredient.count} {ingredient.measurementName} 
            </Text>
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
                  <Picker.Item label="Выберите ингредиент" value="" />
                  {ingredientsName.map((ingredient, index) => (
                    <Picker.Item key={index} label={ingredient} value={ingredient} />
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
                  <Picker.Item label="Выберите единицу" value="" />
                  {units.map((unit, index) => (
                    <Picker.Item key={index} label={unit} value={unit} />
                  ))}
                </Picker>
              </View>
              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, { backgroundColor: '#FF0000' }]} onPress={() => setModalVisible(false)}>
                  <Text style={styles.textStyle}>Отмена</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: '#1FCC79' }]} onPress={handleAddIngredient}>
                  <Text style={styles.textStyle}>Добавить</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Text style={styles.heading}>Шаги</Text>
        {recipeSteps.map(step => (
          <View key={step.id} style={styles.stepContainer}>
            <View style={styles.stepNumberContainer}>
              <Text style={styles.stepNumber}>{step.number}</Text>
            </View>
            <View style={styles.stepDescriptionContainer}>
              <Text style={styles.stepDescription}>{step.description}</Text>
              {step.image && (
                <Image source={{ uri: step.image.uri }} style={styles.stepImage} />
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
              
              <View style={styles.uplouadImageContainer}>
              <TouchableOpacity style={styles.uploadStepButton} onPress={openImagePicker}>
                <Image 
                  source={require('../assets/uploadStep.png')}
                  style={styles.uploadStepImage} 
                />
              </TouchableOpacity>
              </View>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, { backgroundColor: '#FF0000' }]} onPress={() => setStepModalVisible(false)}>
                  <Text style={styles.textStyle}>Отмена</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: '#1FCC79' }]} onPress={handleAddStep}>
                  <Text style={styles.textStyle}>Добавить</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <TouchableOpacity style={[styles.acceptButton, { backgroundColor: '#1FCC79' }]}>
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
    width: '100%',
    color: '#3E5481', // Цвет текста в Picker
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Затемнение фона
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalView: {
    width: '80%', // Ширина модального окна
    height: 440,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    width: '40%',
    padding: 10,
    elevation: 2,
    marginVertical: 10,
  },
  textStyle: {
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
    justifyContent: 'space-between', // Распределение кнопок по горизонтали
    width: '100%', // Ширина контейнера на 100%
    marginTop: 20, // Отступ сверху для отделения от других элементов
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
ingredientText: {
  fontSize: 17,
  color: '#3E5481',
},
errorText: {
  color: 'red',
  fontSize: 16,
  marginVertical: 10,
},
uploadStepButton: {
  width: 230,
  height: 50, // Высота кнопки
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
  height: 100, // Высота текстового поля
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
});

export default CreateScreen;