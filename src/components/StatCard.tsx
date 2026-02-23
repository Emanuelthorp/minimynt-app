import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, FontFamily, Spacing, Radius, LineHeight, Elevation } from '../constants/tokens';

interface Props {
  label: string;
  value: string | number;
  icon: keyof typeof Feather.glyphMap;
  accent?: string;
  trend?: 'up' | 'down' | 'neutral';
  style?: ViewStyle;
}

const StatCard: React.FC<Props> = ({
  label,
  value,
  icon,
  accent = Colors.brand,
  trend,
  style,
}) => {
  return (
    <View style={[styles.card, style]}>
      <View style={[styles.iconWrap, { backgroundColor: `${accent}18` }]}>
        <Feather name={icon} size={16} color={accent} />
      </View>
      <Text style={[styles.value, { color: accent }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {trend ? (
        <View style={styles.trendRow}>
          <Feather
            name={trend === 'up' ? 'trending-up' : trend === 'down' ? 'trending-down' : 'minus'}
            size={11}
            color={trend === 'up' ? Colors.statusSuccess : trend === 'down' ? Colors.statusDanger : Colors.textTertiary}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    alignItems: 'flex-start',
    ...Elevation.sm,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  value: {
    fontSize: FontSize.title,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    lineHeight: LineHeight.loose,
  },
  label: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    lineHeight: LineHeight.tight,
    marginTop: 2,
  },
  trendRow: {
    marginTop: Spacing.xs,
  },
});

export default StatCard;
