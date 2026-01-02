import { MedievalSharp_400Regular, useFonts as useMedievalSharp } from '@expo-google-fonts/medievalsharp';
import { PressStart2P_400Regular, useFonts as usePressStart } from '@expo-google-fonts/press-start-2p';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { FocusProvider } from '@/contexts/focus-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [pressStartLoaded] = usePressStart({
    PressStart2P_400Regular,
  });

  const [medievalLoaded] = useMedievalSharp({
    MedievalSharp_400Regular,
  });

  useEffect(() => {
    if (pressStartLoaded && medievalLoaded) {
      SplashScreen.hideAsync();
    }
  }, [pressStartLoaded, medievalLoaded]);

  if (!pressStartLoaded || !medievalLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FocusProvider>
        <BottomSheetModalProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack 
              screenOptions={{ 
                headerShown: false,
                contentStyle: { backgroundColor: '#1a1a2e' },
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </BottomSheetModalProvider>
      </FocusProvider>
    </GestureHandlerRootView>
  );
}
