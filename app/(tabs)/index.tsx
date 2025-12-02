import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <ImageBackground
      source={require('@/assets/images/basic/main_bg_2.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Image
          source={require('@/assets/images/basic/dragon.png')}
          style={styles.dragon}
          resizeMode="contain"
        />

        {/* Buttons Group */}
        <View style={styles.buttonsGroup}>
          {/* Start Focus Quest Button */}
          <ImageBackground
            source={require('@/assets/images/basic/start_button_1.png')}
            style={styles.startButton1Container}
            resizeMode="contain"
          >
            <Text style={styles.startButton1Text}>START FOCUS QUEST</Text>
          </ImageBackground>

          {/* Blood Oath Button */}
          <ImageBackground
            source={require('@/assets/images/basic/start_button_2.png')}
            style={styles.startButton2Container}
            resizeMode="contain"
          >
            <Text style={styles.startButton2Text}>BLOOD OATH</Text>
          </ImageBackground>
        </View>

        {/* Navigator */}
        <Image
          source={require('@/assets/images/basic/navigator.png')}
          style={styles.navigator}
          resizeMode="stretch"
        />
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
  dragon: {
    width: 300,
    height: 300,
    position: 'absolute',
    top: '30%',
    alignSelf: 'center',
  },
  buttonsGroup: {
    position: 'absolute',
    bottom: '14%',  // 百分比定位，所有设备相同位置
    alignSelf: 'center',
    alignItems: 'center',
  },
  startButton1Container: {
    width: 380,
    height: 180,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -100,
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
  navigator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '12%',  // 百分比高度，所有设备相同比例
  },
});
