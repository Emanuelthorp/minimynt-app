import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { StackNavigationProp } from '@react-navigation/stack';
import PiggyLogo from '../../components/PiggyLogo';
import {
  Colors,
  Spacing,
  Radius,
  FontSize,
  FontWeight,
  FontFamily,
  LineHeight,
  Elevation,
  Layout,
} from '../../constants/tokens';
import { AuthStackParamList } from '../../navigation/RootNavigator';

type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'RoleSelect'>;
};

// ─── Role card sub-component ──────────────────────────────────────────────────

function RoleCard({
  icon,
  title,
  subtitle,
  iconBg,
  iconColor,
  hoverBorderColor,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
  iconBg: string;
  iconColor: string;
  hoverBorderColor: string;
  onPress: () => void;
}) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Pressable
      onPress={onPress}
      // @ts-ignore — web-only pointer events
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      style={[
        styles.roleCard,
        Elevation.md as any,
        hovered && Platform.OS === 'web' && {
          borderColor: hoverBorderColor,
          transform: [{ translateY: -1 }],
        },
      ]}
    >
      {/* Icon circle */}
      <View style={[styles.roleIconCircle, { backgroundColor: iconBg }]}>
        <Feather name={icon} size={22} color={iconColor} />
      </View>

      {/* Text content */}
      <View style={styles.roleTextContent}>
        <Text style={styles.roleTitle}>{title}</Text>
        <Text style={styles.roleSubtitle}>{subtitle}</Text>
      </View>

      {/* Chevron */}
      <Feather name="chevron-right" size={18} color={Colors.textTertiary} />
    </Pressable>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function RoleSelectScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>

          {/* Brand section — FadeInDown from slightly above */}
          <Animated.View
            entering={FadeInDown.delay(0).duration(400)}
            style={styles.brandSection}
          >
            <PiggyLogo size={56} color={Colors.brand} animate={false} />
            <Text style={styles.brandName}>MiniMynt</Text>
            <Text style={styles.brandTagline}>Familiens økonomiverktøy</Text>
          </Animated.View>

          {/* Role label */}
          <Text style={styles.roleLabel}>Hvem logger inn?</Text>

          {/* Role cards with staggered FadeInDown */}
          <View style={styles.cardsStack}>
            <Animated.View entering={FadeInDown.delay(0).duration(300)}>
              <RoleCard
                icon="users"
                title="Forelder"
                subtitle="Administrer oppgaver og godkjenn utbetalinger"
                iconBg={Colors.adultSurface}
                iconColor={Colors.adultPrimary}
                hoverBorderColor={Colors.adultPrimary}
                onPress={() => navigation.navigate('Phone', { role: 'adult' })}
              />
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(80).duration(300)}>
              <RoleCard
                icon="user"
                title="Barn"
                subtitle="Ta oppgaver og tjen penger på Vipps"
                iconBg={Colors.brandSurface}
                iconColor={Colors.brand}
                hoverBorderColor={Colors.brand}
                onPress={() => navigation.navigate('Phone', { role: 'child' })}
              />
            </Animated.View>
          </View>

          {/* Footer note */}
          <View style={styles.footerNote}>
            <Feather name="lock" size={11} color={Colors.textTertiary} />
            <Text style={styles.footerNoteText}>Demo-kode: 1234</Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    maxWidth: Layout.appMaxWidth,
    width: '100%',
    alignSelf: 'center',
  },

  // Brand
  brandSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  brandName: {
    fontSize: FontSize.display,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: Spacing.xs,
  },
  brandTagline: {
    fontSize: FontSize.body,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },

  // Role label
  roleLabel: {
    fontSize: FontSize.label,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.semibold,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },

  // Cards
  cardsStack: {
    gap: 12,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: 20,
    borderWidth: 1.5,
    borderColor: Colors.borderDefault,
  },
  roleIconCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  roleTextContent: {
    flex: 1,
    marginLeft: 14,
  },
  roleTitle: {
    fontSize: FontSize.heading,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.semibold,
    color: Colors.textPrimary,
  },
  roleSubtitle: {
    fontSize: FontSize.label,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 3,
  },

  // Footer note
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: Spacing.xl,
  },
  footerNoteText: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.regular,
    color: Colors.textTertiary,
  },
});
