import React from 'react';
import { TextInput, Text, View, StyleSheet, TextInputProps, ViewStyle, Platform } from 'react-native';
import { Colors, Radius, Spacing, FontSize, FontWeight, FontFamily, LineHeight } from '../constants/tokens';

interface Props extends TextInputProps {
  label?: string;
  accentColor?: string;
  containerStyle?: ViewStyle;
}

const Input: React.FC<Props> = ({
  label,
  accentColor = Colors.adultPrimary,
  containerStyle,
  style,
  ...rest
}) => {
  const [focused, setFocused] = React.useState(false);

  return (
    <View style={containerStyle}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[
          styles.input,
          focused && { borderColor: accentColor, borderWidth: 2 },
          Platform.OS === 'web' && ({ outline: 'none', transition: 'border-color 0.15s ease' } as any),
          style,
        ]}
        placeholderTextColor={Colors.textTertiary}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: FontSize.label,
    fontWeight: FontWeight.medium,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
    lineHeight: LineHeight.tight,
    marginBottom: Spacing.xs,
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: Colors.borderDefault,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.body,
    fontFamily: FontFamily.regular,
    color: Colors.textPrimary,
    backgroundColor: Colors.bgPrimary,
  },
  webInput: {} as any,
});

export default Input;
