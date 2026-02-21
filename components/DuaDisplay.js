import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import {SEHRI_DUA, IFTAR_DUA} from '../constants/duas';

const {width} = Dimensions.get('window');

function DuaDisplay({route}) {
  const {duaType, minutesLeft, ramadanDay} = route?.params || {};
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getDuaContent = () => {
    return duaType === 'sehri' ? SEHRI_DUA : IFTAR_DUA;
  };

  const getTimeStatus = () => {
    if (minutesLeft > 0) {
      return {
        isEarly: true,
        message: `Hurry Up! ${minutesLeft} minutes left`,
        icon: duaType === 'sehri' ? '🌙' : '🌅',
        color: '#FFB6C1',
      };
    }
    return {
      isEarly: false,
      message: duaType === 'sehri' ? 'Time to Fast' : 'Time to Break Your Fast',
      icon: duaType === 'sehri' ? '🌙' : '🌅',
      color: '#8B5A8E',
    };
  };

  const dua = getDuaContent();
  const timeStatus = getTimeStatus();

  return (
    <ImageBackground
      source={require('../assets/bg.png')}
      style={styles.backgroundImage}
      resizeMode="cover">
      <StatusBar barStyle="dark-content" backgroundColor="#ffe6fa" translucent={false} />
      <SafeAreaView style={styles.container}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{scale: scaleAnim}],
            },
          ]}>
          
          {/* Header Card */}
          <View style={styles.headerCard}>
            <Text style={styles.headerIcon}>{timeStatus.icon}</Text>
            <Text style={styles.headerTitle}>
              {duaType === 'sehri' ? 'Sehri Time' : 'Iftar Time'}
            </Text>
            {ramadanDay && (
              <Text style={styles.ramadanDay}>Day {ramadanDay} of Ramadan</Text>
            )}
          </View>

          {/* Time Status Card */}
          {timeStatus.isEarly && (
            <View style={[styles.statusCard, styles.urgentCard]}>
              <Text style={styles.urgentIcon}>⏰</Text>
              <Text style={styles.urgentText}>{timeStatus.message}</Text>
              <Text style={styles.urgentSubtext}>
                {duaType === 'sehri' 
                  ? 'Complete your meal before time runs out!' 
                  : 'Get ready to break your fast!'}
              </Text>
            </View>
          )}

          {/* Dua Card */}
          <View style={styles.duaCard}>
            <Text style={styles.duaLabel}>Dua</Text>
            
            <View style={styles.duaSection}>
              <Text style={styles.arabicText}>{dua.arabic}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.duaSection}>
              <Text style={styles.transliterationLabel}>Transliteration:</Text>
              <Text style={styles.transliterationText}>{dua.transliteration}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.duaSection}>
              <Text style={styles.englishLabel}>Meaning:</Text>
              <Text style={styles.englishText}>{dua.english}</Text>
            </View>
          </View>

          {/* Footer Message */}
          <View style={styles.footerCard}>
            <Text style={styles.footerText}>
              {duaType === 'sehri' 
                ? '🤲 May Allah accept your fast' 
                : '🤲 May Allah accept your fast and worship'}
            </Text>
          </View>
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  headerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#D8A7D8',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#8B5A8E',
    marginBottom: 5,
  },
  ramadanDay: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B388B3',
    marginTop: 5,
  },
  statusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#D8A7D8',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  urgentCard: {
    backgroundColor: 'rgba(255, 182, 193, 0.3)',
    borderColor: 'rgba(255, 182, 193, 0.5)',
  },
  urgentIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  urgentText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#D63384',
    marginBottom: 8,
    textAlign: 'center',
  },
  urgentSubtext: {
    fontSize: 15,
    fontWeight: '500',
    color: '#8B5A8E',
    textAlign: 'center',
  },
  duaCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 25,
    padding: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#D8A7D8',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  duaLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8B5A8E',
    textAlign: 'center',
    marginBottom: 20,
  },
  duaSection: {
    marginVertical: 10,
  },
  arabicText: {
    fontSize: 26,
    fontWeight: '600',
    color: '#8B5A8E',
    textAlign: 'center',
    lineHeight: 42,
    fontFamily: 'System',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(179, 136, 179, 0.3)',
    marginVertical: 15,
  },
  transliterationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B388B3',
    marginBottom: 8,
    textAlign: 'center',
  },
  transliterationText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8B5A8E',
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  englishLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B388B3',
    marginBottom: 8,
    textAlign: 'center',
  },
  englishText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#8B5A8E',
    textAlign: 'center',
    lineHeight: 26,
  },
  footerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#D8A7D8',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5A8E',
    textAlign: 'center',
  },
});

export default DuaDisplay;
