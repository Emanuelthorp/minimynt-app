import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, ViewStyle } from 'react-native';
import { Radius, Colors } from '../constants/tokens';

interface SkeletonBlockProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const SkeletonBlock: React.FC<SkeletonBlockProps> = ({
  width = '100%',
  height = 16,
  borderRadius = Radius.sm,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.block,
        { height, borderRadius, backgroundColor: Colors.borderDefault, opacity },
        typeof width === 'number' ? { width } : { width: width as any },
        style,
      ]}
    />
  );
};

interface SkeletonCardProps {
  rows?: number;
  style?: ViewStyle;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ rows = 2, style }) => {
  return (
    <View style={[styles.card, style]}>
      <SkeletonBlock height={14} width="60%" style={styles.row} />
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonBlock
          key={i}
          height={12}
          width={i === rows - 1 ? '40%' : '85%'}
          style={styles.row}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  block: {},
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: 16,
    marginBottom: 8,
  },
  row: {
    marginTop: 8,
  },
});
