import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -20,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Check auth and navigate
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth/login');
      }
    };

    checkAuth();
  }, []);

  return (
    <LinearGradient
      colors={['#1a0a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: floatAnim }],
          },
        ]}
      >
        <Text style={styles.logo}>📖</Text>
        <Text style={styles.title}>PoetryWorld</Text>
        <Text style={styles.subtitle}>Where words dance and emotions flow</Text>
        
        <View style={styles.floatingWords}>
          <Text style={[styles.floatingWord, { top: 100, left: 50 }]}>dreams</Text>
          <Text style={[styles.floatingWord, { top: 200, right: 60 }]}>love</Text>
          <Text style={[styles.floatingWord, { bottom: 150, left: 40 }]}>hope</Text>
          <Text style={[styles.floatingWord, { bottom: 250, right: 50 }]}>soul</Text>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    fontFamily: 'serif',
  },
  subtitle: {
    fontSize: 16,
    color: '#e94560',
    fontStyle: 'italic',
  },
  floatingWords: {
    position: 'absolute',
    width: width,
    height: height,
  },
  floatingWord: {
    position: 'absolute',
    color: 'rgba(255, 255, 255, 0.2)',
    fontSize: 24,
    fontStyle: 'italic',
    fontFamily: 'serif',
  },
});
