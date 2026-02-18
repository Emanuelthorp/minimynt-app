import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Colors, FontSize, FontWeight, Spacing } from '../../constants/tokens';
import { useAppContext } from '../../store/AppContext';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import Badge from '../../components/Badge';

const WaitingScreen: React.FC = () => {
  const { state } = useAppContext();
  const childPhone = state.childPhone ?? '';

  const myTasks = state.tasks.filter((t) => t.takenBy === childPhone);

  const ferdigTasks = myTasks.filter((t) => t.status === 'Ferdig');
  const godkjentTasks = myTasks.filter((t) => t.status === 'Godkjent');
  const betaltTasks = myTasks.filter((t) => t.status === 'Betalt');

  const totalEarnedThisMonth = betaltTasks.reduce(
    (sum, t) => sum + t.reward,
    0
  );

  const hasAnyTasks =
    ferdigTasks.length > 0 ||
    godkjentTasks.length > 0 ||
    betaltTasks.length > 0;

  return (
    <ScreenContainer bg={Colors.childBg}>
      <Text style={styles.screenTitle}>Venter på betaling</Text>

      {!hasAnyTasks && (
        <Card bg={Colors.childCard}>
          <Text style={styles.emptyText}>
            Du har ingen oppgaver under behandling
          </Text>
        </Card>
      )}

      {ferdigTasks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Venter på godkjenning</Text>
          {ferdigTasks.map((task) => (
            <Card key={task.id} bg={Colors.childCard}>
              <View style={styles.cardRow}>
                <View style={styles.taskInfo}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.reward}>{task.reward} kr</Text>
                </View>
                <Badge label="Venter..." color={Colors.warning} />
              </View>
            </Card>
          ))}
        </View>
      )}

      {godkjentTasks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Godkjent, ikke betalt</Text>
          {godkjentTasks.map((task) => (
            <Card key={task.id} bg={Colors.childCard}>
              <View style={styles.cardRow}>
                <View style={styles.taskInfo}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.reward}>{task.reward} kr</Text>
                </View>
                <Badge label="Godkjent ✓" color={Colors.success} />
              </View>
            </Card>
          ))}
        </View>
      )}

      {betaltTasks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Utbetalt</Text>
          {betaltTasks.map((task) => (
            <Card key={task.id} bg={Colors.childCard}>
              <View style={styles.cardRow}>
                <View style={styles.taskInfo}>
                  <Text style={[styles.taskTitle, styles.dimText]}>
                    {task.title}
                  </Text>
                  <Text style={[styles.reward, styles.dimText]}>
                    {task.reward} kr
                  </Text>
                </View>
                <Badge label="Betalt ✓" color={Colors.textMuted} />
              </View>
            </Card>
          ))}
        </View>
      )}

      {betaltTasks.length > 0 && (
        <Card bg={Colors.childCard} style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total tjent denne måneden</Text>
          <Text style={styles.summaryAmount}>{totalEarnedThisMonth} kr</Text>
        </Card>
      )}
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
  section: {
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  taskTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  reward: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.childAccent,
  },
  dimText: {
    opacity: 0.6,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: Spacing.sm,
  },
  summaryCard: {
    marginTop: Spacing.sm,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  summaryAmount: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.childAccent,
  },
});

export default WaitingScreen;
