import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, Platform } from 'react-native';
import { Colors, Radius, Spacing, FontSize, FontWeight } from '../constants/tokens';

interface Props {
  label?: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

const WEB_BASE: any = Platform.OS === 'web' ? {
  cursor: 'pointer',
  transition: 'background 0.3s ease, transform 0.15s ease, box-shadow 0.15s ease',
  userSelect: 'none',
  outline: 'none',
} : {};

const WEB_HOVERED: any = Platform.OS === 'web' ? {
  background: 'linear-gradient(135deg, #FF5B24 0%, #FF7A45 100%)',
  transform: 'translateY(-1px)',
  boxShadow: '0 6px 20px rgba(255,91,36,0.35)',
} : {};

const VippsButton: React.FC<Props> = ({
  label = 'Betal med Vipps',
  onPress,
  disabled = false,
  style,
}) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      // @ts-ignore — web-only pointer events
      onPointerEnter={() => setHovered(true)}
      // @ts-ignore — web-only pointer events
      onPointerLeave={() => setHovered(false)}
      style={[
        styles.button,
        disabled && styles.disabled,
        style,
        // @ts-ignore — web-only CSS props
        WEB_BASE,
        // @ts-ignore — web-only CSS props
        hovered && !disabled ? WEB_HOVERED : null,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.vippsOrange,
    borderRadius: Radius.lg,
    paddingVertical: 12,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: Colors.textInverse,
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
  },
});

export default VippsButton;
