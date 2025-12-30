import { CustomTabBar } from '@/components/custom-tab-bar';
import { useFocusDuration } from '@/contexts/focus-context';
import { Href, router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FocusScreen() {
  const { focusDuration } = useFocusDuration();

  const [timeRemaining, setTimeRemaining] = useState(focusDuration * 60);
  const [isActive, setIsActive] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setTimeRemaining(focusDuration * 60);
      setIsActive(true);

      return () => {
        setIsActive(false);
      };
    }, [focusDuration])
  );

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeRemaining === 0) {
      setIsActive(false);
      router.replace('/(tabs)' as Href);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStop = () => {
    setIsActive(false);
    router.replace('/(tabs)' as Href);
  };

  return (
    <ImageBackground
      source={require('@/assets/images/basic/main_bg_2.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>🍅 FOCUS TIME</Text>
        
        <View style={styles.timerCircle}>
          <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
          <Text style={styles.timerSubtext}>Stay focused!</Text>
        </View>

        <TouchableOpacity 
          style={styles.stopButton} 
          onPress={handleStop}
          activeOpacity={0.7}
        >
          <Text style={styles.stopButtonText}>GIVE UP</Text>
        </TouchableOpacity>
      </View>

      <CustomTabBar currentTab="focus" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a2e',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 18,
    color: '#FFD700',
    marginBottom: 40,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  timerCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  timerText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 32,
    color: '#FFD700',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  timerSubtext: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#88CCFF',
    marginTop: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  stopButton: {
    marginTop: 50,
    paddingVertical: 16,
    paddingHorizontal: 48,
    backgroundColor: 'rgba(139, 0, 0, 0.9)',
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#FF4500',
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  stopButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 18,
    color: '#FFFFFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

