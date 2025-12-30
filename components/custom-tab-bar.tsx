import { Href, router } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type TabBarProps = {
  currentTab: 'home' | 'focus' | 'profile';
};

export function CustomTabBar({ currentTab }: TabBarProps) {
  const isHome = currentTab === 'home';
  const isFocus = currentTab === 'focus';
  const isProfile = currentTab === 'profile';

  return (
    <>
      {/* Navigator Background */}
      <Image
        source={require('@/assets/images/basic/navigator.png')}
        style={styles.navigatorBg}
        resizeMode="stretch"
      />
      
      {/* Navigation Icons */}
      <View style={styles.navIconsContainer}>
        <TouchableOpacity 
          style={styles.navIconButton}
          onPress={() => !isHome && router.replace('/(tabs)' as Href)}
        >
          <Text style={[styles.navIcon, isHome && styles.navIconActive]}>🏠</Text>
          <Text style={[styles.navLabel, isHome && styles.navLabelActive]}>HOME</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navIconButtonCenter}
          onPress={() => !isFocus && router.replace('/(tabs)/focus' as Href)}
        >
          <Text style={[styles.navIconCenter, isFocus && styles.navIconActive]}>🍅</Text>
          <Text style={[styles.navLabel, isFocus && styles.navLabelActive]}>FOCUS</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navIconButton}
          onPress={() => !isProfile && router.replace('/(tabs)/profile' as Href)}
        >
          <Text style={[styles.navIcon, isProfile && styles.navIconActive]}>👤</Text>
          <Text style={[styles.navLabel, isProfile && styles.navLabelActive]}>PROFILE</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  navigatorBg: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '12%',
    zIndex: 5,
  },
  navIconsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '12%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  navIconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    flex: 1,
  },
  navIconButtonCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    flex: 1,
    marginTop: -20,
  },
  navIcon: {
    fontSize: 22,
    opacity: 0.5,
  },
  navIconCenter: {
    fontSize: 32,
    opacity: 0.8,
  },
  navIconActive: {
    opacity: 1,
  },
  navLabel: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 6,
    color: '#888',
    marginTop: 2,
  },
  navLabelActive: {
    color: '#FFD700',
  },
});
