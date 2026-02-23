import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, Platform, Linking, Alert } from 'react-native';
import { Colors, Radius, Spacing, FontSize, FontWeight } from '../constants/tokens';

interface Props {
  label?: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  // Vipps deeplink props
  phone?: string;
  amount?: number;
  onPaymentInitiated?: () => void;
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
  phone,
  amount,
  onPaymentInitiated,
}) => {
  const [hovered, setHovered] = React.useState(false);

  async function handlePress() {
    if (phone && amount !== undefined) {
      const amountInOre = Math.round(amount * 100);
      const vippsUrl = `vipps://payment?phone=${phone}&amount=${amountInOre}&message=MiniMynt%20oppgaver`;

      if (Platform.OS === 'web') {
        // On web, show instructions (desktop can't open Vipps app)
        Alert.alert(
          'Vipps-betaling',
          `Åpne Vipps på din mobil og send ${amount} kr til ${phone}.\n\nTrykk "Bekreftet betalt" når betalingen er gjennomført.`,
          [{ text: 'OK' }]
        );
        setTimeout(() => onPaymentInitiated?.(), 500);
        return;
      }

      // Check if Vipps is installed
      const canOpen = await Linking.canOpenURL(vippsUrl).catch(() => false);
      if (!canOpen) {
        Alert.alert(
          'Vipps ikke installert',
          `Åpne Vipps-appen og send ${amount} kr til ${phone}`,
          [{ text: 'OK' }]
        );
        return;
      }

      try {
        await Linking.openURL(vippsUrl);
      } catch {
        // Silently ignore — Vipps was opened or failed to open
      }
      setTimeout(() => onPaymentInitiated?.(), 500);
      return;
    }

    // Fallback to manual onPress if no deeplink props provided
    onPress?.();
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
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
