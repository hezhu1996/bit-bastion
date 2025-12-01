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
import Animated, { FadeInUp } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D4A84B" />
      </View>
    );
  }

  const handleLogin = async () => {
    if (!username || !password) return;
    
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <ImageBackground
      source={require('@/assets/images/basic/bg.png')}
      style={styles.background}
      resizeMode="cover"
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
              source={require('@/assets/images/basic/bg_title.png')}
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
            source={require('@/assets/images/basic/login_modal.png')}
            style={styles.loginModalImage}
            resizeMode="contain"
          />
          
          {/* Form Overlay */}
          <View style={styles.formOverlay}>
            {/* Top Banner - Login/Signup Toggle */}
            <View style={styles.modalBanner}>
              <View style={styles.tabContainer}>
                <TouchableOpacity 
                  style={[styles.tabBtn, isLogin && styles.tabBtnActive]}
                  onPress={() => setIsLogin(true)}
                >
                  <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>Login</Text>
                </TouchableOpacity>
                <Text style={styles.tabDivider}>|</Text>
                <TouchableOpacity 
                  style={[styles.tabBtn, !isLogin && styles.tabBtnActive]}
                  onPress={() => setIsLogin(false)}
                >
                  <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>Signup</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Username Input */}
            <View style={styles.usernameWrapper}>
              <TextInput
                style={styles.modalInput}
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
                style={styles.modalInput}
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
                <TouchableOpacity style={styles.socialBtn}>
                  <Text style={styles.socialBtnText}>G</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn}>
                  <Text style={styles.socialBtnText}>f</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn}>
                  <Text style={styles.socialBtnText}>X</Text>
                </TouchableOpacity>
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
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '3%',
  },
  modalBannerText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#5C4033',
    letterSpacing: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tabBtn: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  tabBtnActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#5C4033',
  },
  tabText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#8B7355',
  },
  tabTextActive: {
    color: '#5C4033',
  },
  tabDivider: {
    fontSize: 14,
    color: '#8B7355',
    marginHorizontal: 4,
  },
  usernameWrapper: {
    position: 'absolute',
    top: '22%',
    left: '15%',
    right: '15%',
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordWrapper: {
    position: 'absolute',
    top: '37%',
    left: '15%',
    right: '15%',
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
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
    top: '80%',
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
    gap: 16,
  },
  socialBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(92, 64, 51, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(92, 64, 51, 0.3)',
  },
  socialBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5C4033',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(245, 222, 179, 0.8)',
    marginTop: 8,
    letterSpacing: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212, 168, 75, 0.3)',
  },
  card: {
    width: '100%',
  },
  cardInner: {
    padding: 32,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#D4A84B',
  },
  cornerTopLeft: {
    top: 12,
    left: 12,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  cornerTopRight: {
    top: 12,
    right: 12,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  cornerBottomLeft: {
    bottom: 12,
    left: 12,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  cornerBottomRight: {
    bottom: 12,
    right: 12,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F5DEB3',
    textAlign: 'center',
    marginBottom: 28,
    letterSpacing: 2,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    color: 'rgba(245, 222, 179, 0.7)',
    marginBottom: 8,
    letterSpacing: 1,
  },
  inputWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 168, 75, 0.2)',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#F5DEB3',
  },
  buttonWrapper: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#D4A84B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  button: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    letterSpacing: 2,
  },
  forgotButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  forgotText: {
    fontSize: 14,
    color: 'rgba(245, 222, 179, 0.6)',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(212, 168, 75, 0.2)',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 13,
    color: 'rgba(245, 222, 179, 0.5)',
  },
  registerButton: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 168, 75, 0.4)',
    backgroundColor: 'rgba(212, 168, 75, 0.1)',
  },
  registerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D4A84B',
    letterSpacing: 1,
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

