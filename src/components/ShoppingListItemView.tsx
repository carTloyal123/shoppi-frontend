import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue,
  withSpring,
  runOnJS
} from 'react-native-reanimated';
import { 
  Gesture,
  GestureDetector 
} from 'react-native-gesture-handler';
import { useTheme } from '../theme/useTheme';

interface ShoppingListItemViewProps {
  name: string;
  type: 'Amazon' | 'Other';
  onDelete?: () => void;
}

export const ShoppingListItemView: React.FC<ShoppingListItemViewProps> = ({ 
  name, 
  type, 
  onDelete 
}) => {
  const { colors } = useTheme();
  const translateX = useSharedValue(0);
  const deleteThreshold = -100;

  const panGesture = Gesture.Pan()
    .onChange((event) => {
      translateX.value = Math.max(event.translationX, deleteThreshold);
    })
    .onEnd(() => {
      if (translateX.value < deleteThreshold / 2) {
        translateX.value = withSpring(deleteThreshold);
        onDelete && runOnJS(onDelete)();
      } else {
        translateX.value = withSpring(0);
      }
    });

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const deleteStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value - deleteThreshold }],
  }));

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.deleteAction, deleteStyle]}>
        <Text style={styles.deleteText}>Delete</Text>
      </Animated.View>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.container, { backgroundColor: colors.listItemBackground }, rStyle]}>
          <View style={styles.content}>
            <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
            <Text style={[styles.name, { color: colors.text }]}>{type}</Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  container: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 2,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteAction: {
    position: 'absolute',
    right: 0,
    height: '100%',
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    borderRadius: 12,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  }
});
