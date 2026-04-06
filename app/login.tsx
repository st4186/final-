/**
 * LoginScreen - Pantalla de inicio de sesión
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/home');
    }, 1500);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar style="light" />

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Parte superior */}
          <View style={styles.topSection}>
            <View style={styles.orangeOverlay} />
            <View style={styles.logoContainer}>
              <View style={styles.logoBox}>
                <Ionicons name="cube-outline" size={38} color="white" />
              </View>
              <Text style={styles.logoTitle}>EDUTECH</Text>
              <Text style={styles.logoSub}>INVENTORY</Text>
            </View>
          </View>

          {/* Formulario */}
          <View style={styles.formPanel}>
            <Text style={styles.formTitle}>Start requesting :D</Text>

            <Text style={styles.label}>E-mail:</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#bbb"
                placeholder="your@email.com"
              />
            </View>

            <Text style={styles.label}>Password:</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#bbb"
                placeholder="••••••••"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotRow}>
              <Text style={styles.forgotText}>forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginBtn, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginBtnText}>LOG IN</Text>
              )}
            </TouchableOpacity>

            {/* Register - SIN logos sociales */}
            <View style={styles.registerRow}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.registerLink}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1040',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  topSection: {
    backgroundColor: '#2a1a5e',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  orangeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(249,115,22,0.20)',
  },
  logoContainer: {
    alignItems: 'center',
    zIndex: 1,
  },
  logoBox: {
    width: 75,
    height: 75,
    backgroundColor: '#f97316',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoTitle: {
    color: '#f97316',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 2.5,
  },
  logoSub: {
    color: '#f97316',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 4,
    marginTop: 2,
  },
  formPanel: {
    backgroundColor: '#5b3fd4',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 28,
    paddingTop: 30,
    paddingBottom: 40,
  },
  formTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 22,
  },
  label: {
    color: 'white',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 14,
    paddingHorizontal: 12,
    height: 46,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    height: '100%',
  },
  eyeBtn: {
    paddingLeft: 10,
    height: '100%',
    justifyContent: 'center',
  },
  forgotRow: {
    alignItems: 'flex-end',
    marginBottom: 20,
    marginTop: -6,
  },
  forgotText: {
    color: '#c4b5fd',
    fontSize: 12,
  },
  loginBtn: {
    backgroundColor: '#f97316',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 18,
  },
  loginBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: '#c4b5fd',
    fontSize: 13,
  },
  registerLink: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
  },
});