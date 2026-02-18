import React from 'react';
import { Text, View, Alert, StyleSheet } from 'react-native';
import { Colors, FontSize, FontWeight, Spacing } from '../../constants/tokens';
import { useAppContext } from '../../store/AppContext';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import Button from '../../components/Button';

const ProfileScreen: React.FC = () => {
  const { state } = useAppContext();
  const childPhone = state.childPhone ?? '';

  const child = state.children.find((c) => c.phone === childPhone) ?? null;

  const myTasks = state.tasks.filter((t) => t.takenBy === childPhone);
  const takenCount = myTasks.length;
  const doneCount = myTasks.filter((t) =>
    ['Godkjent', 'Betalt'].includes(t.status)
  ).length;
  const totalEarned = myTasks
    .filter((t) => t.status === 'Betalt')
    .reduce((sum, t) => sum + t.reward, 0);

  const handleLogout = () => {
    Alert.alert(
      'Rollen er låst',
      'Rollen din er permanent. Kontakt kundeservice for å nullstille kontoen.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  if (!child) {
    return (
      <ScreenContainer bg={Colors.childBg}>
        <Text style={styles.screenTitle}>Profil</Text>
        <Card bg={Colors.childCard}>
          <Text style={styles.notFoundText}>Profil ikke funnet</Text>
        </Card>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer bg={Colors.childBg}>
      <Text style={styles.screenTitle}>Profil</Text>

      <View style={styles.avatarSection}>
        <Text style={styles.avatarEmoji}>{child.avatarEmoji}</Text>
        <Text style={styles.childName}>{child.name}</Text>
        <Text style={styles.childPhone}>{child.phone}</Text>
      </View>

      <Card bg={Colors.childCard} style={styles.statsCard}>
        <Text style={styles.statsHeading}>Statistikk</Text>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Oppgaver tatt</Text>
          <Text style={styles.statValue}>{takenCount}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Oppgaver ferdig</Text>
          <Text style={styles.statValue}>{doneCount}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total tjent</Text>
          <Text style={[styles.statValue, styles.earnedValue]}>
            {totalEarned} kr
          </Text>
        </View>
      </Card>

      <Button
        label="Logg ut"
        onPress={handleLogout}
        variant="danger"
        style={styles.logoutButton}
      />
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  avatarEmoji: {
    fontSize: 72,
    marginBottom: Spacing.sm,
  },
  childName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  childPhone: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.regular,
    color: Colors.textMuted,
  },
  statsCard: {
    marginBottom: Spacing.md,
  },
  statsHeading: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  statLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.regular,
    color: Colors.textMuted,
  },
  statValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  earnedValue: {
    color: Colors.childAccent,
    fontSize: FontSize.lg,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  logoutButton: {
    marginTop: Spacing.sm,
  },
  notFoundText: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: Spacing.sm,
  },
});

export default ProfileScreen;
