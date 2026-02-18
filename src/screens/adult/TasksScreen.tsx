import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../constants/tokens';
import { useAppContext } from '../../store/AppContext';
import { Task, TaskStatus, isTaskExpired } from '../../store/types';

function statusBadgeColor(status: TaskStatus): string {
  switch (status) {
    case 'Ledig':
      return Colors.adultAccent;
    case 'Tatt':
      return Colors.warning;
    case 'Ferdig':
      return Colors.warning;
    case 'Godkjent':
      return Colors.success;
    case 'Avvist':
      return Colors.danger;
    case 'Betalt':
      return Colors.textMuted;
    default:
      return Colors.textMuted;
  }
}

function statusBadgeFontWeight(status: TaskStatus): '400' | '500' | '600' | '700' | '800' {
  return status === 'Ferdig' ? FontWeight.bold : FontWeight.semibold;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('nb-NO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function TasksScreen() {
  const { state, dispatch } = useAppContext();
  const { tasks, children } = state;

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [detailTask, setDetailTask] = useState<Task | null>(null);

  // Form state for new task
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formReward, setFormReward] = useState('');
  const [titleError, setTitleError] = useState('');
  const [rewardError, setRewardError] = useState('');

  const sortedTasks = [...tasks].sort((a, b) => b.createdAt - a.createdAt);

  function getChildName(phone?: string): string {
    if (!phone) return '';
    const child = children.find((c) => c.phone === phone);
    return child ? `${child.avatarEmoji} ${child.name}` : phone;
  }

  function resetForm() {
    setFormTitle('');
    setFormDesc('');
    setFormReward('');
    setTitleError('');
    setRewardError('');
  }

  function openAddModal() {
    resetForm();
    setAddModalVisible(true);
  }

  function closeAddModal() {
    setAddModalVisible(false);
    resetForm();
  }

  function handleSaveTask() {
    let valid = true;

    if (!formTitle.trim()) {
      setTitleError('Tittel er påkrevd.');
      valid = false;
    } else {
      setTitleError('');
    }

    const rewardNum = parseFloat(formReward.replace(',', '.'));
    if (!formReward.trim() || isNaN(rewardNum) || rewardNum < 0) {
      setRewardError('Oppgi et gyldig beløp (f.eks. 50).');
      valid = false;
    } else {
      setRewardError('');
    }

    if (!valid) return;

    dispatch({
      type: 'ADD_TASK',
      payload: {
        id: Date.now().toString(),
        title: formTitle.trim(),
        description: formDesc.trim(),
        reward: rewardNum,
        status: 'Ledig',
        createdAt: Date.now(),
      },
    });
    closeAddModal();
  }

  function handleDeleteTask(task: Task) {
    dispatch({ type: 'DELETE_TASK', payload: task.id });
    setDetailTask(null);
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Oppgaver</Text>
          <Text style={styles.subtitle}>{tasks.length} oppgave{tasks.length !== 1 ? 'r' : ''} totalt</Text>
        </View>

        {/* Task list */}
        {sortedTasks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyTitle}>Ingen oppgaver ennå</Text>
            <Text style={styles.emptySubtitle}>
              Trykk på + knappen for å opprette din første oppgave.
            </Text>
          </View>
        ) : (
          sortedTasks.map((task) => {
            const expired = isTaskExpired(task);
            return (
              <TouchableOpacity
                key={task.id}
                style={styles.taskCard}
                onPress={() => setDetailTask(task)}
                activeOpacity={0.75}
              >
                <View style={styles.taskCardTop}>
                  <Text style={styles.taskTitle} numberOfLines={1}>
                    {task.title}
                    {expired ? (
                      <Text style={styles.expiredTag}> (Utgått)</Text>
                    ) : null}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusBadgeColor(task.status) }]}>
                    <Text style={[styles.statusBadgeText, { fontWeight: statusBadgeFontWeight(task.status) }]}>
                      {task.status}
                    </Text>
                  </View>
                </View>
                <View style={styles.taskCardBottom}>
                  <Text style={styles.rewardText}>{task.reward} kr</Text>
                  {task.takenBy ? (
                    <Text style={styles.takenByText}>{getChildName(task.takenBy)}</Text>
                  ) : null}
                  <Text style={styles.dateText}>{formatDate(task.createdAt)}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}

        {/* Bottom padding so FAB doesn't overlap last card */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={openAddModal} activeOpacity={0.85}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Add Task Modal */}
      <Modal
        visible={addModalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeAddModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalSheet}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.modalTitle}>Ny oppgave</Text>

              <Text style={styles.fieldLabel}>Tittel</Text>
              <TextInput
                style={[styles.input, titleError ? styles.inputError : null]}
                placeholder="Navn på oppgaven"
                placeholderTextColor={Colors.textMuted}
                value={formTitle}
                onChangeText={setFormTitle}
                autoCapitalize="sentences"
                returnKeyType="next"
              />
              {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}

              <Text style={styles.fieldLabel}>Beskrivelse</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Beskriv oppgaven (valgfritt)"
                placeholderTextColor={Colors.textMuted}
                value={formDesc}
                onChangeText={setFormDesc}
                multiline
                numberOfLines={3}
                autoCapitalize="sentences"
                returnKeyType="default"
                textAlignVertical="top"
              />

              <Text style={styles.fieldLabel}>Belønning (kr)</Text>
              <TextInput
                style={[styles.input, rewardError ? styles.inputError : null]}
                placeholder="f.eks. 50"
                placeholderTextColor={Colors.textMuted}
                value={formReward}
                onChangeText={setFormReward}
                keyboardType="decimal-pad"
                returnKeyType="done"
              />
              {rewardError ? <Text style={styles.errorText}>{rewardError}</Text> : null}

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveTask}>
                <Text style={styles.saveButtonText}>Lagre</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelLink} onPress={closeAddModal}>
                <Text style={styles.cancelLinkText}>Avbryt</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Task Detail Modal */}
      <Modal
        visible={detailTask !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setDetailTask(null)}
      >
        <View style={styles.modalOverlay}>
          {detailTask && (
            <View style={styles.modalSheet}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Status badge */}
                <View style={styles.detailHeaderRow}>
                  <View
                    style={[
                      styles.statusBadgeLg,
                      { backgroundColor: statusBadgeColor(detailTask.status) },
                    ]}
                  >
                    <Text style={styles.statusBadgeLgText}>{detailTask.status}</Text>
                  </View>
                  {isTaskExpired(detailTask) && (
                    <Text style={styles.expiredTag}> (Utgått)</Text>
                  )}
                </View>

                <Text style={styles.detailTitle}>{detailTask.title}</Text>

                {detailTask.description ? (
                  <Text style={styles.detailDesc}>{detailTask.description}</Text>
                ) : null}

                <View style={styles.detailRow}>
                  <Text style={styles.detailRowLabel}>Belønning</Text>
                  <Text style={styles.detailRowValue}>{detailTask.reward} kr</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailRowLabel}>Opprettet</Text>
                  <Text style={styles.detailRowValue}>{formatDate(detailTask.createdAt)}</Text>
                </View>
                {detailTask.takenBy && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailRowLabel}>Tatt av</Text>
                    <Text style={styles.detailRowValue}>{getChildName(detailTask.takenBy)}</Text>
                  </View>
                )}
                {detailTask.completedAt && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailRowLabel}>Fullført</Text>
                    <Text style={styles.detailRowValue}>{formatDate(detailTask.completedAt)}</Text>
                  </View>
                )}
                {detailTask.approvedAt && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailRowLabel}>Godkjent / avvist</Text>
                    <Text style={styles.detailRowValue}>{formatDate(detailTask.approvedAt)}</Text>
                  </View>
                )}
                {detailTask.paidAt && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailRowLabel}>Betalt ut</Text>
                    <Text style={styles.detailRowValue}>{formatDate(detailTask.paidAt)}</Text>
                  </View>
                )}

                {detailTask.status === 'Ledig' && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteTask(detailTask)}
                  >
                    <Text style={styles.deleteButtonText}>Slett oppgave</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.cancelLink}
                  onPress={() => setDetailTask(null)}
                >
                  <Text style={styles.cancelLinkText}>Lukk</Text>
                </TouchableOpacity>
              </ScrollView>
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
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  emptyCard: {
    backgroundColor: Colors.adultCard,
    borderRadius: Radius.md,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  taskCard: {
    backgroundColor: Colors.adultCard,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  taskCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  taskTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.sm,
  },
  expiredTag: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: FontWeight.regular,
  },
  statusBadge: {
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  statusBadgeText: {
    fontSize: FontSize.xs,
    color: Colors.text,
  },
  taskCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  rewardText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.adultAccent,
  },
  takenByText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    flex: 1,
  },
  dateText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  // FAB
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.adultAccent,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  fabText: {
    fontSize: 30,
    color: Colors.text,
    fontWeight: FontWeight.bold,
    lineHeight: 34,
  },
  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
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
  modalTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  fieldLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.adultBg,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
    fontSize: FontSize.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  textArea: {
    height: 80,
    paddingTop: Spacing.sm,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  errorText: {
    fontSize: FontSize.xs,
    color: Colors.danger,
    marginBottom: Spacing.sm,
  },
  saveButton: {
    backgroundColor: Colors.adultAccent,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  saveButtonText: {
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
  // Detail modal
  detailHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  statusBadgeLg: {
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  statusBadgeLgText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  detailTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  detailDesc: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailRowLabel: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  detailRowValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text,
  },
  deleteButton: {
    backgroundColor: Colors.danger,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  deleteButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
});
