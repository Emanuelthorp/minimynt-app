import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../constants/tokens';
import { useAppContext } from '../../store/AppContext';

const APP_VERSION = '1.0.0';

export default function ProfileScreen() {
  const { state, dispatch } = useAppContext();
  const { adultPhone, ledger, children, tasks } = state;

  function handleLogout() {
    Alert.alert(
      'Logg ut',
      'Er du sikker på at du vil logge ut? All data vil bli tilbakestilt.',
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Logg ut',
          style: 'destructive',
          onPress: () => dispatch({ type: 'RESET_STATE' }),
        },
      ]
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profil</Text>
      </View>

      {/* Account info */}
      <Text style={styles.sectionLabel}>Konto</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Telefon</Text>
          <Text style={styles.rowValue}>{adultPhone ?? 'Ikke satt'}</Text>
        </View>
        <View style={[styles.row, styles.rowLast]}>
          <Text style={styles.rowLabel}>Rolle</Text>
          <Text style={styles.rowValue}>Foresatt</Text>
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logg ut</Text>
      </TouchableOpacity>

      {/* About */}
      <Text style={styles.sectionLabel}>Om MiniMynt</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Versjon</Text>
          <Text style={styles.rowValue}>{APP_VERSION}</Text>
        </View>
        <View style={[styles.row, styles.rowLast]}>
          <Text style={styles.rowLabel}>Gebyr</Text>
          <Text style={styles.rowValue}>0,1% av utbetalinger</Text>
        </View>
        <View style={styles.feeExplanation}>
          <Text style={styles.feeExplanationText}>
            MiniMynt tar 0,1% gebyr av utbetalinger. Gebyret bidrar til drift og
            videreutvikling av appen. Du betaler aldri mer enn hva du faktisk betaler
            ut til barna dine.
          </Text>
        </View>
      </View>

      {/* Developer / debug section */}
      <Text style={styles.sectionLabel}>Utviklerinfo</Text>
      <View style={styles.devCard}>
        <Text style={styles.devTitle}>Tilstand (state.ledger)</Text>
        <View style={styles.devRow}>
          <Text style={styles.devKey}>month</Text>
          <Text style={styles.devValue}>{ledger.month}</Text>
        </View>
        <View style={styles.devRow}>
          <Text style={styles.devKey}>paidOutThisMonth</Text>
          <Text style={styles.devValue}>{ledger.paidOutThisMonth} kr</Text>
        </View>
        <View style={styles.devRow}>
          <Text style={styles.devKey}>feeDue</Text>
          <Text style={styles.devValue}>{ledger.feeDue.toFixed(4)} kr</Text>
        </View>

        <View style={styles.devDivider} />

        <Text style={styles.devTitle}>App-statistikk</Text>
        <View style={styles.devRow}>
          <Text style={styles.devKey}>Antall barn</Text>
          <Text style={styles.devValue}>{children.length}</Text>
        </View>
        <View style={styles.devRow}>
          <Text style={styles.devKey}>Antall oppgaver</Text>
          <Text style={styles.devValue}>{tasks.length}</Text>
        </View>
        <View style={styles.devRow}>
          <Text style={styles.devKey}>Ledig</Text>
          <Text style={styles.devValue}>{tasks.filter((t) => t.status === 'Ledig').length}</Text>
        </View>
        <View style={styles.devRow}>
          <Text style={styles.devKey}>Tatt</Text>
          <Text style={styles.devValue}>{tasks.filter((t) => t.status === 'Tatt').length}</Text>
        </View>
        <View style={styles.devRow}>
          <Text style={styles.devKey}>Ferdig</Text>
          <Text style={styles.devValue}>{tasks.filter((t) => t.status === 'Ferdig').length}</Text>
        </View>
        <View style={styles.devRow}>
          <Text style={styles.devKey}>Godkjent</Text>
          <Text style={styles.devValue}>{tasks.filter((t) => t.status === 'Godkjent').length}</Text>
        </View>
        <View style={styles.devRow}>
          <Text style={styles.devKey}>Avvist</Text>
          <Text style={styles.devValue}>{tasks.filter((t) => t.status === 'Avvist').length}</Text>
        </View>
        <View style={styles.devRow}>
          <Text style={styles.devKey}>Betalt</Text>
          <Text style={styles.devValue}>{tasks.filter((t) => t.status === 'Betalt').length}</Text>
        </View>
      </View>

      <View style={{ height: Spacing.xl }} />
    </ScrollView>
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
    marginTop: Spacing.md,
  },
  card: {
    backgroundColor: Colors.adultCard,
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
  },
  rowValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.text,
    textAlign: 'right',
    flex: 1,
    marginLeft: Spacing.md,
  },
  feeExplanation: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  feeExplanationText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  logoutButton: {
    backgroundColor: Colors.danger,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  logoutButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  // Developer card — light gray tinted
  devCard: {
    backgroundColor: '#1E2D3E',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  devTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
  devRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  devKey: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontFamily: undefined,
  },
  devValue: {
    fontSize: FontSize.sm,
    color: Colors.adultAccent,
    fontWeight: FontWeight.medium,
  },
  devDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
});
