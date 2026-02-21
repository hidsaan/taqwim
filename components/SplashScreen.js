import React, {useEffect, useRef} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

const {width, height} = Dimensions.get('window');

function SplashScreen({onFinish}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    // Start fade-in animation from left to right
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Wait a bit after animation completes, then fade out
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          if (onFinish) onFinish();
        });
      }, 1000);
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{translateX: slideAnim}],
          },
        ]}>
        <Image
          source={require('../assets/logo_pastel.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Taqwim</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#efbdce',
  },
  circle1: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    backgroundColor: 'rgba(179, 136, 179, 0.15)',
    top: -width * 0.5,
    left: -width * 0.3,
  },
  circle2: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: 'rgba(255, 182, 193, 0.1)',
    bottom: -width * 0.4,
    right: -width * 0.2,
  },
  circle3: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: 'rgba(243, 229, 245, 0.08)',
    top: height * 0.6,
    left: width * 0.1,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 40,
    padding: 40,
  },
  logo: {
    width: 180,
    height: 180,
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: '#8B5A8E',
    marginTop: 20,
    letterSpacing: 2,
  },
});

export default SplashScreen;
