import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import {
  Colors,
  FontSize,
  FontWeight,
  FontFamily,
  Spacing,
  Radius,
  LineHeight,
  Elevation,
} from '../constants/tokens';
import PiggyLogo from './PiggyLogo';

interface Props {
  amount: number;
  label?: string;
  sublabel?: string;
  badge?: string;
  style?: ViewStyle;
}

/**
 * Clean, neutral earnings summary card.
 * Green accent on the amount only — no gradient background.
 */
const EarningsHero: React.FC<Props> = ({
  amount,
  label = 'Tjent totalt',
  sublabel,
  badge,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.topRow}>
        <PiggyLogo size={32} color={Colors.brand} />
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.amount}>{amount} kr</Text>
      <Text style={styles.label}>{label}</Text>
      {sublabel ? (
        <Text style={styles.sublabel}>{sublabel}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    ...Elevation.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  badge: {
    backgroundColor: Colors.brandSurface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.borderBrand,
  },
  badgeText: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.semibold,
    fontWeight: FontWeight.semibold,
    color: Colors.brandDeep,
  },
  amount: {
    fontSize: FontSize.mega,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    color: Colors.brand,
    lineHeight: LineHeight.mega,
  },
  label: {
    fontSize: FontSize.label,
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
    lineHeight: LineHeight.normal,
    marginTop: 2,
  },
  sublabel: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.regular,
    color: Colors.textTertiary,
    lineHeight: LineHeight.tight,
    marginTop: 2,
  },
});

export default EarningsHero;
