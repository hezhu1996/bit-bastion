import { Images } from '@/assets/images/basic';
import { supabase } from '@/lib/supabase';
import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const itemHeight = 40;
  const translateY = useSharedValue(0);
  const context = useSharedValue(0);
  
  // 监听滚动位置，更新 JS 端的 isLogin 状态
  useDerivedValue(() => {
    const index = Math.round(-translateY.value / itemHeight);
    const currentModeIndex = Math.abs(index % 2); // 0 或 1
    runOnJS(setIsLogin)(currentModeIndex === 0);
  });

  // 检查用户是否已登录
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/(tabs)');
      }
    };
    checkSession();

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.replace('/(tabs)');
      } else if (event === 'SIGNED_OUT') {
        // 用户登出，保持在登录页
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAuth = async () => {
    console.log('handleAuth called, isLogin:', isLogin, 'email:', email);
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Login
        console.log('Attempting login...');
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        console.log('Login result:', { user: data?.user?.email, error: signInError?.message });

        if (signInError) {
          setError(signInError.message);
          setIsLoading(false);
          return;
        }

        if (data.user && data.session) {
          console.log('Login successful, navigating to tabs...');
          router.replace('/(tabs)');
        } else {
          setError('Login failed - no user data');
          setIsLoading(false);
        }
      } else {
        // Signup
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          setError(signUpError.message);
          setIsLoading(false);
          return;
        }

        if (data.user) {
          Alert.alert(
            'Success!',
            'Account created! Please check your email to verify your account.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setIsLogin(true);
                  setEmail('');
                  setPassword('');
                },
              },
            ]
          );
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'bitbastion://reset-password',
      });

      if (resetError) {
        setError(resetError.message);
        return;
      }

      Alert.alert(
        'Email Sent',
        'Check your email for password reset instructions.',
        [{ text: 'OK' }]
      );
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    }
  };

  // 处理 OAuth 回调
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      try {
        console.log('Deep link received:', event.url);
        
        // 处理 Supabase OAuth 回调格式
        // URL 格式可能是: bitbastion://#access_token=xxx&refresh_token=yyy
        // 或者: bitbastion://?access_token=xxx&refresh_token=yyy
        
        let accessToken: string | null = null;
        let refreshToken: string | null = null;
        
        // 尝试解析 hash 格式
        const hashMatch = event.url.match(/[#&]access_token=([^&]+)/);
        const refreshMatch = event.url.match(/[#&]refresh_token=([^&]+)/);
        
        if (hashMatch && refreshMatch) {
          accessToken = decodeURIComponent(hashMatch[1]);
          refreshToken = decodeURIComponent(refreshMatch[1]);
        } else {
          // 尝试解析 query 格式
          try {
            const url = new URL(event.url);
            accessToken = url.searchParams.get('access_token');
            refreshToken = url.searchParams.get('refresh_token');
          } catch (e) {
            // URL 解析失败，尝试手动解析
            const params = new URLSearchParams(event.url.split('?')[1] || event.url.split('#')[1] || '');
            accessToken = params.get('access_token');
            refreshToken = params.get('refresh_token');
          }
        }

        if (accessToken && refreshToken) {
          console.log('Setting session with tokens');
          setIsLoading(true);
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (!error && data.session) {
            console.log('Session set successfully, redirecting...');
            router.replace('/(tabs)');
          } else {
            console.error('Session error:', error);
            setError(error?.message || 'Failed to set session');
          }
          setIsLoading(false);
        } else {
          console.log('No tokens found in URL');
        }
      } catch (err: any) {
        console.error('Deep link error:', err);
        setError(err.message || 'Failed to process OAuth callback');
        setIsLoading(false);
      }
    };

    // 监听深度链接
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // 检查应用是否从深度链接启动
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 使用 app scheme 作为重定向 URL
      const redirectUrl = 'bitbastion://';
      
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (oauthError) {
        setError(oauthError.message);
        setIsLoading(false);
        return;
      }

      if (data?.url) {
        // 使用 openAuthSessionAsync 处理 OAuth 回调
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl,
        );

        console.log('OAuth result:', result.type);

        if (result.type === 'success' && result.url) {
          console.log('OAuth callback URL:', result.url);
          // 从返回的 URL 中解析 token
          await handleOAuthCallback(result.url);
        } else if (result.type === 'cancel') {
          setError('Google login cancelled');
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Google login failed');
      setIsLoading(false);
    }
  };

  // 处理 OAuth 回调 URL
  const handleOAuthCallback = async (url: string) => {
    try {
      console.log('Processing OAuth callback:', url);
      
      let accessToken: string | null = null;
      let refreshToken: string | null = null;
      
      // 尝试解析 hash 格式 (bitbastion://#access_token=xxx&refresh_token=yyy)
      const hashMatch = url.match(/[#&]access_token=([^&]+)/);
      const refreshMatch = url.match(/[#&]refresh_token=([^&]+)/);
      
      if (hashMatch && refreshMatch) {
        accessToken = decodeURIComponent(hashMatch[1]);
        refreshToken = decodeURIComponent(refreshMatch[1]);
      } else {
        // 尝试解析 query 格式
        try {
          const urlObj = new URL(url);
          accessToken = urlObj.searchParams.get('access_token');
          refreshToken = urlObj.searchParams.get('refresh_token');
          
          // 也检查 hash 部分
          if (!accessToken && urlObj.hash) {
            const hashParams = new URLSearchParams(urlObj.hash.substring(1));
            accessToken = hashParams.get('access_token');
            refreshToken = hashParams.get('refresh_token');
          }
        } catch (e) {
          // URL 解析失败，尝试手动解析
          const hashPart = url.split('#')[1] || '';
          const queryPart = url.split('?')[1] || '';
          const params = new URLSearchParams(hashPart || queryPart);
          accessToken = params.get('access_token');
          refreshToken = params.get('refresh_token');
        }
      }

      console.log('Tokens found:', { hasAccess: !!accessToken, hasRefresh: !!refreshToken });

      if (accessToken && refreshToken) {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (!error && data.session) {
          console.log('Session set successfully!');
          router.replace('/(tabs)');
        } else {
          console.error('Session error:', error);
          setError(error?.message || 'Failed to set session');
        }
      } else {
        setError('No authentication tokens received');
      }
    } catch (err: any) {
      console.error('OAuth callback error:', err);
      setError(err.message || 'Failed to process authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const redirectUrl = 'bitbastion://';

      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (oauthError) {
        setError(oauthError.message);
        setIsLoading(false);
        return;
      }

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl,
        );

        if (result.type === 'success' && result.url) {
          await handleOAuthCallback(result.url);
        } else if (result.type === 'cancel') {
          setError('Apple login cancelled');
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Apple login failed');
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const redirectUrl = 'bitbastion://';

      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (oauthError) {
        setError(oauthError.message);
        setIsLoading(false);
        return;
      }

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl,
        );

        if (result.type === 'success' && result.url) {
          await handleOAuthCallback(result.url);
        } else if (result.type === 'cancel') {
          setError('Facebook login cancelled');
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Facebook login failed');
      setIsLoading(false);
    }
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

            {/* Email Input */}
            <View style={styles.usernameWrapper}>
              <TextInput
                style={[styles.modalInput, styles.usernameInput]}
                placeholder="Email"
                placeholderTextColor="#8B7355"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError(null);
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
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
              onPress={() => {
                console.log('Button pressed!');
                handleAuth();
              }}
              disabled={isLoading}
              activeOpacity={0.6}
            >
              <View style={styles.signinButton}>
                <Text style={styles.modalButtonText}>
                  {isLoading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Forgot Password */}
            {isLogin && (
              <TouchableOpacity 
                style={styles.forgotPasswordBtn}
                onPress={handleForgotPassword}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            {/* Social Login Section */}
            <View style={styles.socialSection}>
              <Text style={styles.socialTitle}>Or continue with</Text>
              <View style={styles.socialButtons}>
                <SocialButton
                  source={Images.appleIcon}
                  onPress={handleAppleLogin}
                />
                <SocialButton
                  source={Images.googleIcon}
                  onPress={handleGoogleLogin}
                />
                <SocialButton
                  source={Images.facebookIcon}
                  onPress={handleFacebookLogin}
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

        {/* Error Message - Screen Bottom */}
        {error && (
          <View style={styles.errorContainer}>
            {/* Inner decorative border */}
            <View style={styles.errorInnerBorder} />
            {/* Skull/Warning icon */}
            <Text style={styles.errorIcon}>⚔️ ⚠️ ⚔️</Text>
            <Text style={styles.errorText}>{error}</Text>
            {/* Dismiss button */}
            <TouchableOpacity 
              style={styles.errorDismiss}
              onPress={() => setError(null)}
              activeOpacity={0.7}
            >
              <Text style={styles.errorDismissText}>DISMISS</Text>
            </TouchableOpacity>
          </View>
        )}
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
    zIndex: 10,
  },
  signinButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
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
  errorContainer: {
    position: 'absolute',
    bottom: 60,
    left: 16,
    right: 16,
    alignItems: 'center',
    // 羊皮纸背景
    backgroundColor: '#2A1810',
    paddingVertical: 16,
    paddingHorizontal: 20,
    // 多层边框模拟中世纪卷轴
    borderWidth: 3,
    borderColor: '#8B6914',
    borderRadius: 4,
    // 内阴影效果
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 1000,
  },
  errorInnerBorder: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    borderWidth: 1,
    borderColor: '#D4A84B',
    borderRadius: 2,
    pointerEvents: 'none',
  },
  errorIcon: {
    fontSize: 16,
    marginBottom: 6,
  },
  errorText: {
    fontSize: 9,
    color: '#E8D5B0',
    fontFamily: 'PressStart2P_400Regular',
    textAlign: 'center',
    lineHeight: 16,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  errorDismiss: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: '#5C3D2E',
    borderWidth: 2,
    borderColor: '#8B6914',
    borderRadius: 3,
  },
  errorDismissText: {
    fontSize: 8,
    color: '#D4A84B',
    fontFamily: 'PressStart2P_400Regular',
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
