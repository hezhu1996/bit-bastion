import { Images } from '@/assets/images/basic';
import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  FadeInUp,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// 社交登录按钮组件
function SocialButton({ source, onPress }: { source: any; onPress: () => void }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.85, {
      damping: 15,
      stiffness: 500,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 500,
    });
  };

  return (
    <TouchableOpacity
      style={styles.socialBtn}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      activeOpacity={1}
    >
      <Animated.View style={animatedStyle}>
        <Image source={source} style={styles.socialIcon} resizeMode="contain" />
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function LoginScreen() {
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  
  const itemHeight = 40;
  const translateY = useSharedValue(0);
  const context = useSharedValue(0);
  
  // 监听滚动位置，更新 JS 端的 isLogin 状态
  useDerivedValue(() => {
    const index = Math.round(-translateY.value / itemHeight);
    const currentModeIndex = Math.abs(index % 2); // 0 或 1
    runOnJS(setIsLogin)(currentModeIndex === 0);
  });

  const handleLogin = async () => {
    if (!username || !password) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = translateY.value;
    })
    .onUpdate((event) => {
      translateY.value = context.value + event.translationY;
    })
    .onEnd((event) => {
      // 计算惯性滚动结束位置
      const targetY = context.value + event.translationY + event.velocityY * 0.1;
      const targetIndex = Math.round(-targetY / itemHeight);
      const snapPoint = -targetIndex * itemHeight;

      translateY.value = withSpring(snapPoint, {
        damping: 15,
        stiffness: 150,
      });
    });

  // 动态文本组件 - 用于无限滚动
  const DynamicText = ({ offset }: { offset: number }) => {
    const style = useAnimatedStyle(() => {
      const centerIndex = Math.round(-translateY.value / itemHeight);
      const absoluteIndex = centerIndex + offset;
      const targetY = absoluteIndex * itemHeight;
      const relativeY = targetY + translateY.value;
      
      const opacity = interpolate(
        relativeY,
        [-itemHeight, 0, itemHeight],
        [0.4, 1, 0.4],
        Extrapolation.CLAMP
      );
      
      const scale = interpolate(
        relativeY,
        [-itemHeight, 0, itemHeight],
        [0.8, 1.1, 0.8],
        Extrapolation.CLAMP
      );

      const rotateX = interpolate(
        relativeY,
        [-itemHeight, 0, itemHeight],
        [45, 0, -45],
        Extrapolation.CLAMP
      );

      return {
        position: 'absolute',
        height: itemHeight,
        justifyContent: 'center',
        alignItems: 'center',
        opacity,
        transform: [
          { translateY: relativeY },
          { perspective: 500 },
          { rotateX: `${rotateX}deg` },
          { scale },
        ],
      };
    });

    const textStyle1 = useAnimatedStyle(() => {
      const centerIndex = Math.round(-translateY.value / itemHeight);
      const absoluteIndex = centerIndex + offset;
      return {
        opacity: Math.abs(absoluteIndex % 2) === 0 ? 1 : 0,
      };
    });

    const textStyle2 = useAnimatedStyle(() => {
      const centerIndex = Math.round(-translateY.value / itemHeight);
      const absoluteIndex = centerIndex + offset;
      return {
        opacity: Math.abs(absoluteIndex % 2) === 1 ? 1 : 0,
      };
    });

    return (
      <Animated.View style={style}>
        <Animated.Text style={[styles.tabTextActive, styles.absoluteText, textStyle1]}>
          Login
        </Animated.Text>
        <Animated.Text style={[styles.tabTextActive, styles.absoluteText, textStyle2]}>
          Signup
        </Animated.Text>
      </Animated.View>
    );
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D4A84B" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={Images.bg}
      style={styles.background}
      resizeMode="contain"
    >
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Title Section */}
        <Animated.View 
          entering={FadeInUp.delay(200).duration(800)}
          style={styles.titleContainer}
        >
          <View style={styles.bannerWrapper}>
            <Image
              source={Images.bgTitle}
              style={styles.bannerImage}
              resizeMode="contain"
            />
            <View style={styles.bannerTextContainer}>
              <Text style={styles.title}>BIT BASTION</Text>
            </View>
          </View>
        </Animated.View>

        {/* Login Modal */}
        <Animated.View 
          entering={FadeInUp.delay(400).duration(800)}
          style={styles.loginModalContainer}
        >
          <Image
            source={Images.loginModal}
            style={styles.loginModalImage}
            resizeMode="contain"
          />
          
          {/* Form Overlay */}
          <View style={styles.formOverlay}>
            {/* Top Banner - Login/Signup Toggle */}
            <GestureDetector gesture={panGesture}>
              <View style={styles.modalBanner}>
                <View style={styles.slidingTextContainer}>
                  {[-2, -1, 0, 1, 2].map((offset) => (
                    <DynamicText key={offset} offset={offset} />
                  ))}
                </View>
                <Text style={styles.swipeHint}>↑ Scroll ↓</Text>
              </View>
            </GestureDetector>

            {/* Username Input */}
            <View style={styles.usernameWrapper}>
              <TextInput
                style={[styles.modalInput, styles.usernameInput]}
                placeholder="Username"
                placeholderTextColor="#8B7355"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.modalInput, styles.passwordInput]}
                placeholder="Password"
                placeholderTextColor="#8B7355"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* Login/Signup Button */}
            <TouchableOpacity
              style={styles.signinWrapper}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>
                {isLoading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
              </Text>
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPasswordBtn}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Social Login Section */}
            <View style={styles.socialSection}>
              <Text style={styles.socialTitle}>Or continue with</Text>
              <View style={styles.socialButtons}>
                <SocialButton
                  source={Images.appleIcon}
                  onPress={() => console.log('Apple login')}
                />
                <SocialButton
                  source={Images.googleIcon}
                  onPress={() => console.log('Google login')}
                />
                <SocialButton
                  source={Images.facebookIcon}
                  onPress={() => console.log('Facebook login')}
                />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Footer */}
        <Animated.View 
          entering={FadeInUp.delay(600).duration(800)}
          style={styles.footer}
        >
          <Text style={styles.footerText}>© 2025 Bit Bastion</Text>
        </Animated.View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#2a3a4a',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  titleContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  bannerWrapper: {
    width: width * 1.1,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  bannerTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: 'PressStart2P_400Regular',
    color: '#5C4033',
    letterSpacing: 2,
    textShadowColor: 'rgba(255, 255, 255, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  loginModalContainer: {
    width: width * 0.85,
    aspectRatio: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    position: 'relative',
  },
  loginModalImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  formOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: '8%',
    paddingTop: '3%',
  },
  modalBanner: {
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '3%',
    marginTop: '-7%',
  },
  tabTextActive: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 18,
    color: '#5C4033',
    fontWeight: '900',
  },
  slidingTextContainer: {
    width: 120,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  absoluteText: {
    position: 'absolute',
  },
  swipeHint: {
    fontSize: 8,
    color: 'rgba(139, 115, 85, 0.5)',
    marginTop: 8,
  },
  usernameWrapper: {
    position: 'absolute',
    top: '22%',
    left: 0,
    right: 0,
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  usernameInput: {
    width: '65%',
    maxWidth: 180,
  },
  passwordWrapper: {
    position: 'absolute',
    top: '37%',
    left: 0,
    right: 0,
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordInput: {
    width: '65%',
    maxWidth: 180,
  },
  modalInput: {
    fontSize: 12,
    fontFamily: 'PressStart2P_400Regular',
    color: '#5C4033',
    fontWeight: '900',
    width: '100%',
    textAlign: 'center',
  },
  signinWrapper: {
    position: 'absolute',
    top: '54%',
    left: '12%',
    right: '12%',
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#5C4033',
    letterSpacing: 1,
  },
  forgotPasswordBtn: {
    position: 'absolute',
    top: '69%',
    left: '12%',
    right: '12%',
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 12,
    color: '#8B7355',
    fontWeight: '500',
  },
  socialSection: {
    position: 'absolute',
    top: '78%',
    left: '12%',
    right: '12%',
    bottom: '5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialTitle: {
    fontSize: 11,
    color: '#8B7355',
    marginBottom: 12,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 2,
  },
  socialBtn: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  socialIcon: {
    width: 60,
    height: 72,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(245, 222, 179, 0.4)',
    letterSpacing: 1,
  },
});
