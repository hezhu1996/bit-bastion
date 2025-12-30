import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { FocusProvider } from '@/contexts/focus-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FocusProvider>
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
            <Stack.Screen 
              name="focus" 
              options={{ 
                presentation: 'transparentModal',
                animation: 'slide_from_bottom',
                animationDuration: 400,
                // 设置不透明底色，避免系统默认的黑色底
                contentStyle: { backgroundColor: '#1a1a2e' },
              }} 
            />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </FocusProvider>
    </GestureHandlerRootView>
  );
}
