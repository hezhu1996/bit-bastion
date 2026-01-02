import MagicTimer from '@/app/util/MagicGlowingText';
import { CustomTabBar } from '@/components/custom-tab-bar';
import { ScrollPicker } from '@/components/scroll-picker';
import { useFocusDuration } from '@/contexts/focus-context';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Asset } from 'expo-asset';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MINUTE_OPTIONS = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

export default function HomeScreen() {
  const { focusDuration, setFocusDuration } = useFocusDuration();
  const [timeRemaining, setTimeRemaining] = useState(focusDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['100%'], []);

  useEffect(() => {
    Asset.fromModule(require('@/assets/images/focus/focus-bg-2.png')).downloadAsync().catch(() => {});
  }, []);

  const handleStartFocus = useCallback(() => {
    console.log('Start Focus clicked!');
    const initialSeconds = focusDuration * 60;
    setTimeRemaining(initialSeconds);
    setIsActive(true);
    bottomSheetModalRef.current?.present();
  }, [focusDuration]);

  // 计时逻辑
  useEffect(() => {
    let interval: any = null;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeRemaining === 0) {
      setIsActive(false);
      bottomSheetModalRef.current?.dismiss();
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

  const handleGiveUp = useCallback(() => {
    setIsActive(false);
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const handleSheetChange = useCallback((index: number) => {
    console.log('Sheet index changed to:', index);
    if (index === -1) {
      setIsActive(false);
    }
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.7}
        pressBehavior="none"
      />
    ),
    []
  );

  const renderBackground = useCallback(
    (props: any) => (
      <ImageBackground
        source={require('@/assets/images/focus/focus-bg-2.png')}
        style={[props.style, styles.sheetBackgroundImage]}
        resizeMode="cover"
      />
    ),
    []
  );

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
          <TouchableOpacity
            onPress={() => console.log('Blood Oath clicked!')}
            activeOpacity={0.8}
          >
            <ImageBackground
              source={require('@/assets/images/basic/start_button_2.png')}
              style={styles.startButton2Container}
              resizeMode="contain"
            >
              <Text style={styles.startButton2Text}>BLOOD OATH</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        <CustomTabBar currentTab="home" />
      </View>

      {/* Bottom Sheet Modal */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
        enablePanDownToClose={false}
        enableDynamicSizing={false}
        enableHandlePanningGesture={false}
        enableContentPanningGesture={false}
        backdropComponent={renderBackdrop}
        backgroundComponent={renderBackground}
        handleIndicatorStyle={styles.sheetHandle}
      >
        <BottomSheetView style={styles.sheetContent}>
          <View style={styles.focusContent}>
            <MagicTimer timeInSeconds={timeRemaining} fontSize={100} />

            <TouchableOpacity
              style={styles.stopButton}
              onPress={handleGiveUp}
              activeOpacity={0.7}
            >
              <Text style={styles.stopButtonText}>GIVE UP</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
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
    marginBottom: -57,
  },
  startButton1Container: {
    width: 380,
    height: 100,
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
  // Bottom Sheet styles
  sheetHandle: {
    backgroundColor: '#FFD700',
    width: 80,
  },
  sheetBackgroundImage: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#0a0f14',
  },
  sheetContent: {
    flex: 1,
  },
  focusContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100
  },
  focusTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 18,
    color: '#E74C3C',
    marginBottom: 40,
  },
  focusTimerText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 32,
    color: '#E74C3C',
  },
  focusTimerSubtext: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#7F8C8D',
    marginTop: 20,
  },
  stopButton: {
    marginTop: 50,
    paddingVertical: 16,
    paddingHorizontal: 48,
    backgroundColor: '#E74C3C',
    borderRadius: 30,
    shadowColor: '#E74C3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  stopButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
