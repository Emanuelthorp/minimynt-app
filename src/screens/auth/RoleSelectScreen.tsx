import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../../constants/tokens';
import { AuthStackParamList } from '../../navigation/RootNavigator';

type RoleSelectNavigationProp = StackNavigationProp<AuthStackParamList, 'RoleSelect'>;

type Props = {
  navigation: RoleSelectNavigationProp;
};

export default function RoleSelectScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>MiniMynt</Text>
          <Text style={styles.subtitle}>Familiens sparekonto</Text>
        </View>

        <View style={styles.cardsSection}>
          <TouchableOpacity
            style={[styles.card, styles.adultCard]}
            onPress={() => navigation.navigate('Phone', { role: 'adult' })}
            activeOpacity={0.8}
          >
            <Text style={styles.cardIcon}>👨‍👩‍👧</Text>
            <Text style={styles.cardTitle}>Jeg er forelder</Text>
            <Text style={styles.cardSubtitle}>Administrer familien</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.childCard]}
            onPress={() => navigation.navigate('Phone', { role: 'child' })}
            activeOpacity={0.8}
          >
            <Text style={styles.cardIcon}>🧒</Text>
            <Text style={styles.cardTitle}>Jeg er barn</Text>
            <Text style={styles.cardSubtitle}>Se oppgaver og saldo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.warningSection}>
          <Text style={styles.warningText}>⚠️ Rolleval er permanent.</Text>
          <Text style={styles.footnoteText}>Kontakt kundeservice for nullstilling.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.adultBg,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'space-between',
    paddingVertical: Spacing.xl,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
  },
  cardsSection: {
    gap: Spacing.md,
  },
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  adultCard: {
    backgroundColor: Colors.adultCard,
  },
  childCard: {
    backgroundColor: Colors.childCard,
  },
  cardIcon: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  cardSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  warningSection: {
    alignItems: 'center',
    paddingBottom: Spacing.md,
  },
  warningText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.danger,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  footnoteText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
