import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';

const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>С возвращением!</Text>
      <Text style={styles.subtitle}>Войдите в свой аккаунт здесь</Text>

      <View style={styles.inputContainer}>
        <Image source={require('../assets/registrationIcons/email.png')} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Электронная почта"
          placeholderTextColor="#9FA5C0"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Image source={require('../assets/registrationIcons/password.png')} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Пароль"
          placeholderTextColor="#9FA5C0"
          secureTextEntry
        />
      </View>

      <CustomButton title="Войти" onPress={() => navigation.navigate('Main')} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>У вас ещё нет аккаунта? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
          <Text style={styles.loginText}>Регистрация</Text>
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

export default LoginScreen;