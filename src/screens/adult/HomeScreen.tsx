import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Colors,
  FontSize,
  FontWeight,
  FontFamily,
  Spacing,
  Radius,
  LineHeight,
  StatusColor,
  Elevation,
  Layout,
} from '../../constants/tokens';
import { useAppContext } from '../../store/AppContext';
import { TaskStatus } from '../../store/types';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import PiggyLogo from '../../components/PiggyLogo';
import { SkeletonBlock } from '../../components/SkeletonLoader';

const STATUS_ROWS: { status: TaskStatus; label: string; icon: string }[] = [
  { status: 'Ledig',    label: 'Ledige oppgaver',           icon: 'circle' },
  { status: 'Tatt',     label: 'Pågående',                  icon: 'clock' },
  { status: 'Ferdig',   label: 'Venter på godkjenning',     icon: 'alert-circle' },
  { status: 'Godkjent', label: 'Godkjent',                  icon: 'check-circle' },
  { status: 'Betalt',   label: 'Utbetalt',                  icon: 'dollar-sign' },
];

function HomeScreenSkeleton() {
  return (
    <View>
      {/* Header row */}
      <SkeletonBlock width="60%" height={24} style={styles.skeletonHeader} />
      {/* Hero card */}
      <SkeletonBlock width="100%" height={120} borderRadius={16} style={styles.skeletonHero} />
      {/* 3 status rows */}
      <SkeletonBlock width="100%" height={52} style={styles.skeletonRow} />
      <SkeletonBlock width="100%" height={52} style={styles.skeletonRow} />
      <SkeletonBlock width="100%" height={52} style={styles.skeletonRow} />
    </View>
  );
}

