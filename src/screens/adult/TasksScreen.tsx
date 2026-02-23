import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
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
import { Task, isTaskExpired } from '../../store/types';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';
import Input from '../../components/Input';
import ListRow from '../../components/ListRow';
import EmptyState from '../../components/EmptyState';

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('nb-NO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// Tasks where reward chip is shown (active/available)
const REWARD_CHIP_STATUSES = new Set(['Ledig', 'Tatt', 'Ferdig']);

export default function TasksScreen() {
  const { state, dispatch } = useAppContext();
  const { tasks, children } = state;

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [detailTask, setDetailTask] = useState<Task | null>(null);

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
      <ScreenContainer bg={Colors.bgPrimary}>
        <ScreenHeader
          title="Oppgaver"
          subtitle={`${tasks.length} oppgave${tasks.length !== 1 ? 'r' : ''} totalt`}
        />

        {/* ── Oppgaveliste ── */}
        <Text style={styles.sectionLabel}>Alle oppgaver</Text>

        {sortedTasks.length === 0 ? (
          <Card elevation="md">
            <EmptyState
              icon="clipboard"
              title="Ingen oppgaver ennå"
              subtitle="Trykk på + for å opprette din første oppgave."
              accentColor={Colors.adultPrimary}
            />
          </Card>
        ) : (
          sortedTasks.map((task) => {
            const expired = isTaskExpired(task);
            const showRewardChip = REWARD_CHIP_STATUSES.has(task.status);
            return (
              <Card
                key={task.id}
                elevation="md"
                onPress={() => setDetailTask(task)}
                style={expired ? styles.expiredCard : undefined}
              >
                {/* Top row: title + status badge */}
                <View style={styles.taskCardTop}>
                  <Text style={styles.taskTitle} numberOfLines={1}>
                    {task.title}
                  </Text>
                  <StatusBadge status={task.status} />
                </View>

                {/* Bottom row: reward chip or amount + taker + date */}
                <View style={styles.taskCardBottom}>
                  {showRewardChip ? (
                    <View style={styles.rewardChip}>
                      <Text style={styles.rewardChipText}>{task.reward} kr</Text>
                    </View>
                  ) : (
                    <Text style={styles.rewardText}>{task.reward} kr</Text>
                  )}
                  {task.takenBy ? (
                    <Text style={styles.takenByText}>{getChildName(task.takenBy)}</Text>
                  ) : null}
                  <Text style={styles.dateText}>{formatDate(task.createdAt)}</Text>
                </View>
              </Card>
            );
          })
        )}

        <View style={{ height: 80 }} />
      </ScreenContainer>

      {/* ── FAB ── */}
      <TouchableOpacity style={styles.fab} onPress={openAddModal} activeOpacity={0.85}>
        <Feather name="plus" size={24} color={Colors.textInverse} />
      </TouchableOpacity>

      {/* ── Legg til oppgave modal ── */}
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
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.modalTitle}>Ny oppgave</Text>

              <Input
                label="Tittel"
                placeholder="Navn på oppgaven"
                value={formTitle}
                onChangeText={setFormTitle}
                accentColor={Colors.adultPrimary}
                autoCapitalize="sentences"
                returnKeyType="next"
                containerStyle={styles.fieldSpacing}
              />
              {titleError ? (
                <Text style={styles.errorText}>{titleError}</Text>
              ) : null}

              <Input
                label="Beskrivelse"
                placeholder="Beskriv oppgaven (valgfritt)"
                value={formDesc}
                onChangeText={setFormDesc}
                accentColor={Colors.adultPrimary}
                multiline
                numberOfLines={3}
                autoCapitalize="sentences"
                style={styles.textArea}
                containerStyle={styles.fieldSpacing}
              />

              <Input
                label="Belønning (kr)"
                placeholder="f.eks. 50"
                value={formReward}
                onChangeText={setFormReward}
                accentColor={Colors.adultPrimary}
                keyboardType="decimal-pad"
                returnKeyType="done"
                containerStyle={styles.fieldSpacing}
              />
              {rewardError ? (
                <Text style={styles.errorText}>{rewardError}</Text>
              ) : null}

              <Button
                label="Lagre oppgave"
                onPress={handleSaveTask}
                accentColor={Colors.brand}
                style={styles.saveButton}
              />
              <TouchableOpacity style={styles.cancelLink} onPress={closeAddModal}>
                <Text style={styles.cancelLinkText}>Avbryt</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── Oppgavedetalj modal ── */}
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
                <View style={styles.detailHeaderRow}>
                  <StatusBadge status={detailTask.status} size="md" />
                  {isTaskExpired(detailTask) && (
                    <Text style={styles.expiredTag}> (Utgått)</Text>
                  )}
                </View>

                <Text style={styles.detailTitle}>{detailTask.title}</Text>
                {detailTask.description ? (
                  <Text style={styles.detailDesc}>{detailTask.description}</Text>
                ) : null}

                <ListRow
                  title="Belønning"
                  right={<Text style={styles.detailValue}>{detailTask.reward} kr</Text>}
                />
                <ListRow
                  title="Opprettet"
                  right={<Text style={styles.detailValue}>{formatDate(detailTask.createdAt)}</Text>}
                />
                {detailTask.takenBy && (
                  <ListRow
                    title="Tatt av"
                    right={<Text style={styles.detailValue}>{getChildName(detailTask.takenBy)}</Text>}
                  />
                )}
                {detailTask.completedAt && (
                  <ListRow
                    title="Fullført"
                    right={<Text style={styles.detailValue}>{formatDate(detailTask.completedAt)}</Text>}
                  />
                )}
                {detailTask.approvedAt && (
                  <ListRow
                    title="Godkjent/avvist"
                    right={<Text style={styles.detailValue}>{formatDate(detailTask.approvedAt)}</Text>}
                  />
                )}
                {detailTask.paidAt && (
                  <ListRow
                    title="Utbetalt"
                    right={<Text style={styles.detailValue}>{formatDate(detailTask.paidAt)}</Text>}
                    showDivider={false}
                  />
                )}

                {detailTask.status === 'Ledig' && (
                  <Button
                    label="Slett oppgave"
                    onPress={() => handleDeleteTask(detailTask)}
                    variant="danger"
                    style={styles.deleteButton}
                  />
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
  },
  // Section label — sentence case, 13px semibold secondary
  sectionLabel: {
    fontSize: FontSize.label,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.semibold,
    color: Colors.textSecondary,
    letterSpacing: 0.3,
    lineHeight: LineHeight.tight,
    marginBottom: Spacing.sm,
  },
  // Task cards
  taskCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  taskTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.semibold,
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.sm,
    lineHeight: LineHeight.normal,
  },
  expiredCard: {
    opacity: 0.45,
  },
  expiredTag: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.regular,
    color: Colors.textTertiary,
    lineHeight: LineHeight.tight,
  },
  taskCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  // Navy reward chip — shown only for active/available tasks
  rewardChip: {
    backgroundColor: Colors.adultPrimary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  rewardChipText: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
    color: Colors.textInverse,
    lineHeight: LineHeight.tight,
  },
  // Plain reward text for non-active tasks
  rewardText: {
    fontSize: FontSize.label,
    fontWeight: FontWeight.medium,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
    lineHeight: LineHeight.tight,
  },
  takenByText: {
    fontSize: FontSize.label,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: LineHeight.tight,
  },
  dateText: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.regular,
    color: Colors.textTertiary,
    lineHeight: LineHeight.tight,
  },
  // FAB
  fab: {
    position: 'absolute',
    bottom: Layout.fabBottom,
    right: Layout.fabRight,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    ...Elevation.md,
  },
  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlayScrim,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.bgPrimary,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
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
    marginBottom: Layout.modalTitleGap,
    textAlign: 'center',
  },
  fieldSpacing: {
    marginBottom: Spacing.sm,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: Spacing.sm,
  },
  errorText: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.regular,
    color: Colors.statusDanger,
    marginBottom: Spacing.sm,
    lineHeight: LineHeight.tight,
  },
  saveButton: {
    marginTop: Spacing.md,
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
  // Detail modal
  detailHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  detailTitle: {
    fontSize: FontSize.title,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    lineHeight: LineHeight.loose,
    marginBottom: Spacing.sm,
  },
  detailDesc: {
    fontSize: FontSize.body,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    lineHeight: LineHeight.normal,
    marginBottom: Spacing.md,
  },
  detailValue: {
    fontSize: FontSize.label,
    fontWeight: FontWeight.medium,
    fontFamily: FontFamily.medium,
    color: Colors.textPrimary,
    lineHeight: LineHeight.tight,
  },
  deleteButton: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
});
