import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { validateField } from '../helpers/validation';
import { useAuthViewModel } from '../viewmodels/useAuthViewModel';

export default function LoginView() {
  const router = useRouter();
  const { login, loading, error } = useAuthViewModel();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const handleLogin = async () => {
    setTouched({ email: true, password: true });

    const emailValidation = validateField(email, 'email');
    if (!emailValidation.isValid) {
      Alert.alert('Error', emailValidation.message);
      return;
    }
    if (!password) {
      Alert.alert('Error', 'Por favor ingresa tu contraseña');
      return;
    }

    const result = await login({ email, password });
    if (result.success) {
      router.replace('/home');
    } else {
      Alert.alert('Error', result.message || 'Error al iniciar sesión');
    }
  };

  const emailError =
    touched.email && !validateField(email, 'email').isValid
      ? validateField(email, 'email').message
      : null;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo superior */}
          <View style={styles.topSection}>
            <View style={styles.orangeOverlay} />
            <View style={styles.logoContainer}>
              <View style={styles.logoBox}>
                <Ionicons name="cube-outline" size={48} color="white" />
              </View>
              <Text style={styles.logoTitle}>EDUTECH</Text>
              <Text style={styles.logoSub}>INVENTORY</Text>
            </View>
          </View>

          {/* Formulario */}
          <View style={styles.formPanel}>
            <Text style={styles.formTitle}>Start requesting :D</Text>

            {/* Email */}
            <Text style={styles.label}>E-mail:</Text>
            <View style={[styles.inputBox, emailError ? styles.inputBoxError : null]}>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#bbb"
                placeholder="your@email.com"
              />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            {/* Password */}
            <Text style={styles.label}>Password:</Text>
            <View style={[
              styles.inputBox,
              touched.password && !password ? styles.inputBoxError : null,
            ]}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={password}
                onChangeText={setPassword}
                onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
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
            {touched.password && !password ? (
              <Text style={styles.errorText}>Este campo es requerido</Text>
            ) : null}

            {/* Forgot password */}
            <TouchableOpacity style={styles.forgotRow}>
              <Text style={styles.forgotText}>forgot password?</Text>
            </TouchableOpacity>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Botón LOG IN */}
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

            {/* Register - Solo esto queda, sin los logos sociales */}
            <View style={styles.registerRow}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.registerLink}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2a1a5e',
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },

  // Top section
  topSection: {
    height: 300,
    backgroundColor: '#2a1a5e',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: 100,
    height: 100,
    backgroundColor: '#f97316',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  logoTitle: {
    color: '#f97316',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 3,
  },
  logoSub: {
    color: '#f97316',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 5,
    marginTop: 2,
  },

  // Form
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
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputBoxError: {
    borderColor: '#ff6b6b',
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
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 2,
  },
  loginBtn: {
    backgroundColor: '#f97316',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 4,
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