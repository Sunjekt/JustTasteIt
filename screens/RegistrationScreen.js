import React, { useState }  from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';

const RegistrationScreen = ({ route, navigation }) => {

  const { user, setUser } = route.params;

  const [errorMessages, setErrorMessages] = useState([])
  const [formValues, setFormValues] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const handleInputChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const registration = async () => {
    console.log("Success:", formValues);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formValues.username,
        email: formValues.email,
        password: formValues.password,
        passwordConfirm: formValues.passwordConfirm,
      }),
    };

    try {
      const response = await fetch("https://localhost:7108/api/account/register", requestOptions);
      const data = await response.json();

      if (response.status === 200) {
        const newUser = { isAuthenticated: true, id: "015bf47f-44bb-43fc-bc70-b79a25f546fc", userName: "Sunjekt"}; // временный обход пока не работает получение пользователя
        // setUser ({ isAuthenticated: true, id: data.id, userName: data.userName});
        console.log("User :", data);
        navigation.navigate('Main', { user: newUser, setUser });
      } else {
        if (data.error) {
          setErrorMessages(data.error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Добро пожаловать!</Text>
      <Text style={styles.subtitle}>Создайте свой аккаунт здесь</Text>

      <View style={styles.inputContainer}>
        <Image source={require('../assets/registrationIcons/username.png')} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Имя"
          placeholderTextColor="#9FA5C0"
          value={formValues.username}
          onChangeText={(value) => handleInputChange('username', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Image source={require('../assets/registrationIcons/email.png')} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Электронная почта"
          placeholderTextColor="#9FA5C0"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formValues.email}
          onChangeText={(value) => handleInputChange('email', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Image source={require('../assets/registrationIcons/password.png')} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Пароль"
          placeholderTextColor="#9FA5C0"
          secureTextEntry
          value={formValues.password}
          onChangeText={(value) => handleInputChange('password', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Image source={require('../assets/registrationIcons/password.png')} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Повторите пароль"
          placeholderTextColor="#9FA5C0"
          secureTextEntry
          value={formValues.passwordConfirm}
          onChangeText={(value) => handleInputChange('passwordConfirm', value)}
        />
      </View>

      <CustomButton title="Зарегистрироваться" onPress={registration} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>У вас уже есть аккаунт? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login', { user, setUser })}>
          <Text style={styles.loginText}>Вход</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CustomButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center',
    color: '#3E5481',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 30,
    color: '#9FA5C0',
    fontWeight: 'normal',
    marginTop: 10,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 32,
    marginTop: 15,
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
  button: {
    backgroundColor: '#1FCC79',
    width: '100%',
    borderRadius: 32,
    paddingVertical: 16,
    marginTop: 30,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  footerText: {
    fontSize: 15,
    color: '#3E5481',
  },
  loginText: {
    fontSize: 15,
    color: '#1FCC79',
    fontWeight: 'bold',
  },
});

export default RegistrationScreen;