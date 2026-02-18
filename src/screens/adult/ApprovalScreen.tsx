import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../constants/tokens';
import { useAppContext } from '../../store/AppContext';
import { Child, Task } from '../../store/types';

interface VippsTarget {
  child: Child;
  tasks: Task[];
  total: number;
}

export default function ApprovalScreen() {
  const { state, dispatch } = useAppContext();
  const { tasks, children } = state;

  const [vippsTarget, setVippsTarget] = useState<VippsTarget | null>(null);

  // Tasks awaiting approval
  const pendingTasks = tasks.filter((t) => t.status === 'Ferdig');

  // Group pending by child phone
  const pendingByChild: Record<string, Task[]> = {};
  for (const task of pendingTasks) {
    const key = task.takenBy ?? '__unknown__';
    if (!pendingByChild[key]) pendingByChild[key] = [];
    pendingByChild[key].push(task);
  }

  // Children with approved (Godkjent), unpaid tasks
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

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Godkjenninger</Text>
        </View>

        {/* Pending approvals */}
        <Text style={styles.sectionLabel}>Venter godkjenning</Text>

        {pendingTasks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>✅</Text>
            <Text style={styles.emptyTitle}>Ingen ventende godkjenninger</Text>
            <Text style={styles.emptySubtitle}>
              Barn som markerer oppgaver som ferdige vil dukke opp her.
            </Text>
          </View>
        ) : (
          Object.entries(pendingByChild).map(([phone, childTasks]) => {
            const child = getChild(phone);
            const displayName = child
              ? `${child.avatarEmoji} ${child.name}`
              : phone;
            return (
              <View key={phone}>
                <Text style={styles.childGroupLabel}>{displayName}</Text>
                {childTasks.map((task) => (
                  <View key={task.id} style={styles.approvalCard}>
                    <View style={styles.approvalCardHeader}>
                      <Text style={styles.approvalTaskTitle} numberOfLines={1}>
                        {task.title}
                      </Text>
                      <Text style={styles.approvalReward}>{task.reward} kr</Text>
                    </View>
                    {task.description ? (
                      <Text style={styles.approvalDesc} numberOfLines={2}>
                        {task.description}
                      </Text>
                    ) : null}
                    <View style={styles.approvalActions}>
                      <TouchableOpacity
                        style={styles.approveButton}
                        onPress={() => handleApprove(task.id)}
                      >
                        <Text style={styles.approveButtonText}>Godkjenn</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.rejectButton}
                        onPress={() => handleReject(task.id)}
                      >
                        <Text style={styles.rejectButtonText}>Avvis</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            );
          })
        )}

        {/* Vipps payouts section */}
        <Text style={[styles.sectionLabel, { marginTop: Spacing.lg }]}>
          Vipps-utbetalinger
        </Text>

        {vippsTargets.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>💸</Text>
            <Text style={styles.emptyTitle}>Ingen godkjente utbetalinger</Text>
            <Text style={styles.emptySubtitle}>
              Godkjente oppgaver som ennå ikke er betalt vil vises her.
            </Text>
          </View>
        ) : (
          vippsTargets.map(({ child, tasks: childTasks, total }) => (
            <View key={child.phone} style={styles.vippsCard}>
              <View style={styles.vippsChildRow}>
                <Text style={styles.vippsAvatar}>{child.avatarEmoji}</Text>
                <View style={styles.vippsChildInfo}>
                  <Text style={styles.vippsChildName}>{child.name}</Text>
                  <Text style={styles.vippsChildPhone}>{child.phone}</Text>
                  <Text style={styles.vippsTaskCount}>
                    {childTasks.length} godkjent{childTasks.length !== 1 ? 'e' : ''} oppgave{childTasks.length !== 1 ? 'r' : ''}
                  </Text>
                </View>
                <Text style={styles.vippsTotal}>{total} kr</Text>
              </View>
              <TouchableOpacity
                style={styles.vippsButton}
                onPress={() => setVippsTarget({ child, tasks: childTasks, total })}
              >
                <Text style={styles.vippsButtonText}>Betal via Vipps</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <View style={{ height: Spacing.xl }} />
      </ScrollView>

      {/* Vipps payment Modal */}
      <Modal
        visible={vippsTarget !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setVippsTarget(null)}
      >
        <View style={styles.modalOverlay}>
          {vippsTarget && (
            <View style={styles.modalSheet}>
              {/* Vipps branding header */}
              <View style={styles.vippsBrandHeader}>
                <View style={styles.vippsBrandBadge}>
                  <Text style={styles.vippsBrandText}>Vipps</Text>
                </View>
              </View>

              <Text style={styles.modalTitle}>Send betaling</Text>

              {/* Summary */}
              <View style={styles.vippsModalSummary}>
                <View style={styles.vippsModalRow}>
                  <Text style={styles.vippsModalLabel}>Mottaker</Text>
                  <Text style={styles.vippsModalValue}>
                    {vippsTarget.child.avatarEmoji} {vippsTarget.child.name}
                  </Text>
                </View>
                <View style={styles.vippsModalRow}>
                  <Text style={styles.vippsModalLabel}>Telefon</Text>
                  <Text style={styles.vippsModalValue}>{vippsTarget.child.phone}</Text>
                </View>
                <View style={styles.vippsModalRow}>
                  <Text style={styles.vippsModalLabel}>Oppgaver</Text>
                  <Text style={styles.vippsModalValue}>{vippsTarget.tasks.length} stk</Text>
                </View>
                <View style={[styles.vippsModalRow, styles.vippsModalTotalRow]}>
                  <Text style={styles.vippsModalTotalLabel}>Totalbeløp</Text>
                  <Text style={styles.vippsModalTotalValue}>{vippsTarget.total} kr</Text>
                </View>
              </View>

              {/* Task breakdown */}
              {vippsTarget.tasks.map((t) => (
                <View key={t.id} style={styles.vippsTaskRow}>
                  <Text style={styles.vippsTaskTitle} numberOfLines={1}>{t.title}</Text>
                  <Text style={styles.vippsTaskReward}>{t.reward} kr</Text>
                </View>
              ))}

              {/* Mock Vipps pay button */}
              <TouchableOpacity
                style={styles.vippsPayButton}
                onPress={() => handleMarkPaid(vippsTarget)}
              >
                <Text style={styles.vippsPayButtonLabel}>Vipps</Text>
                <Text style={styles.vippsPayButtonAmount}>{vippsTarget.total} kr til {vippsTarget.child.name}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.markPaidButton}
                onPress={() => handleMarkPaid(vippsTarget)}
              >
                <Text style={styles.markPaidButtonText}>Marker som betalt</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelLink}
                onPress={() => setVippsTarget(null)}
              >
                <Text style={styles.cancelLinkText}>Avbryt</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.adultBg,
  },
  content: {
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  sectionLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  emptyCard: {
    backgroundColor: Colors.adultCard,
    borderRadius: Radius.md,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  childGroupLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.adultAccent,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  approvalCard: {
    backgroundColor: Colors.adultCard,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  approvalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  approvalTaskTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.sm,
  },
  approvalReward: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.adultAccent,
  },
  approvalDesc: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
    lineHeight: 18,
  },
  approvalActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  approveButton: {
    flex: 1,
    backgroundColor: Colors.success,
    borderRadius: Radius.sm,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  approveButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: Colors.danger,
    borderRadius: Radius.sm,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  rejectButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  // Vipps cards
  vippsCard: {
    backgroundColor: Colors.adultCard,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
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
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  vippsChildPhone: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  vippsTaskCount: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  vippsTotal: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.adultAccent,
  },
  vippsButton: {
    backgroundColor: '#FF5B24',
    borderRadius: Radius.sm,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  vippsButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  // Vipps modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.adultCard,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    maxHeight: '90%',
  },
  vippsBrandHeader: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  vippsBrandBadge: {
    backgroundColor: '#FF5B24',
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  vippsBrandText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    color: Colors.text,
    letterSpacing: 1,
  },
  modalTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  vippsModalSummary: {
    backgroundColor: Colors.adultBg,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  vippsModalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  vippsModalTotalRow: {
    borderBottomWidth: 0,
    marginTop: Spacing.xs,
  },
  vippsModalLabel: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  vippsModalValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text,
  },
  vippsModalTotalLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  vippsModalTotalValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.adultAccent,
  },
  vippsTaskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  vippsTaskTitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    flex: 1,
    marginRight: Spacing.sm,
  },
  vippsTaskReward: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  vippsPayButton: {
    backgroundColor: '#FF5B24',
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  vippsPayButtonLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  vippsPayButtonAmount: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginTop: 2,
  },
  markPaidButton: {
    backgroundColor: Colors.success,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  markPaidButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  cancelLink: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  cancelLinkText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
});
