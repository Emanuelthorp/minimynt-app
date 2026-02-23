import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import Toast, { useToast } from '../../components/Toast';
import {
  Colors,
  FontSize,
  FontWeight,
  FontFamily,
  Radius,
  Spacing,
  Elevation,
  Layout,
  LineHeight,
} from '../../constants/tokens';
import { useAppContext } from '../../store/AppContext';
import { Child, Task } from '../../store/types';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import Button from '../../components/Button';
import VippsButton from '../../components/VippsButton';
import ListRow from '../../components/ListRow';
import EmptyState from '../../components/EmptyState';

interface VippsTarget {
  child: Child;
  tasks: Task[];
  total: number;
}

// ── Animated pulsing Vipps logo for Step 2 ──────────────────────────────────
function VippsPulse() {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 600 }),
        withTiming(1.0, { duration: 600 })
      ),
      -1,
      false
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.vippsPulseCircle, animStyle]}>
      <Text style={styles.vippsPulseText}>Vipps</Text>
    </Animated.View>
  );
}

export default function ApprovalScreen() {
  const { state, dispatch } = useAppContext();
  const { tasks, children } = state;

  const [vippsTarget, setVippsTarget] = useState<VippsTarget | null>(null);
  const [modalStep, setModalStep] = useState<1 | 2 | 3>(1);
  const { toast, show: showToast, hide: hideToast } = useToast();

  // Reset step to 1 whenever a new vippsTarget is set
  const prevVippsTarget = useRef<VippsTarget | null>(null);
  useEffect(() => {
    if (vippsTarget !== null && prevVippsTarget.current === null) {
      setModalStep(1);
    }
    prevVippsTarget.current = vippsTarget;
  }, [vippsTarget]);

  const pendingTasks = tasks.filter((t) => t.status === 'Ferdig');

  const pendingByChild: Record<string, Task[]> = {};
  for (const task of pendingTasks) {
    const key = task.takenBy ?? '__unknown__';
    if (!pendingByChild[key]) pendingByChild[key] = [];
    pendingByChild[key].push(task);
  }

  const vippsTargets: VippsTarget[] = children
    .map((child) => {
      const approved = tasks.filter(
        (t) => t.status === 'Godkjent' && t.takenBy === child.phone
      );
      const total = approved.reduce((sum, t) => sum + t.reward, 0);
      return { child, tasks: approved, total };
    })
    .filter((v) => v.tasks.length > 0);

  function getChild(phone?: string): Child | undefined {
    return children.find((c) => c.phone === phone);
  }

  const rejectedTasks = tasks.filter((t) => t.status === 'Avvist');

  function handleApprove(taskId: string) {
    dispatch({ type: 'APPROVE_TASK', payload: taskId });
    showToast('Oppgave godkjent', 'success');
  }

  function handleReject(taskId: string) {
    dispatch({ type: 'REJECT_TASK', payload: taskId });
    showToast('Oppgave avvist', 'error');
  }

  function handleReopen(taskId: string) {
    dispatch({ type: 'REOPEN_TASK', payload: taskId });
  }

  function handleMarkPaid(target: VippsTarget) {
    dispatch({
      type: 'SET_TASKS_PAID',
      payload: target.tasks.map((t) => t.id),
    });
    setModalStep(3);
    setTimeout(() => setVippsTarget(null), 2000);
    showToast('Betaling registrert ✓', 'success');
  }

  function closeModal() {
    setVippsTarget(null);
    setModalStep(1);
  }

  // Navy badge showing pending count for the header
  const pendingBadge =
    pendingTasks.length > 0 ? (
      <View style={styles.headerBadge}>
        <Text style={styles.headerBadgeText}>{pendingTasks.length}</Text>
      </View>
    ) : undefined;

  return (
    <View style={styles.wrapper}>
      <ScreenContainer bg={Colors.bgPrimary}>
        <ScreenHeader title="Godkjenninger" right={pendingBadge} />

        {/* ── Pending approvals ── */}
        <Text style={styles.sectionLabel}>Venter på godkjenning</Text>

        {pendingTasks.length === 0 ? (
          <Card elevation="md">
            <EmptyState
              icon="check-square"
              title="Ingen ventende godkjenninger"
              subtitle="Barn som markerer oppgaver som ferdige vil dukke opp her."
              accentColor={Colors.adultPrimary}
            />
          </Card>
        ) : (
          Object.entries(pendingByChild).map(([phone, childTasks], groupIndex) => {
            const child = getChild(phone);
            const displayName = child
              ? `${child.avatarEmoji} ${child.name}`
              : phone;
            return (
              <View key={phone}>
                {/* Child header chip */}
                <View style={styles.childChip}>
                  <Text style={styles.childChipText}>{displayName}</Text>
                </View>

                {childTasks.map((task, taskIndex) => (
                  <Animated.View
                    key={task.id}
                    entering={FadeInDown.delay(
                      groupIndex * 100 + taskIndex * 60
                    ).duration(300)}
                  >
                    <Card elevation="md">
                      {/* Title row + reward badge */}
                      <View style={styles.approvalCardHeader}>
                        <Text style={styles.approvalTaskTitle} numberOfLines={1}>
                          {task.title}
                        </Text>
                        <View style={styles.rewardBadge}>
                          <Text style={styles.rewardBadgeText}>
                            {task.reward} kr
                          </Text>
                        </View>
                      </View>

                      {task.description ? (
                        <Text style={styles.approvalDesc} numberOfLines={2}>
                          {task.description}
                        </Text>
                      ) : null}

                      {/* Action buttons */}
                      <View style={styles.approvalActions}>
                        <Button
                          label="Godkjenn"
                          onPress={() => handleApprove(task.id)}
                          accentColor={Colors.brand}
                          style={styles.actionBtn}
                        />
                        <Button
                          label="Avvis"
                          onPress={() => handleReject(task.id)}
                          variant="secondary"
                          accentColor={Colors.statusDanger}
                          style={styles.actionBtn}
                        />
                      </View>
                    </Card>
                  </Animated.View>
                ))}
              </View>
            );
          })
        )}

        {/* ── Vipps payouts section ── */}
        <Text style={[styles.sectionLabel, styles.sectionLabelGap]}>
          Vipps-utbetalinger
        </Text>

        {vippsTargets.length === 0 ? (
          <Card elevation="md">
            <EmptyState
              icon="credit-card"
              title="Ingen godkjente utbetalinger"
              subtitle="Godkjente oppgaver som ennå ikke er betalt vil vises her."
              accentColor={Colors.adultPrimary}
            />
          </Card>
        ) : (
          vippsTargets.map(({ child, tasks: childTasks, total }, index) => (
            <Animated.View
              key={child.phone}
              entering={FadeIn.delay(index * 80).duration(300)}
            >
              <Card elevation="md">
                <View style={styles.vippsChildRow}>
                  <Text style={styles.vippsAvatar}>{child.avatarEmoji}</Text>
                  <View style={styles.vippsChildInfo}>
                    <Text style={styles.vippsChildName}>{child.name}</Text>
                    <Text style={styles.vippsChildPhone}>{child.phone}</Text>
                    <Text style={styles.vippsTaskCount}>
                      {childTasks.length} godkjent
                      {childTasks.length !== 1 ? 'e' : ''} oppgave
                      {childTasks.length !== 1 ? 'r' : ''}
                    </Text>
                  </View>
                  <Text style={styles.vippsTotal}>{total} kr</Text>
                </View>
                <VippsButton
                  onPress={() =>
                    setVippsTarget({ child, tasks: childTasks, total })
                  }
                />
              </Card>
            </Animated.View>
          ))
        )}

        {/* ── Rejected tasks section ── */}
        {rejectedTasks.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, styles.sectionLabelGap]}>
              Avviste oppgaver
            </Text>
            {rejectedTasks.map((task, index) => {
              const child = getChild(task.takenBy);
              const displayName = child
                ? `${child.avatarEmoji} ${child.name}`
                : task.takenBy ?? '';
              return (
                <Animated.View
                  key={task.id}
                  entering={FadeInDown.delay(index * 60).duration(300)}
                >
                  <Card elevation="md">
                    {/* Title row + red reward badge */}
                    <View style={styles.approvalCardHeader}>
                      <Text style={styles.approvalTaskTitle} numberOfLines={1}>
                        {task.title}
                      </Text>
                      <View style={styles.rewardBadgeDanger}>
                        <Text style={styles.rewardBadgeText}>
                          {task.reward} kr
                        </Text>
                      </View>
                    </View>

                    {/* Child chip */}
                    {displayName ? (
                      <View style={styles.childChip}>
                        <Text style={styles.childChipText}>{displayName}</Text>
                      </View>
                    ) : null}

                    {/* Reopen button */}
                    <Button
                      label="Gjør ledig igjen"
                      onPress={() => handleReopen(task.id)}
                      variant="secondary"
                      accentColor={Colors.brand}
                      style={styles.reopenButton}
                    />
                  </Card>
                </Animated.View>
              );
            })}
          </>
        )}

        <View style={{ height: Spacing.xl }} />
      </ScreenContainer>

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          visible={true}
          onHide={hideToast}
        />
      )}

      {/* ── Vipps payment bottom sheet ── */}
      <Modal
        visible={vippsTarget !== null}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <Animated.View entering={FadeIn.duration(200)} style={styles.modalOverlay}>
          {vippsTarget && (
            <View style={styles.modalSheet}>

              {/* ── Step 1: Review ── */}
              {modalStep === 1 && (
                <>
                  <Text style={styles.modalTitle}>Send betaling</Text>

                  <Card style={styles.summaryCard}>
                    <ListRow
                      title="Mottaker"
                      right={
                        <Text style={styles.summaryValue}>
                          {vippsTarget.child.avatarEmoji} {vippsTarget.child.name}
                        </Text>
                      }
                    />
                    <ListRow
                      title="Telefon"
                      right={
                        <Text style={styles.summaryValue}>
                          {vippsTarget.child.phone}
                        </Text>
                      }
                    />
                    <ListRow
                      title="Oppgaver"
                      right={
                        <Text style={styles.summaryValue}>
                          {vippsTarget.tasks.length} stk
                        </Text>
                      }
                    />
                    <ListRow
                      title="Totalbeløp"
                      right={
                        <Text style={styles.totalValue}>
                          {vippsTarget.total} kr
                        </Text>
                      }
                      showDivider={false}
                    />
                  </Card>

                  {/* Task breakdown */}
                  {vippsTarget.tasks.map((t) => (
                    <View key={t.id} style={styles.taskBreakdownRow}>
                      <Text style={styles.taskBreakdownTitle} numberOfLines={1}>
                        {t.title}
                      </Text>
                      <Text style={styles.taskBreakdownReward}>{t.reward} kr</Text>
                    </View>
                  ))}

                  <VippsButton
                    label={`Betal ${vippsTarget.total} kr med Vipps`}
                    phone={vippsTarget.child.phone}
                    amount={vippsTarget.total}
                    onPaymentInitiated={() => setModalStep(2)}
                    style={styles.payButton}
                  />

                  <TouchableOpacity
                    style={styles.cancelLink}
                    onPress={closeModal}
                  >
                    <Text style={styles.cancelLinkText}>Avbryt</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* ── Step 2: Waiting for confirmation ── */}
              {modalStep === 2 && (
                <>
                  <Text style={styles.modalTitle}>Vent på bekreftelse i Vipps</Text>

                  <View style={styles.pulseContainer}>
                    <VippsPulse />
                    <Text style={styles.waitingText}>
                      Betalingen er sendt til Vipps-appen din
                    </Text>
                  </View>

                  <Button
                    label="Bekreft betalt ✓"
                    onPress={() => handleMarkPaid(vippsTarget)}
                    accentColor={Colors.brand}
                    style={styles.confirmButton}
                  />

                  <TouchableOpacity
                    style={styles.cancelLink}
                    onPress={() => setModalStep(1)}
                  >
                    <Text style={styles.cancelLinkText}>Tilbake</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* ── Step 3: Success ── */}
              {modalStep === 3 && (
                <View style={styles.successContainer}>
                  <View style={styles.successCircle}>
                    <Feather name="check" size={48} color={Colors.textInverse} />
                  </View>
                  <Text style={styles.successTitle}>Betaling bekreftet!</Text>
                  <Text style={styles.successSubtitle}>
                    {vippsTarget.total} kr sendt til {vippsTarget.child.name}
                  </Text>
                </View>
              )}

            </View>
          )}
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  // Header badge
  headerBadge: {
    backgroundColor: Colors.adultPrimary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBadgeText: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
    color: Colors.textInverse,
    lineHeight: LineHeight.tight,
  },
  // Section labels — sentence case, 13px semibold
  sectionLabel: {
    fontSize: FontSize.label,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.semibold,
    color: Colors.textSecondary,
    letterSpacing: 0.3,
    lineHeight: LineHeight.tight,
    marginBottom: Spacing.sm,
  },
  sectionLabelGap: {
    marginTop: Layout.sectionGap,
  },
  // Child chip
  childChip: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.adultSurface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm2,
    paddingVertical: 4,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
  childChipText: {
    fontSize: FontSize.label,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.semibold,
    color: Colors.adultPrimary,
    lineHeight: LineHeight.tight,
  },
  // Approval card
  approvalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  approvalTaskTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.semibold,
    color: Colors.textPrimary,
    lineHeight: LineHeight.normal,
    flex: 1,
    marginRight: Spacing.sm,
  },
  rewardBadge: {
    backgroundColor: Colors.adultPrimary,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  rewardBadgeDanger: {
    backgroundColor: Colors.statusDanger,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  rewardBadgeText: {
    fontSize: FontSize.label,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
    color: Colors.textInverse,
    lineHeight: LineHeight.tight,
  },
  approvalDesc: {
    fontSize: FontSize.label,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    lineHeight: LineHeight.normal,
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  approvalActions: {
    flexDirection: 'row',
    gap: Layout.buttonGroupGap,
    marginTop: Spacing.sm2,
  },
  actionBtn: {
    flex: 1,
  },
  reopenButton: {
    marginTop: Spacing.sm2,
  },
  // Vipps payout cards
  vippsChildRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  vippsAvatar: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  vippsChildInfo: {
    flex: 1,
  },
  vippsChildName: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.semibold,
    color: Colors.textPrimary,
    lineHeight: LineHeight.normal,
  },
  vippsChildPhone: {
    fontSize: FontSize.label,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    lineHeight: LineHeight.tight,
  },
  vippsTaskCount: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.regular,
    color: Colors.textTertiary,
    lineHeight: LineHeight.tight,
    marginTop: 2,
  },
  vippsTotal: {
    fontSize: FontSize.title,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
    color: Colors.adultPrimary,
    lineHeight: LineHeight.loose,
  },
  // Payment modal
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlayScrim,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.bgPrimary,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Layout.modalPadding,
    paddingBottom: Layout.modalPaddingBottom,
    maxHeight: '90%' as any,
  },
  modalTitle: {
    fontSize: FontSize.title,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    lineHeight: LineHeight.loose,
    textAlign: 'center',
    marginBottom: Layout.modalTitleGap,
  },
  summaryCard: {
    marginBottom: Spacing.sm,
  },
  summaryValue: {
    fontSize: FontSize.label,
    fontWeight: FontWeight.medium,
    fontFamily: FontFamily.medium,
    color: Colors.textPrimary,
    lineHeight: LineHeight.tight,
  },
  totalValue: {
    fontSize: FontSize.title,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
    color: Colors.adultPrimary,
    lineHeight: LineHeight.loose,
  },
  taskBreakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  taskBreakdownTitle: {
    fontSize: FontSize.label,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    lineHeight: LineHeight.tight,
    flex: 1,
    marginRight: Spacing.sm,
  },
  taskBreakdownReward: {
    fontSize: FontSize.label,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    lineHeight: LineHeight.tight,
  },
  payButton: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  cancelLink: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  cancelLinkText: {
    fontSize: FontSize.label,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    lineHeight: LineHeight.tight,
  },
  // Step 2 — waiting
  pulseContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.lg,
  },
  vippsPulseCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.vippsOrange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vippsPulseText: {
    color: Colors.textInverse,
    fontSize: FontSize.label,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
  },
  waitingText: {
    fontSize: FontSize.body,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    lineHeight: LineHeight.normal,
    textAlign: 'center',
  },
  confirmButton: {
    marginBottom: Spacing.sm,
  },
  // Step 3 — success
  successContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  successCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  successTitle: {
    fontSize: FontSize.title,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    lineHeight: LineHeight.loose,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: FontSize.body,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    lineHeight: LineHeight.normal,
    textAlign: 'center',
  },
});
