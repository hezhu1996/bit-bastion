import { CustomTabBar } from '@/components/custom-tab-bar';
import { ScrollPicker } from '@/components/scroll-picker';
import { useFocusDuration } from '@/contexts/focus-context';
import { Asset } from 'expo-asset';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

const MINUTE_OPTIONS = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

export default function HomeScreen() {
  const { focusDuration, setFocusDuration } = useFocusDuration();
  const [showFocus, setShowFocus] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(focusDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const { height } = useWindowDimensions();
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    // 预加载 Focus 页面的背景，避免滑入时闪黑
    Asset.fromModule(require('@/assets/images/basic/main_bg_2.png')).downloadAsync().catch(() => {});
  }, []);

  // 保证隐藏时在屏幕下方，避免初次显示闪烁
  useEffect(() => {
    slideAnim.setValue(height);
  }, [height, slideAnim]);

  const handleStartFocus = () => {
    const initialSeconds = focusDuration * 60;
    setTimeRemaining(initialSeconds);
    setIsActive(true);
    setShowFocus(true);

    // 初始化到屏幕底部再上滑
    slideAnim.setValue(height);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  // 计时逻辑，仅在 overlay 显示时运行
  useEffect(() => {
    if (!showFocus) return;
    let interval: any = null;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeRemaining === 0) {
      setIsActive(false);
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 280,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(() => setShowFocus(false));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showFocus, isActive, timeRemaining, height]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGiveUp = () => {
    setIsActive(false);
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 280,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => setShowFocus(false));
  };

  return (
    <ImageBackground
      source={require('@/assets/images/basic/main_bg_2.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Dragon with Timer */}
        <View style={styles.dragonContainer}>
          <Image
            source={require('@/assets/images/basic/dragon.png')}
            style={styles.dragon}
            resizeMode="contain"
          />
          
          {/* Time Picker */}
          <View style={styles.timePickerContainer}>
            <ScrollPicker
              values={MINUTE_OPTIONS}
              selectedValue={focusDuration}
              onValueChange={setFocusDuration}
              itemHeight={55}
              visibleItems={1}
            />
            <Text style={styles.timeSeparator}>:</Text>
            <Text style={styles.secondsText}>00</Text>
          </View>
        </View>

        <Image
          source={require('@/assets/images/basic/man_basic.png')}
          style={styles.manBasic}
          resizeMode="contain"
        />

        {/* Buttons Group */}
        <View style={styles.buttonsGroup}>
          {/* Start Focus Quest Button */}
          <TouchableOpacity 
            onPress={handleStartFocus} 
            activeOpacity={0.8}
            style={styles.startButton1Touchable}
          >
            <ImageBackground
              source={require('@/assets/images/basic/start_button_1.png')}
              style={styles.startButton1Container}
              resizeMode="contain"
            >
              <Text style={styles.startButton1Text}>START FOCUS QUEST</Text>
            </ImageBackground>
          </TouchableOpacity>

          {/* Blood Oath Button */}
          <ImageBackground
            source={require('@/assets/images/basic/start_button_2.png')}
            style={styles.startButton2Container}
            resizeMode="contain"
          >
            <Text style={styles.startButton2Text}>BLOOD OATH</Text>
          </ImageBackground>
        </View>

        <CustomTabBar currentTab="home" />

        {/* Focus Overlay (自定义滑入，常驻隐藏防止闪烁) */}
        <Animated.View
          pointerEvents={showFocus ? 'auto' : 'none'}
          style={[
            styles.focusOverlay,
            {
              transform: [{ translateY: slideAnim }],
              opacity: showFocus ? 1 : 0.99, // 避免透明度为0导致卸载合成帧
            },
          ]}
        >
          <ImageBackground
            source={require('@/assets/images/basic/main_bg_2.png')}
            style={styles.focusBackground}
            resizeMode="cover"
          >
            <View style={styles.focusContent}>
              <Text style={styles.focusTitle}>🍅 FOCUS TIME</Text>

              <View style={styles.timerCircle}>
                <Text style={styles.focusTimerText}>{formatTime(timeRemaining)}</Text>
                <Text style={styles.focusTimerSubtext}>Stay focused!</Text>
              </View>

              <TouchableOpacity
                style={styles.stopButton}
                onPress={handleGiveUp}
                activeOpacity={0.7}
              >
                <Text style={styles.stopButtonText}>GIVE UP</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  dragonContainer: {
    width: 300,
    height: 300,
    position: 'absolute',
    top: '35%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragon: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  timeSeparator: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 30,
    color: '#FFD700',
    marginHorizontal: -25,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    transform: [{ scaleY: 1.2 }],
  },
  secondsText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 32,
    color: '#FFD700',
    width: 110,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    transform: [{ scaleY: 1.2 }],
  },
  manBasic: {
    width: 150,
    height: 150,
    position: 'absolute',
    top: '20%',
    left: '5%',
  },
  buttonsGroup: {
    position: 'absolute',
    bottom: '10%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  startButton1Touchable: {
    zIndex: 2,
    marginBottom: -100,
  },
  startButton1Container: {
    width: 380,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton1Text: {
    marginLeft: 85,
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 15,
    color: '#F5E6D3',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    transform: [{ scaleY: 1.2 }],
  },
  startButton2Container: {
    width: 300,
    height: 180,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton2Text: {
    marginTop: 30,
    marginLeft: 55,
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 15,
    color: '#F5E6D3',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    transform: [{ scaleY: 1.2 }],
  },
  // Focus overlay
  focusOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1a1a2e',
    zIndex: 20,
  },
  focusBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  focusContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusTitle: {
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
  focusTimerText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 32,
    color: '#FFD700',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  focusTimerSubtext: {
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
