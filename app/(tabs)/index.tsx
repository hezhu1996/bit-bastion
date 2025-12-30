import { CustomTabBar } from '@/components/custom-tab-bar';
import { ScrollPicker } from '@/components/scroll-picker';
import { useFocusDuration } from '@/contexts/focus-context';
import { Href, router } from 'expo-router';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MINUTE_OPTIONS = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

export default function HomeScreen() {
  const { focusDuration, setFocusDuration } = useFocusDuration();

  const handleStartFocus = () => {
    router.replace('/(tabs)/focus' as Href);
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
});
