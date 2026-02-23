import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, ViewStyle } from 'react-native';
import { Colors, FontSize, FontWeight, FontFamily, Radius, Spacing, LineHeight } from '../constants/tokens';

interface Props {
  value: number;          // 0-100
  color?: string;
  trackColor?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
  sublabel?: string;
  style?: ViewStyle;
  animate?: boolean;
}

const ProgressBar: React.FC<Props> = ({
  value,
  color = Colors.brand,
  trackColor = Colors.borderDefault,
  height = 6,
  showLabel = true,
  label,
  sublabel,
  style,
  animate = true,
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  const width = useRef(new Animated.Value(animate ? 0 : clampedValue)).current;

  useEffect(() => {
    if (animate) {
      Animated.timing(width, {
        toValue: clampedValue,
        duration: 800,
        delay: 100,
        useNativeDriver: false,
      }).start();
    } else {
      width.setValue(clampedValue);
    }
  }, [clampedValue, animate]);

  const interpolatedWidth = width.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={style}>
      {(label || showLabel) && (
        <View style={styles.labelRow}>
          {label ? (
            <Text style={styles.label}>{label}</Text>
          ) : null}
          <Text style={[styles.percent, { color }]}>{Math.round(clampedValue)}%</Text>
        </View>
      )}
      <View style={[styles.track, { height, backgroundColor: trackColor, borderRadius: height }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: interpolatedWidth,
              height,
              backgroundColor: color,
              borderRadius: height,
            },
          ]}
        />
      </View>
      {sublabel ? (
        <Text style={styles.sublabel}>{sublabel}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: FontSize.label,
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
    lineHeight: LineHeight.tight,
  },
  percent: {
    fontSize: FontSize.label,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    lineHeight: LineHeight.tight,
  },
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  sublabel: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.regular,
    color: Colors.textTertiary,
    lineHeight: LineHeight.tight,
    marginTop: 4,
  },
});

export default ProgressBar;
