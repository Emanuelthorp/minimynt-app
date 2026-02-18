import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../constants/tokens';
import { useAppContext } from '../../store/AppContext';
import { TaskStatus } from '../../store/types';

const STATUS_LABELS: { status: TaskStatus; label: string }[] = [
  { status: 'Ledig', label: 'Ledig' },
  { status: 'Tatt', label: 'Tatt' },
  { status: 'Ferdig', label: 'Ferdig / venter godkjenning' },
  { status: 'Godkjent', label: 'Godkjent' },
  { status: 'Betalt', label: 'Betalt' },
];

export default function HomeScreen() {
  const { state } = useAppContext();
  const { ledger, tasks, adultPhone } = state;

  const countByStatus = (status: TaskStatus): number =>
    tasks.filter((t) => t.status === status).length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Oversikt</Text>
        {adultPhone ? (
          <Text style={styles.subtitle}>Logget inn som {adultPhone}</Text>
        ) : null}
      </View>

      {/* Ledger cards */}
      <Text style={styles.sectionLabel}>Økonomi denne måneden</Text>
      <View style={styles.row}>
        <View style={[styles.card, styles.cardHalf]}>
          <Text style={styles.cardLabel}>Utbetalt denne måneden</Text>
          <Text style={styles.cardValue}>{ledger.paidOutThisMonth} kr</Text>
          <Text style={styles.cardSub}>{ledger.month}</Text>
        </View>
        <View style={[styles.card, styles.cardHalf]}>
          <Text style={styles.cardLabel}>Gebyr påløpt</Text>
          <Text style={[styles.cardValue, styles.feeValue]}>
            {ledger.feeDue.toFixed(2)} kr
          </Text>
          <Text style={styles.cardSub}>0,1% av utbetalinger</Text>
        </View>
      </View>

      {/* Task status counts */}
      <Text style={styles.sectionLabel}>Oppgavestatus</Text>
      <View style={styles.card}>
        {STATUS_LABELS.map(({ status, label }) => (
          <View key={status} style={styles.statusRow}>
            <Text style={styles.statusLabel}>{label}</Text>
            <View style={[styles.badge, getBadgeStyle(status)]}>
              <Text style={styles.badgeText}>{countByStatus(status)}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Total tasks */}
      <View style={styles.card}>
        <View style={styles.statusRow}>
          <Text style={[styles.statusLabel, styles.bold]}>Totalt oppgaver</Text>
          <View style={[styles.badge, { backgroundColor: Colors.adultAccent }]}>
            <Text style={styles.badgeText}>{tasks.length}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function getBadgeStyle(status: TaskStatus): { backgroundColor: string } {
  switch (status) {
    case 'Ledig':
      return { backgroundColor: Colors.adultAccent };
    case 'Tatt':
      return { backgroundColor: Colors.warning };
    case 'Ferdig':
      return { backgroundColor: Colors.warning };
    case 'Godkjent':
      return { backgroundColor: Colors.success };
    case 'Avvist':
      return { backgroundColor: Colors.danger };
    case 'Betalt':
      return { backgroundColor: Colors.textMuted };
    default:
      return { backgroundColor: Colors.textMuted };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.adultBg,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
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
  sectionLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.adultCard,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  cardHalf: {
    flex: 1,
  },
  cardLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
    fontWeight: FontWeight.medium,
  },
  cardValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  feeValue: {
    color: Colors.warning,
  },
  cardSub: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statusLabel: {
    fontSize: FontSize.md,
    color: Colors.text,
  },
  bold: {
    fontWeight: FontWeight.semibold,
  },
  badge: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
  },
  badgeText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
});
