import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Colors, FontSize, FontWeight, Spacing } from '../../constants/tokens';
import { useAppContext } from '../../store/AppContext';
import { isTaskExpired } from '../../store/types';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';

const TasksScreen: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const childPhone = state.childPhone ?? '';

  const handleTakeTask = (taskId: string) => {
    dispatch({ type: 'TAKE_TASK', payload: { taskId, childPhone } });
  };

  const handleCompleteTask = (taskId: string) => {
    dispatch({ type: 'COMPLETE_TASK', payload: taskId });
  };

  // Available tasks: status 'Ledig' and not expired
  const availableTasks = state.tasks.filter(
    (t) => t.status === 'Ledig' && !isTaskExpired(t)
  );

  // This child's taken tasks
  const myTakenTasks = state.tasks.filter(
    (t) => t.status === 'Tatt' && t.takenBy === childPhone && !isTaskExpired(t)
  );

  const hasAnyTasks = availableTasks.length > 0 || myTakenTasks.length > 0;

  return (
    <ScreenContainer bg={Colors.childBg}>
      <Text style={styles.screenTitle}>Tilgjengelige oppgaver</Text>

      {!hasAnyTasks && (
        <Card bg={Colors.childCard}>
          <Text style={styles.emptyText}>Ingen ledige oppgaver</Text>
        </Card>
      )}

      {myTakenTasks.map((task) => (
        <Card key={task.id} bg={Colors.childCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Badge label="Din oppgave" color={Colors.childAccent} textColor={Colors.childBg} />
          </View>
          {task.description ? (
            <Text style={styles.taskDescription}>{task.description}</Text>
          ) : null}
          <View style={styles.cardFooter}>
            <Text style={styles.reward}>{task.reward} kr</Text>
            <Button
              label="Meld ferdig"
              onPress={() => handleCompleteTask(task.id)}
              variant="primary"
              accentColor={Colors.childAccent}
              style={styles.actionButton}
            />
          </View>
        </Card>
      ))}

      {availableTasks.map((task) => (
        <Card key={task.id} bg={Colors.childCard}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          {task.description ? (
            <Text style={styles.taskDescription}>{task.description}</Text>
          ) : null}
          <View style={styles.cardFooter}>
            <Text style={styles.reward}>{task.reward} kr</Text>
            <Button
              label="Ta oppgave"
              onPress={() => handleTakeTask(task.id)}
              variant="primary"
              accentColor={Colors.childAccent}
              style={styles.actionButton}
            />
          </View>
        </Card>
      ))}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  taskTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.sm,
  },
  taskDescription: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  reward: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.childAccent,
  },
  actionButton: {
    paddingHorizontal: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: Spacing.sm,
  },
});

export default TasksScreen;
