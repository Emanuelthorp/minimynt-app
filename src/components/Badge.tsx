import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing, FontSize, FontWeight } from '../constants/tokens';

interface Props {
  label: string;
  color: string;
  textColor?: string;
}

const Badge: React.FC<Props> = ({
  label,
  color,
  textColor = Colors.text,
}) => {
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
});

export default Badge;
