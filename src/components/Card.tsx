import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Radius, Spacing } from '../constants/tokens';

interface Props {
  children: React.ReactNode;
  bg: string;
  style?: ViewStyle;
  onPress?: () => void;
}

const Card: React.FC<Props> = ({ children, bg, style, onPress }) => {
  const cardStyle = [styles.card, { backgroundColor: bg }, style];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
});

export default Card;
