import { useEffect, useRef } from 'react';
import { Animated, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, View } from 'react-native';

type ScrollPickerProps = {
  values: number[];
  selectedValue: number;
  onValueChange: (value: number) => void;
  itemHeight?: number;
  visibleItems?: number;
};

export function ScrollPicker({
  values,
  selectedValue,
  onValueChange,
  itemHeight = 50,
  visibleItems = 3,
}: ScrollPickerProps) {
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const containerHeight = itemHeight * visibleItems;
  const paddingVertical = (containerHeight - itemHeight) / 2;

  useEffect(() => {
    const index = values.indexOf(selectedValue);
    if (index !== -1 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: index * itemHeight,
          animated: false,
        });
      }, 100);
    }
  }, []);

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / itemHeight);
    const clampedIndex = Math.max(0, Math.min(index, values.length - 1));
    const newValue = values[clampedIndex];
    
    if (newValue !== selectedValue) {
      onValueChange(newValue);
    }
  };

  return (
    <View style={[styles.container, { height: containerHeight }]}>
      {/* Selection indicator */}
      <View style={[styles.selectionIndicator, { 
        top: paddingVertical, 
        height: itemHeight 
      }]} />
      
      <Animated.ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        contentContainerStyle={{ paddingVertical }}
      >
        {values.map((value, index) => {
          const inputRange = [
            (index - 2) * itemHeight,
            (index - 1) * itemHeight,
            index * itemHeight,
            (index + 1) * itemHeight,
            (index + 2) * itemHeight,
          ];
          
          const opacity = scrollY.interpolate({
            inputRange,
            outputRange: [0.2, 0.5, 1, 0.5, 0.2],
            extrapolate: 'clamp',
          });
          
          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [0.7, 0.85, 1, 0.85, 0.7],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={value}
              style={[
                styles.item,
                { height: itemHeight, opacity, transform: [{ scale }] },
              ]}
            >
              <Text style={styles.itemText}>{value}</Text>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 110,
    overflow: 'visible',
  },
  selectionIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1,
    pointerEvents: 'none',
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 32,
    color: '#FFD700',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    transform: [{ scaleY: 1.2 }],
  },
});

