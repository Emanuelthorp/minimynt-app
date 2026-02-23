// A simple toast notification that slides in from top and auto-dismisses
// Used for: "Oppgave godkjent ✓", "Oppgave avvist", "Betaling registrert ✓" etc.

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, FontFamily, Radius, Spacing, Elevation, LineHeight } from '../constants/tokens';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  visible: boolean;
  onHide: () => void;
}

const TYPE_CONFIG: Record<ToastType, { bg: string; text: string; icon: 'check' | 'x' | 'info' }> = {
  success: { bg: Colors.brandSurface, text: Colors.brand, icon: 'check' },
  error:   { bg: '#FEF2F2',           text: Colors.statusDanger, icon: 'x' },
  info:    { bg: Colors.adultSurface, text: Colors.adultPrimary, icon: 'info' },
};

export default function Toast({ message, type, visible, onHide }: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      onHide();
    }, 2500);
    return () => clearTimeout(timer);
  }, [visible, onHide]);

  if (!visible) return null;

  const config = TYPE_CONFIG[type];

  return (
    <Animated.View
      entering={FadeInDown.duration(250)}
      exiting={FadeOutUp.duration(200)}
      style={[styles.pill, { backgroundColor: config.bg }, Elevation.md]}
    >
      <Feather name={config.icon} size={14} color={config.text} />
      <Text style={[styles.label, { color: config.text }]}>{message}</Text>
    </Animated.View>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const show = (message: string, type: ToastType = 'success') => setToast({ message, type });
  const hide = () => setToast(null);
  return { toast, show, hide };
}

const styles = StyleSheet.create({
  pill: {
    position: 'absolute',
    top: 52,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: Radius.full,
    zIndex: 999,
  },
  label: {
    fontSize: FontSize.label,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.semibold,
    lineHeight: LineHeight.tight,
  },
});
