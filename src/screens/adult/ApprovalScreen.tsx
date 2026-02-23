import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
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

export default function ApprovalScreen() {
  const { state, dispatch } = useAppContext();
  const { tasks, children } = state;

  const [vippsTarget, setVippsTarget] = useState<VippsTarget | null>(null);

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

  function handleApprove(taskId: string) {
    dispatch({ type: 'APPROVE_TASK', payload: taskId });
  }

  function handleReject(taskId: string) {
    dispatch({ type: 'REJECT_TASK', payload: taskId });
  }

  function handleMarkPaid(target: VippsTarget) {
    dispatch({
      type: 'SET_TASKS_PAID',
      payload: target.tasks.map((t) => t.id),
    });
    setVippsTarget(null);
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

        <View style={{ height: Spacing.xl }} />
      </ScreenContainer>

      {/* ── Vipps payment bottom sheet ── */}
      <Modal
        visible={vippsTarget !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setVippsTarget(null)}
      >
        <Animated.View entering={FadeIn.duration(200)} style={styles.modalOverlay}>
          {vippsTarget && (
            <View style={styles.modalSheet}>
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
                onPress={() => handleMarkPaid(vippsTarget)}
                style={styles.payButton}
              />

              <TouchableOpacity
                style={styles.cancelLink}
                onPress={() => setVippsTarget(null)}
              >
                <Text style={styles.cancelLinkText}>Avbryt</Text>
              </TouchableOpacity>
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
});
