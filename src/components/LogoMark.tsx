import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius } from '../constants/tokens';

interface Props {
  size?: number;
  bgColor?: string;
  textColor?: string;
}

/**
 * MiniMynt brand logo mark.
 * A geometric pig-inspired circular mark: green background with a
 * stylized 'M' letterform + two ear circles at top.
 * Replaces all 🐷 emoji usages for consistent branding.
 */
const LogoMark: React.FC<Props> = ({
  size = 44,
  bgColor = Colors.brand,
  textColor = '#fff',
}) => {
  const earSize = Math.round(size * 0.22);
  const earOffset = Math.round(size * 0.06);
  const earTopOffset = -Math.round(size * 0.08);

  return (
    <View style={{ width: size, height: size }}>
      {/* Left ear */}
      <View
        style={[
          styles.ear,
          {
            width: earSize,
            height: earSize,
            borderRadius: earSize / 2,
            backgroundColor: bgColor,
            top: earTopOffset,
            left: earOffset,
          },
        ]}
      />
      {/* Right ear */}
      <View
        style={[
          styles.ear,
          {
            width: earSize,
            height: earSize,
            borderRadius: earSize / 2,
            backgroundColor: bgColor,
            top: earTopOffset,
            right: earOffset,
          },
        ]}
      />
      {/* Main circle */}
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: bgColor,
          },
        ]}
      >
        <Text
          style={[
            styles.mark,
            {
              color: textColor,
              fontSize: Math.round(size * 0.42),
              lineHeight: Math.round(size * 0.52),
            },
          ]}
        >
          M
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ear: {
    position: 'absolute',
    zIndex: 0,
  },
  circle: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  mark: {
    fontWeight: '700',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

export default LogoMark;
