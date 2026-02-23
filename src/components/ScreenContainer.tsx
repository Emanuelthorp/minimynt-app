import React from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { Colors, Layout, Spacing } from '../constants/tokens';

interface Props {
  children: React.ReactNode;
  bg?: string;
  style?: ViewStyle;
  scroll?: boolean;
}

const ScreenContainer: React.FC<Props> = ({
  children,
  bg = Colors.bgSecondary,
  style,
  scroll = true,
}) => {
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
      {scroll ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.content, style]}>
            {children}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.noScrollOuter}>
          <View style={[styles.content, style]}>
            {children}
          </View>
        </View>
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
  scrollContent: {
    flexGrow: 1,
    alignItems: 'stretch',
  },
  noScrollOuter: {
    flex: 1,
    alignItems: 'stretch',
  },
  content: {
    padding: Layout.screenPadding,
    paddingBottom: Layout.screenPaddingBottom,
    maxWidth: Layout.appMaxWidth,
    width: '100%',
    alignSelf: 'center',
  },
});

export default ScreenContainer;
