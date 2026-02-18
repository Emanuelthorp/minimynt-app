import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Spacing } from '../constants/tokens';

interface Props {
  children: React.ReactNode;
  bg: string;
  style?: ViewStyle;
  scroll?: boolean;
}

const ScreenContainer: React.FC<Props> = ({
  children,
  bg,
  style,
  scroll = true,
}) => {
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
      {scroll ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, style]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, style]}>{children}</View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
  },
});

export default ScreenContainer;
