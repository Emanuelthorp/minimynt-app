import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing, FontSize, FontWeight, FontFamily } from '../constants/tokens';

interface Props {
  label: string;
  color: string;
  textColor?: string;
  size?: 'sm' | 'md';
}

const Badge: React.FC<Props> = ({
  label,
  color,
  textColor,
  size = 'sm',
}) => {
  const isSmall = size === 'sm';
  const resolvedTextColor = textColor ?? Colors.textInverse;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: color,
          paddingHorizontal: isSmall ? Spacing.sm : Spacing.md,
          paddingVertical: isSmall ? Spacing.xs : Spacing.xs + 2,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: resolvedTextColor,
            fontSize: isSmall ? FontSize.caption : FontSize.label,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.semibold,
  },
});

export default Badge;
