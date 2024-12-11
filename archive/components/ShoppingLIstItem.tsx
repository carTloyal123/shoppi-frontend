import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { Feather } from '@expo/vector-icons';

interface ShoppingListItemProps {
  name: string;
  itemCount: number;
  isShared: boolean;
}

export const ShoppingListItem: React.FC<ShoppingListItemProps> = ({ name, itemCount, isShared }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.textContainer}>
        <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
        <Text style={[styles.itemCount, { color: colors.text }]}>{itemCount} items</Text>
      </View>
      {isShared && (
        <Feather name="users" size={20} color={colors.primary} style={styles.sharedIcon} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 14,
  },
  sharedIcon: {
    marginLeft: 8,
  },
});

