import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Colors, Radius, Spacing, FontSize, FontWeight } from '../constants/tokens';

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
  const getBackgroundColor = (): string => {
    if (variant === 'primary') return accentColor ?? Colors.adultAccent;
    if (variant === 'danger') return Colors.danger;
    return 'transparent';
  };

  const getBorderColor = (): string | undefined => {
    if (variant === 'secondary') return Colors.border;
    return undefined;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'secondary' ? 1 : 0,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: Radius.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
});

export default Button;
