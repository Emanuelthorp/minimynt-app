import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import {
  Colors, FontSize, FontWeight, FontFamily,
  Spacing, Layout, LineHeight, Radius, Elevation,
} from '../../constants/tokens';
import { useAppContext } from '../../store/AppContext';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import ProgressBar from '../../components/ProgressBar';

export default function WaitingScreen() {
  const { state } = useAppContext();
  const childPhone = state.childPhone ?? '';

  const myTasks = state.tasks.filter((t) => t.takenBy === childPhone);

  const ferdigTasks   = myTasks.filter((t) => t.status === 'Ferdig');
  const godkjentTasks = myTasks.filter((t) => t.status === 'Godkjent');
  const betaltTasks   = myTasks.filter((t) => t.status === 'Betalt');

  const totalPending  = ferdigTasks.reduce((s, t) => s + t.reward, 0);
  const totalApproved = godkjentTasks.reduce((s, t) => s + t.reward, 0);
  const totalPaid     = betaltTasks.reduce((s, t) => s + t.reward, 0);
  const grandTotal    = totalPending + totalApproved + totalPaid;

  const hasAnyTasks = ferdigTasks.length > 0 || godkjentTasks.length > 0 || betaltTasks.length > 0;

  const paidProgress = grandTotal > 0 ? (totalPaid / grandTotal) * 100 : 0;
  const totalNonLedig = myTasks.filter((t) => t.status !== 'Ledig').length;

  return (
    <ScreenContainer bg={Colors.bgPrimary}>
      <ScreenHeader title="Betalingsstatus" />

      {hasAnyTasks ? (
        <>
          {/* Two-column summary card */}
          <Animated.View entering={FadeInDown.duration(300)}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryCol}>
                <Text style={styles.summaryAmount}>{totalApproved + totalPending} kr</Text>
                <Text style={styles.summaryLabel}>Venter</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryCol}>
                <Text style={[styles.summaryAmount, styles.summaryAmountPaid]}>{totalPaid} kr</Text>
                <Text style={styles.summaryLabel}>Utbetalt</Text>
              </View>
            </View>
          </Animated.View>

          {/* Overall payment progress */}
          <Card variant="outlined" style={styles.progressCard}>
            <ProgressBar
              value={paidProgress}
              color={Colors.brand}
              trackColor={Colors.borderDefault}
              label="Utbetalingsgrad"
              sublabel={`${betaltTasks.length} av ${totalNonLedig} oppgaver utbetalt`}
              height={6}
            />
          </Card>

          {/* Venter på godkjenning */}
          {ferdigTasks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Venter på godkjenning</Text>
              {ferdigTasks.map((task, i) => (
                <Animated.View
                  key={task.id}
                  entering={FadeInDown.delay(i * 50).duration(300)}
                >
                  <View style={[styles.taskCard, styles.taskCardPending, Elevation.sm]}>
                    <View style={styles.cardRow}>
                      <View style={styles.taskInfo}>
                        <Text style={styles.taskTitle}>{task.title}</Text>
                        <Text style={styles.reward}>{task.reward} kr</Text>
                      </View>
                      <StatusBadge status={task.status} />
                    </View>
                  </View>
                </Animated.View>
              ))}
            </View>
          )}

          {/* Godkjent — venter Vipps */}
          {godkjentTasks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Godkjent — venter på Vipps</Text>
              <View style={styles.approvedNote}>
                <Feather name="clock" size={13} color={Colors.statusWarning} />
                <Text style={styles.approvedNoteText}>Venter på Vipps-betaling</Text>
              </View>
              {godkjentTasks.map((task, i) => (
                <Animated.View
                  key={task.id}
                  entering={FadeInDown.delay(i * 50).duration(300)}
                >
                  <View style={[styles.taskCard, styles.taskCardApproved, Elevation.sm]}>
                    <View style={styles.cardRow}>
                      <View style={styles.taskInfo}>
                        <Text style={styles.taskTitle}>{task.title}</Text>
                        <Text style={[styles.reward, styles.rewardBrand]}>{task.reward} kr</Text>
                      </View>
                      <StatusBadge status={task.status} />
                    </View>
                  </View>
                </Animated.View>
              ))}
            </View>
          )}

          {/* Betalt */}
          {betaltTasks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Betalt</Text>
              <View style={styles.paidCelebration}>
                <Feather name="check-circle" size={15} color={Colors.brand} />
                <Text style={styles.paidCelebrationText}>Betalt! 🎉</Text>
              </View>
              {betaltTasks.map((task, i) => (
                <Animated.View
                  key={task.id}
                  entering={FadeInDown.delay(i * 40).duration(300)}
                >
                  <View style={[styles.taskCard, styles.taskCardPaid]}>
                    <View style={[styles.cardRow, styles.cardRowDim]}>
                      <View style={styles.taskInfo}>
                        <Text style={styles.taskTitle}>{task.title}</Text>
                        <Text style={styles.reward}>{task.reward} kr</Text>
                      </View>
                      <StatusBadge status={task.status} />
                    </View>
                  </View>
                </Animated.View>
              ))}
            </View>
          )}
        </>
      ) : (
        <Card>
          <EmptyState
            icon="clock"
            title="Ingen oppgaver til behandling"
            subtitle="Fullfør en oppgave — forelder godkjenner og du får penger på Vipps."
            accentColor={Colors.brand}
          />
        </Card>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Layout.cardGap,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    ...Elevation.md,
  },
  summaryCol: {
    flex: 1,
    alignItems: 'center',
  },
  summaryAmount: {
    fontSize: FontSize.title,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
    lineHeight: LineHeight.loose,
  },
  summaryAmountPaid: {
    color: Colors.brand,
  },
  summaryLabel: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.regular,
    color: Colors.textTertiary,
    lineHeight: LineHeight.tight,
    marginTop: 1,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.borderDefault,
    alignSelf: 'center',
    marginHorizontal: Spacing.md,
  },
  progressCard: {
    marginBottom: Layout.cardGap,
  },
  section: {
    marginTop: Layout.sectionGap,
    marginBottom: Spacing.xs,
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
  taskCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    overflow: 'hidden',
  },
  taskCardPending: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.statusWarning,
  },
  taskCardApproved: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.brand,
  },
  taskCardPaid: {
    // no elevation, opacity handled by cardRowDim
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardRowDim: {
    opacity: 0.5,
  },
  taskInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  taskTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.semibold,
    color: Colors.textPrimary,
    lineHeight: LineHeight.normal,
    marginBottom: Spacing.xs,
  },
  reward: {
    fontSize: FontSize.label,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
    color: Colors.textSecondary,
    lineHeight: LineHeight.tight,
  },
  rewardBrand: {
    color: Colors.brand,
  },
  approvedNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: Spacing.sm,
  },
  approvedNoteText: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.medium,
    fontFamily: FontFamily.medium,
    color: Colors.statusWarning,
    lineHeight: LineHeight.tight,
  },
  paidCelebration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: Spacing.sm,
  },
  paidCelebrationText: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.semibold,
    color: Colors.brand,
    lineHeight: LineHeight.tight,
  },
});
