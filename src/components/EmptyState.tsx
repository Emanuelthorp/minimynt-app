import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, FontFamily, Spacing, Layout, LineHeight } from '../constants/tokens';
import Button from './Button';

interface Props {
  icon?: keyof typeof Feather.glyphMap;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  onCta?: () => void;
  accentColor?: string;
  style?: ViewStyle;
}

const EmptyState: React.FC<Props> = ({
  icon = 'inbox',
  title,
  subtitle,
  ctaLabel,
  onCta,
  accentColor = Colors.adultPrimary,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconWrap, { backgroundColor: `${accentColor}12` }]}>
        <Feather name={icon} size={28} color={accentColor} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? (
        <Text style={styles.subtitle}>{subtitle}</Text>
      ) : null}
      {ctaLabel && onCta ? (
        <Button
          label={ctaLabel}
          onPress={onCta}
          accentColor={accentColor}
          style={styles.cta}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Layout.emptyStatePaddingV,
    paddingHorizontal: Spacing.lg,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.semibold,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: LineHeight.loose,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.label,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: LineHeight.normal,
    maxWidth: 280,
  },
  cta: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
});

export default EmptyState;
