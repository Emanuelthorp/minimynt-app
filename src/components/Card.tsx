import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle, Platform } from 'react-native';
import { Colors, Radius, Elevation, Layout } from '../constants/tokens';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  elevation?: 'none' | 'sm' | 'md';
  variant?: 'default' | 'outlined';
}

const WEB_PRESSABLE: any = Platform.OS === 'web' ? {
  cursor: 'pointer',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease, opacity 0.15s ease',
  outline: 'none',
} : {};

const WEB_HOVERED: any = Platform.OS === 'web' ? {
  opacity: 0.97,
  // 3D tilt: slight perspective rotation + lift
  transform: 'perspective(800px) rotateX(1deg) rotateY(-1deg) translateY(-2px)',
  boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
} : {};

const Card: React.FC<Props> = ({ children, style, onPress, elevation = 'md', variant = 'default' }) => {
  const [hovered, setHovered] = React.useState(false);

  const isOutlined = variant === 'outlined';

  const elevationStyle = isOutlined
    ? Elevation.none
    : elevation === 'none' ? Elevation.none
    : elevation === 'sm'   ? Elevation.sm
    :                        Elevation.md;

  const cardStyle = [
    styles.card,
    elevationStyle,
    isOutlined && styles.outlined,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        // @ts-ignore — web-only
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        style={[
          cardStyle,
          WEB_PRESSABLE,
          hovered ? WEB_HOVERED : null,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Layout.cardPadding,
    marginBottom: Layout.cardGap,
  },
  outlined: {
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
});

export default Card;
