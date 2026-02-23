import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Platform,
  ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import Svg, { Circle, Ellipse } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {
  Colors,
  Spacing,
  Radius,
  FontSize,
  FontWeight,
  FontFamily,
  LineHeight,
  Elevation,
} from '../../constants/tokens';
import { AuthStackParamList } from '../../navigation/RootNavigator';
import PiggyLogo from '../../components/PiggyLogo';

type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'Landing'>;
};

// ─── Inject web CSS once ────────────────────────────────────────────────────

let cssInjected = false;
function injectRevealCSS() {
  if (Platform.OS !== 'web' || cssInjected) return;
  cssInjected = true;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .reveal-hidden {
      opacity: 0;
    }
    .reveal-visible {
      animation: fadeSlideUp 0.55s ease forwards;
    }
  `;
  document.head.appendChild(style);
}

// ─── RevealOnScroll ─────────────────────────────────────────────────────────

function RevealOnScroll({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<View>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    injectRevealCSS();

    // Access the underlying DOM element via the ref
    const node = ref.current as unknown as Element | null;
    if (!node) return;

    // @ts-ignore — web-only CSS class manipulation
    node.classList.add('reveal-hidden');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // @ts-ignore
            entry.target.classList.remove('reveal-hidden');
            // @ts-ignore
            entry.target.classList.add('reveal-visible');
            // @ts-ignore
            entry.target.style.animationDelay = `${delay}ms`;
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delay]);

  return <View ref={ref}>{children}</View>;
}

// ─── Floating background shape (Reanimated) ─────────────────────────────────

function FloatingShape({
  style,
  duration,
  translateXRange,
  translateYRange,
  children,
}: {
  style: ViewStyle;
  duration: number;
  translateXRange: number;
  translateYRange: number;
  children: React.ReactNode;
}) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);

  useEffect(() => {
    tx.value = withRepeat(
      withTiming(translateXRange, { duration, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    ty.value = withRepeat(
      withTiming(translateYRange, {
        duration: duration * 1.3,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
  }, [duration, translateXRange, translateYRange, tx, ty]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }],
  }));

  return (
    <Animated.View
      style={[{ position: 'absolute' }, style, animStyle]}
      // @ts-ignore — web-only pointer events
      pointerEvents="none"
    >
      {children}
    </Animated.View>
  );
}

// ─── Hero Background Shapes ─────────────────────────────────────────────────

function HeroBackgroundShapes() {
  return (
    <>
      {/* Large teal circle — top right */}
      <FloatingShape
        style={{ top: -60, right: -80 }}
        duration={4000}
        translateXRange={6}
        translateYRange={4}
      >
        <Svg width={280} height={280} viewBox="0 0 280 280">
          <Circle cx={140} cy={140} r={140} fill={Colors.brand} fillOpacity={0.08} />
        </Svg>
      </FloatingShape>

      {/* Medium lighter circle — bottom left */}
      <FloatingShape
        style={{ bottom: -40, left: -60 }}
        duration={6000}
        translateXRange={-6}
        translateYRange={4}
      >
        <Svg width={200} height={200} viewBox="0 0 200 200">
          <Circle cx={100} cy={100} r={100} fill={Colors.brandLight} fillOpacity={0.06} />
        </Svg>
      </FloatingShape>

      {/* Small circle — center-ish */}
      <FloatingShape
        style={{ top: '40%', left: '30%' }}
        duration={8000}
        translateXRange={6}
        translateYRange={-4}
      >
        <Svg width={120} height={120} viewBox="0 0 120 120">
          <Ellipse cx={60} cy={60} rx={60} ry={50} fill={Colors.textInverse} fillOpacity={0.05} />
        </Svg>
      </FloatingShape>
    </>
  );
}

// ─── Animated PiggyLogo (bob) ────────────────────────────────────────────────

function AnimatedPiggy({
  size,
  color,
  animate,
}: {
  size: number;
  color: string;
  animate?: boolean;
}) {
  const ty = useSharedValue(0);

  useEffect(() => {
    if (!animate) return;
    ty.value = withRepeat(
      withTiming(-6, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [animate, ty]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: animate ? ty.value : 0 }],
  }));

  return (
    <Animated.View style={animStyle}>
      <PiggyLogo size={size} color={color} />
    </Animated.View>
  );
}

// ─── Check item sub-component ─────────────────────────────────────────────────

function CheckItem({
  label,
  iconColor,
}: {
  label: string;
  iconColor: string;
}) {
  return (
    <View style={checkStyles.row}>
      <Feather name="check" size={14} color={iconColor} />
      <Text style={checkStyles.label}>{label}</Text>
    </View>
  );
}

const checkStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  label: {
    fontSize: FontSize.label,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    lineHeight: LineHeight.normal,
  },
});

// ─── CTA Button ───────────────────────────────────────────────────────────────

function CtaButton({
  label,
  onPress,
}: {
  label: string;
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
        ctaStyles.button,
        hovered && Platform.OS === 'web' && ctaStyles.buttonHovered,
      ]}
    >
      <Text style={ctaStyles.text}>{label}</Text>
    </Pressable>
  );
}

const ctaStyles = StyleSheet.create({
  button: {
    backgroundColor: Colors.brand,
    borderRadius: Radius.lg,
    height: 56,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    justifyContent: 'center',
    ...Elevation.md,
  } as any,
  buttonHovered: {
    opacity: 0.88,
  },
  text: {
    fontSize: 17,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
    color: Colors.textInverse,
    lineHeight: LineHeight.normal,
  },
});

// ─── Main component ───────────────────────────────────────────────────────────

export default function LandingScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── HERO ── */}
        <View style={styles.hero}>
          {/* Floating background shapes */}
          <HeroBackgroundShapes />

          <AnimatedPiggy size={72} color="rgba(255,255,255,0.9)" animate={true} />

          <Text style={styles.heroHeadline}>
            {'Arbeid. Godkjenning.\nEkte penger.'}
          </Text>

          <Text style={styles.heroSubline}>
            {'Barn gjør oppgaver. Du godkjenner.\nVipps betaler — ekte, ikke virtuelt.'}
          </Text>

          <View style={styles.ctaWrapper}>
            <CtaButton
              label="Kom i gang →"
              onPress={() => navigation.navigate('RoleSelect')}
            />
          </View>

          <Text style={styles.heroNote}>
            Ingen abonnement · 0,5 % av utbetalinger
          </Text>
        </View>

        {/* ── HOW IT WORKS ── */}
        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>Slik fungerer det</Text>
          <Text style={styles.sectionTitle}>Tre enkle steg</Text>

          {/* Step 1 */}
          <RevealOnScroll delay={0}>
            <View style={styles.stepRow}>
              <View style={[styles.stepCircle, styles.stepCircleNavy]}>
                <Text style={styles.stepNumber}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Forelder oppretter oppgave</Text>
                <Text style={styles.stepDesc}>Sett beløp, tittel og beskrivelse</Text>
              </View>
            </View>
          </RevealOnScroll>

          <View style={styles.stepConnector} />

          {/* Step 2 */}
          <RevealOnScroll delay={150}>
            <View style={styles.stepRow}>
              <View style={[styles.stepCircle, styles.stepCircleNavy]}>
                <Text style={styles.stepNumber}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Barn gjør og melder ferdig</Text>
                <Text style={styles.stepDesc}>Enkelt trykk når jobben er gjort</Text>
              </View>
            </View>
          </RevealOnScroll>

          <View style={styles.stepConnector} />

          {/* Step 3 */}
          <RevealOnScroll delay={300}>
            <View style={styles.stepRow}>
              <View style={[styles.stepCircle, styles.stepCircleGreen]}>
                <Text style={styles.stepNumber}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Vipps sender pengene</Text>
                <Text style={styles.stepDesc}>Forelder godkjenner og Vipps betaler</Text>
              </View>
            </View>
          </RevealOnScroll>
        </View>

        {/* ── FEATURES ── */}
        <View style={[styles.section, styles.sectionSurface]}>
          <View style={styles.featuresRow}>
            {/* Card — For barn */}
            <View style={[styles.featureCard, styles.featureCardChild, Elevation.md as any]}>
              <Text style={[styles.featureCardTitle, { color: Colors.brand }]}>
                For barn
              </Text>
              <CheckItem label="Tydelig beløp" iconColor={Colors.brand} />
              <CheckItem label="Egne oppgaver" iconColor={Colors.brand} />
              <CheckItem label="Vipps-betaling" iconColor={Colors.brand} />
            </View>

            {/* Card — For foreldre */}
            <View style={[styles.featureCard, styles.featureCardParent, Elevation.md as any]}>
              <Text style={[styles.featureCardTitle, { color: Colors.adultPrimary }]}>
                For foreldre
              </Text>
              <CheckItem label="Full kontroll" iconColor={Colors.adultPrimary} />
              <CheckItem label="Godkjenning i appen" iconColor={Colors.adultPrimary} />
              <CheckItem label="Familievisning" iconColor={Colors.adultPrimary} />
            </View>
          </View>

          {/* Bottom CTA */}
          <View style={styles.featuresCta}>
            <Text style={styles.featuresCtaHint}>Klar til å starte?</Text>
            <CtaButton
              label="Registrer familien"
              onPress={() => navigation.navigate('RoleSelect')}
            />
          </View>
        </View>

        {/* ── FOOTER ── */}
        <View style={styles.footer}>
          {/* Teal gradient line at top — CSS gradient on web, solid teal on native */}
          <View
            style={[
              styles.footerGradientLine,
              Platform.OS === 'web' && ({
                backgroundImage: `linear-gradient(to right, ${Colors.brand}, transparent)`,
                backgroundColor: 'transparent',
                opacity: 1,
              } as any),
            ]}
          />

          <View style={styles.footerInner}>
            <View style={styles.footerBrandRow}>
              <PiggyLogo size={18} color={Colors.textTertiary} />
              <Text style={styles.footerBrandText}>MiniMynt v1.0.0</Text>
            </View>
            <Text style={styles.footerLegal}>
              MiniMynt er en prototype. Ikke tilknyttet Vipps AS.
            </Text>
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

  // ── Hero ──────────────────────────────────────────────────────────────────
  hero: {
    backgroundColor: Colors.adultPrimary,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
    overflow: 'hidden',
  },
  heroHeadline: {
    fontSize: 30,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
    color: Colors.textInverse,
    textAlign: 'center',
    lineHeight: 38,
    marginTop: 20,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  heroSubline: {
    fontSize: FontSize.body,
    fontFamily: FontFamily.regular,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
    marginBottom: Spacing.xl,
  },
  ctaWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  heroNote: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.regular,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    marginTop: Spacing.md,
  },

  // ── Sections ──────────────────────────────────────────────────────────────
  section: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: 40,
    backgroundColor: Colors.bgPrimary,
  },
  sectionSurface: {
    backgroundColor: Colors.bgSurface,
  },
  sectionEyebrow: {
    fontSize: FontSize.label,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.semibold,
    color: Colors.brand,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.title,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    marginBottom: 28,
  },

  // ── Steps ─────────────────────────────────────────────────────────────────
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepCircleNavy: {
    backgroundColor: Colors.adultPrimary,
  },
  stepCircleGreen: {
    backgroundColor: Colors.brand,
  },
  stepNumber: {
    fontSize: FontSize.label,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
    color: Colors.textInverse,
  },
  stepContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  stepTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.semibold,
    color: Colors.textPrimary,
  },
  stepDesc: {
    fontSize: FontSize.label,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: 2,
  },
  stepConnector: {
    borderLeftWidth: 2,
    borderLeftColor: Colors.borderSubtle,
    borderStyle: 'dashed',
    marginLeft: 15,
    height: 20,
  },

  // ── Features ──────────────────────────────────────────────────────────────
  featuresRow: {
    flexDirection: 'row',
    gap: 12,
  },
  featureCard: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    // Clip the top border
    overflow: 'hidden',
  },
  featureCardChild: {
    borderTopWidth: 3,
    borderTopColor: Colors.brand,
  },
  featureCardParent: {
    borderTopWidth: 3,
    borderTopColor: Colors.adultPrimary,
  },
  featureCardTitle: {
    fontSize: FontSize.heading,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
  },
  featuresCta: {
    marginTop: 28,
    alignItems: 'center',
  },
  featuresCtaHint: {
    fontSize: FontSize.body,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    backgroundColor: Colors.bgPrimary,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  footerGradientLine: {
    height: 1,
    // Web gets a gradient via inline style; native gets a solid teal line
    backgroundColor: Colors.brand,
    opacity: 0.35,
  } as any,
  footerInner: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
  },
  footerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  footerBrandText: {
    fontSize: FontSize.label,
    fontFamily: FontFamily.regular,
    color: Colors.textTertiary,
    marginLeft: 6,
  },
  footerLegal: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.regular,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
});
