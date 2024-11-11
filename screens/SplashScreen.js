import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.background} />
      <Image
        source={require('../assets/startImage.png')}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.title}>Just Taste It</Text>
      <Text style={styles.subtitle}>Присоединяйтесь к нашему{'\n'}сообществу, чтобы создавать{'\n'}кулинарные шедевры</Text>
      <CustomButton title="Начать" onPress={() => navigation.navigate('Registration')} />
    </View>
  );
};

const CustomButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
  },
  image: {
    width: '100%',
    height: '60%',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center',
    color: '#3E5481',
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 30,
    color: '#9FA5C0', 
    fontWeight: 'normal',
    marginTop: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1FCC79',
    borderRadius: 32,
    width: '80%',
    paddingVertical: 16,
    marginTop: 30,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default SplashScreen;
