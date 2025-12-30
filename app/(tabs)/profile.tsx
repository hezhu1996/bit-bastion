import { CustomTabBar } from '@/components/custom-tab-bar';
import { supabase } from '@/lib/supabase';
import { Href, router } from 'expo-router';
import { Alert, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MOCK_USER = {
  username: 'Dragon Slayer',
  level: 12,
  exp: 2450,
  expToNext: 3000,
  focusTime: '12h 30m',
  tasksDone: 42,
  streak: 7,
  achievements: [
    { id: 1, emoji: '🔥', name: 'First Flame', unlocked: true },
    { id: 2, emoji: '⚔️', name: 'Warrior', unlocked: true },
    { id: 3, emoji: '🏆', name: 'Champion', unlocked: true },
    { id: 4, emoji: '💎', name: 'Diamond', unlocked: false },
    { id: 5, emoji: '👑', name: 'King', unlocked: false },
    { id: 6, emoji: '🌟', name: 'Star', unlocked: false },
  ],
};

export default function ProfileScreen() {
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
            router.replace('/login' as Href);
          },
        },
      ]
    );
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'Settings page coming soon!');
  };

  const expProgress = (MOCK_USER.exp / MOCK_USER.expToNext) * 100;

  return (
    <ImageBackground
      source={require('@/assets/images/basic/main_bg_2.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🎮 PROFILE</Text>
        </View>

        {/* Character Card */}
        <View style={styles.characterCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('@/assets/images/basic/man_basic.png')}
              style={styles.avatar}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>⭐ LEVEL {MOCK_USER.level}</Text>
          </View>
          
          <Text style={styles.username}>{MOCK_USER.username}</Text>
          
          {/* EXP Bar */}
          <View style={styles.expBarContainer}>
            <View style={styles.expBarBg}>
              <View style={[styles.expBarFill, { width: `${expProgress}%` }]} />
            </View>
            <Text style={styles.expText}>{MOCK_USER.exp} / {MOCK_USER.expToNext} XP</Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>📊 STATS</Text>
          
          <View style={styles.statRow}>
            <Text style={styles.statEmoji}>🍅</Text>
            <Text style={styles.statLabel}>FOCUS TIME</Text>
            <Text style={styles.statValue}>{MOCK_USER.focusTime}</Text>
          </View>
          
          <View style={styles.statRow}>
            <Text style={styles.statEmoji}>✅</Text>
            <Text style={styles.statLabel}>TASKS DONE</Text>
            <Text style={styles.statValue}>{MOCK_USER.tasksDone}</Text>
          </View>
          
          <View style={styles.statRow}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statLabel}>STREAK</Text>
            <Text style={styles.statValue}>{MOCK_USER.streak} days</Text>
          </View>
        </View>

        {/* Achievements Section */}
        <View style={styles.achievementsCard}>
          <Text style={styles.sectionTitle}>🏆 ACHIEVEMENTS</Text>
          
          <View style={styles.achievementsGrid}>
            {MOCK_USER.achievements.map((achievement) => (
              <View 
                key={achievement.id} 
                style={[
                  styles.achievementItem,
                  !achievement.unlocked && styles.achievementLocked
                ]}
              >
                <Text style={[
                  styles.achievementEmoji,
                  !achievement.unlocked && styles.achievementEmojiLocked
                ]}>
                  {achievement.emoji}
                </Text>
                <Text style={[
                  styles.achievementName,
                  !achievement.unlocked && styles.achievementNameLocked
                ]}>
                  {achievement.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
            <Text style={styles.settingsButtonText}>⚙️ SETTINGS</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>🚪 LOGOUT</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <CustomTabBar currentTab="profile" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a2e',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    color: '#FFD700',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  characterCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#FFD700',
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderWidth: 3,
    borderColor: '#FFD700',
    overflow: 'hidden',
    marginBottom: 10,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  levelBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },
  levelText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#1a1a2e',
  },
  username: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 15,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  expBarContainer: {
    width: '100%',
    alignItems: 'center',
  },
  expBarBg: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  expBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  expText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#88CCFF',
    marginTop: 5,
  },
  statsCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#4CAF50',
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#FFD700',
    marginBottom: 15,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  statEmoji: {
    fontSize: 20,
    width: 35,
  },
  statLabel: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#AAAAAA',
    flex: 1,
  },
  statValue: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#FFFFFF',
  },
  achievementsCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#9C27B0',
    padding: 15,
    marginBottom: 20,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  achievementItem: {
    width: '30%',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  achievementLocked: {
    opacity: 0.4,
  },
  achievementEmoji: {
    fontSize: 28,
    marginBottom: 5,
  },
  achievementEmojiLocked: {
    opacity: 0.5,
  },
  achievementName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 6,
    color: '#FFD700',
    textAlign: 'center',
  },
  achievementNameLocked: {
    color: '#666666',
  },
  actionsContainer: {
    gap: 10,
  },
  settingsButton: {
    backgroundColor: 'rgba(100, 100, 100, 0.8)',
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#666666',
    alignItems: 'center',
  },
  settingsButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#FFFFFF',
  },
  logoutButton: {
    backgroundColor: 'rgba(139, 0, 0, 0.8)',
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#8B0000',
    alignItems: 'center',
  },
  logoutButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#FFFFFF',
  },
  bottomSpacer: {
    height: 20,
  },
});

