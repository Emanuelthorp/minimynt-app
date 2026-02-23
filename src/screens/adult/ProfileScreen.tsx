import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import {
  Colors,
  FontSize,
  FontWeight,
  FontFamily,
  Spacing,
  LineHeight,
  Layout,
} from '../../constants/tokens';
import { useAppContext } from '../../store/AppContext';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ListRow from '../../components/ListRow';
import PiggyLogo from '../../components/PiggyLogo';

const APP_VERSION = '1.0.0';

export default function ProfileScreen() {
  const { state, logout } = useAppContext();
  const { adultPhone } = state;

  function handleLogout() {
    Alert.alert(
      'Logg ut',
      'Er du sikker? All lokal data slettes.',
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Logg ut',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  }

  return (
    <ScreenContainer bg={Colors.bgPrimary}>
      <ScreenHeader
        title="Profil"
        right={<PiggyLogo size={32} color={Colors.adultPrimary} />}
      />

      {/* ── Konto ── */}
      <Text style={styles.sectionLabel}>Konto</Text>
      <Card elevation="md">
        <ListRow
          title="Telefon"
          right={<Text style={styles.rowValue}>{adultPhone ?? '—'}</Text>}
        />
        <ListRow
          title="Rolle"
          right={<Text style={styles.rowValue}>Foresatt</Text>}
          showDivider={false}
        />
      </Card>

      <Button
        label="Logg ut"
        onPress={handleLogout}
        variant="danger"
        style={styles.logoutButton}
      />

      {/* ── Om MiniMynt ── */}
      <Text style={styles.sectionLabel}>Om MiniMynt</Text>
      <Card elevation="md">
        <ListRow
          title="Versjon"
          right={<Text style={styles.rowValue}>{APP_VERSION}</Text>}
        />
        <ListRow
          title="Plattformgebyr"
          right={<Text style={styles.rowValue}>0,5 %</Text>}
          showDivider={false}
        />
        <View style={styles.feeNote}>
          <Text style={styles.feeNoteText}>
            MiniMynt tar 0,5 % av utbetalinger via Vipps. Gebyret bidrar til drift
            og videreutvikling av tjenesten.
          </Text>
        </View>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: FontSize.label,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.semibold,
    color: Colors.textSecondary,
    letterSpacing: 0.3,
    lineHeight: LineHeight.tight,
    marginBottom: Spacing.sm,
    marginTop: Layout.sectionGap,
  },
  rowValue: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.medium,
    fontFamily: FontFamily.medium,
    color: Colors.textPrimary,
    lineHeight: LineHeight.normal,
  },
  logoutButton: {
    marginTop: 24,
    marginBottom: Spacing.sm,
  },
  feeNote: {
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    marginTop: Spacing.xs,
  },
  feeNoteText: {
    fontSize: FontSize.label,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    lineHeight: LineHeight.normal,
  },
});