export default function HomeScreen() {
  const { state, isLoading } = useAppContext();
  const { ledger, tasks, adultPhone } = state;

  // Keep skeleton visible for at least 800ms
  const [showSkeleton, setShowSkeleton] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setShowSkeleton(true);
    } else {
      const timer = setTimeout(() => setShowSkeleton(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (showSkeleton) {
    return (
      <ScreenContainer bg={Colors.bgPrimary}>
        <HomeScreenSkeleton />
      </ScreenContainer>
    );
  }

  const countByStatus = (status: TaskStatus): number =>
    tasks.filter((t) => t.status === status).length;

  const pendingApproval = countByStatus('Ferdig');
  const hasAnyTasks = tasks.length > 0;

  return (
    <ScreenContainer bg={Colors.bgPrimary}>
      {/* ── Header ── */}
      <Animated.View entering={FadeInDown.duration(300)} style={styles.header}>
        <View>
          <Text style={styles.greeting}>God dag</Text>
          <Text style={styles.phone}>{adultPhone ?? ''}</Text>
        </View>
        <PiggyLogo size={38} color={Colors.adultPrimary} />
      </Animated.View>

      {/* ── Navy hero card ── */}
      <Animated.View entering={FadeInDown.delay(50).duration(300)}>
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Utbetalt denne måneden</Text>
          <Text style={styles.heroAmount}>{ledger.paidOutThisMonth} kr</Text>
          {pendingApproval > 0 && (
            <View style={styles.alertChip}>
              <Text style={styles.alertChipText}>
                ⚠ {pendingApproval} oppgave{pendingApproval !== 1 ? 'r' : ''} venter på godkjenning
              </Text>
            </View>
          )}
        </View>
      </Animated.View>

      {/* ── Section label ── */}
      <Text style={styles.sectionTitle}>Oppgavestatus</Text>

      {/* ── Status list ── */}
      {hasAnyTasks ? (
        <Animated.View entering={FadeInDown.delay(100).duration(300)}>
          <Card elevation="md">
            {STATUS_ROWS.map(({ status, label, icon }, index) => {
              const count = countByStatus(status);
              const color = StatusColor[status];
              return (
                <View
                  key={status}
                  style={[
                    styles.statusRow,
                    index < STATUS_ROWS.length - 1 && styles.statusRowDivider,
                  ]}
                >
                  <View style={styles.statusLeft}>
                    <View style={[styles.iconWrap, { backgroundColor: `${color}14` }]}>
                      <Feather name={icon as any} size={14} color={color} />
                    </View>
                    <Text style={styles.statusLabel}>{label}</Text>
                  </View>
                  <Text
                    style={[
                      styles.statusCount,
                      count > 0 ? { color } : { color: Colors.textTertiary },
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              );
            })}
          </Card>
        </Animated.View>
      ) : (
        <Card elevation="md">
          <EmptyState
            icon="clipboard"
            title="Ingen oppgaver ennå"
            subtitle="Gå til Oppgaver-fanen for å opprette din første oppgave."
            accentColor={Colors.adultPrimary}
          />
        </Card>
      )}

      {/* ── Stats strip ── */}
      {hasAnyTasks && (
        <Animated.View entering={FadeInDown.delay(150).duration(300)} style={styles.statsRow}>
          <View style={styles.statTile}>
            <Text style={styles.statValue}>{tasks.length}</Text>
            <Text style={styles.statLabel}>Totalt</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statTile}>
            <Text style={[styles.statValue, { color: Colors.statusWarning }]}>
              {pendingApproval}
            </Text>
            <Text style={styles.statLabel}>Venter</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statTile}>
            <Text style={[styles.statValue, { color: Colors.brand }]}>
              {countByStatus('Betalt')}
            </Text>
            <Text style={styles.statLabel}>Betalt</Text>
          </View>
        </Animated.View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  skeletonHeader: {
    marginBottom: Layout.sectionGap,
  },
  skeletonHero: {
    marginBottom: Layout.sectionGap,
  },
  skeletonRow: {
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Layout.sectionGap,
  },
  greeting: {
    fontSize: FontSize.title,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    lineHeight: LineHeight.loose,
  },
  phone: {
    fontSize: FontSize.label,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    lineHeight: LineHeight.normal,
  },
  heroCard: {
    backgroundColor: Colors.adultPrimary,
    borderRadius: Radius.lg,
    padding: Layout.screenPadding,
    marginBottom: Layout.sectionGap,
    ...Elevation.md,
  },
  heroLabel: {
    fontSize: FontSize.label,
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight.medium,
    color: 'rgba(255,255,255,0.70)',
    lineHeight: LineHeight.normal,
    letterSpacing: 0.3,
    marginBottom: Spacing.xs,
  },
  heroAmount: {
    fontSize: FontSize.display,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    color: Colors.textInverse,
    lineHeight: LineHeight.hero,
  },
  alertChip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  alertChipText: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.semibold,
    fontWeight: FontWeight.semibold,
    color: 'rgba(255,255,255,0.90)',
    lineHeight: LineHeight.tight,
  },
  sectionTitle: {
    fontSize: FontSize.label,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.semibold,
    color: Colors.textSecondary,
    letterSpacing: 0.3,
    lineHeight: LineHeight.tight,
    marginBottom: Spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm + 2,
    minHeight: Layout.listRowMinHeight,
  },
  statusRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusLabel: {
    fontSize: FontSize.body,
    fontFamily: FontFamily.regular,
    color: Colors.textPrimary,
    lineHeight: LineHeight.normal,
  },
  statusCount: {
    fontSize: FontSize.heading,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
    lineHeight: LineHeight.loose,
    minWidth: 28,
    textAlign: 'right',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    marginTop: Layout.cardGap,
    paddingVertical: Layout.cardPadding,
    ...Elevation.sm,
  },
  statTile: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.borderDefault,
  },
  statValue: {
    fontSize: FontSize.title,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    lineHeight: LineHeight.loose,
  },
  statLabel: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    lineHeight: LineHeight.tight,
    marginTop: 1,
  },
});
