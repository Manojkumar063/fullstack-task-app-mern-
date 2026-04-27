import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { authAPI } from '../services/api';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID'
  });

  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleLogin(response.authentication.idToken);
    }
  }, [response]);

  const handleLogin = async () => {
    try {
      const { data } = await authAPI.login(email, password);
      await AsyncStorage.setItem('token', data.token);
      navigation.replace('Tasks');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleLogin = async (token) => {
    try {
      const { data } = await authAPI.googleLogin(token);
      await AsyncStorage.setItem('token', data.token);
      navigation.replace('Tasks');
    } catch (error) {
      Alert.alert('Error', 'Google login failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Manager</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      
      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity 
        style={styles.googleButton} 
        onPress={() => promptAsync()}
        disabled={!request}
      >
        <Text style={styles.googleButtonText}>🔐 Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 40, textAlign: 'center' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, marginTop: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '600' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: '#ddd' },
  orText: { marginHorizontal: 10, color: '#999' },
  googleButton: { backgroundColor: '#fff', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  googleButtonText: { textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#333' },
  link: { color: '#007AFF', textAlign: 'center', marginTop: 20 }
});
