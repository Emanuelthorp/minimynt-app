import React, { useRef } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  Animated,
  Platform,
} from 'react-native';
import { Colors, Radius, Spacing, FontSize, FontWeight, FontFamily, Layout } from '../constants/tokens';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  accentColor?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

const Button: React.FC<Props> = ({
  label,
  onPress,
  variant = 'primary',
  accentColor,
  disabled = false,
  style,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  const accent = accentColor ?? Colors.adultPrimary;

  const bgColor =
    variant === 'primary' ? accent :
    variant === 'danger'   ? Colors.statusDanger :
    'transparent';

  const textColor =
    variant === 'secondary' ? accent : Colors.textInverse;

  const borderColor =
    variant === 'secondary' ? accent : undefined;

  function handlePressIn() {
    setPressed(true);
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  }

  function handlePressOut() {
    setPressed(false);
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }

  // Web-only shadow reduction on press
  const webPressedStyle: any = Platform.OS === 'web' && pressed ? {
    boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
  } : {};

  // Web-only elevated shadow + lift on hover
  const webHoveredStyle: any = Platform.OS === 'web' && hovered && !disabled && !pressed ? {
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.14)',
  } : {};

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        // @ts-ignore — web-only pointer events
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => { setHovered(false); setPressed(false); }}
        style={[
          styles.button,
          {
            backgroundColor: bgColor,
            borderColor,
            borderWidth: variant === 'secondary' ? 1.5 : 0,
          },
          disabled && styles.disabled,
          Platform.OS === 'web' && ({
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'transform 0.12s ease, box-shadow 0.15s ease, opacity 0.15s ease',
            userSelect: 'none',
            outline: 'none',
          } as any),
          // @ts-ignore — web-only CSS props
          webHoveredStyle,
          // @ts-ignore — web-only CSS props
          webPressedStyle,
        ]}
      >
        <Text
          style={[
            styles.label,
            { color: textColor },
          ]}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: Radius.lg,
    paddingVertical: Layout.listRowVertical,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  label: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.semibold,
    lineHeight: 22,
  },
  disabled: {
    opacity: 0.45,
  },
});

export default Button;
