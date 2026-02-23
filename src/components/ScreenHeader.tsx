import React from 'react';
import { Text, View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, FontSize, FontWeight, FontFamily, LineHeight, Spacing } from '../constants/tokens';

interface Props {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  style?: ViewStyle;
}

const ScreenHeader: React.FC<Props> = ({ title, subtitle, right, style }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <View style={styles.textBlock}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {right ? <View>{right}</View> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.display,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: FontSize.body,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    lineHeight: LineHeight.normal,
    marginTop: Spacing.xs,
  },
});

export default ScreenHeader;
