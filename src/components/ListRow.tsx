import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle, Platform } from 'react-native';
import { Colors, Spacing, FontSize, FontWeight, FontFamily, Layout, LineHeight } from '../constants/tokens';

interface Props {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  showDivider?: boolean;
  style?: ViewStyle;
}

const ListRow: React.FC<Props> = ({
  title,
  subtitle,
  right,
  onPress,
  showDivider = true,
  style,
}) => {
  const [hovered, setHovered] = React.useState(false);

  const content = (
    <View
      style={[
        styles.row,
        hovered && Platform.OS === 'web' && styles.webHovered,
        style,
      ]}
    >
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? (
          <Text style={styles.subtitle}>{subtitle}</Text>
        ) : null}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );

  return (
    <>
      {onPress ? (
        <Pressable
          onPress={onPress}
          // @ts-ignore — web-only
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          style={Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined}
        >
          {content}
        </Pressable>
      ) : (
        content
      )}
      {showDivider && <View style={styles.divider} />}
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingVertical: Layout.listRowVertical,
  },
  textContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  title: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
    fontFamily: FontFamily.medium,
    color: Colors.textPrimary,
    lineHeight: LineHeight.normal,
  },
  subtitle: {
    fontSize: FontSize.label,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    lineHeight: LineHeight.tight,
    marginTop: 2,
  },
  right: {
    flexShrink: 0,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderSubtle,
  },
  webPressable: {},
  webHovered: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
  },
});

export default ListRow;
