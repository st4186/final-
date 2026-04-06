import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { getToken } from './src/helpers/storage';

export default function Index() {
  const router = useRouter();

  React.useEffect(() => {
    const checkSession = async () => {
      const token = await getToken();
      if (token) {
        router.replace('/home');
      } else {
        router.replace('/login');
      }
    };
    checkSession();
  }, []);

  // Splash minimalista mientras redirige
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#f97316" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1040',
  },
});
