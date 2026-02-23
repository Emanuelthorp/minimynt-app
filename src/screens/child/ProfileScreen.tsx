import React from 'react';
import { Text, View, Alert, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Colors, FontSize, FontWeight, FontFamily,
  Spacing, Layout, LineHeight, Radius, Elevation,
} from '../../constants/tokens';
import { useAppContext } from '../../store/AppContext';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ListRow from '../../components/ListRow';
import EmptyState from '../../components/EmptyState';
import ProgressBar from '../../components/ProgressBar';
import StatCard from '../../components/StatCard';

export default function ProfileScreen() {
  const { state, logout } = useAppContext();
  const childPhone = state.childPhone ?? '';

  const child = state.children.find((c) => c.phone === childPhone) ?? null;

  const myTasks = state.tasks.filter((t) => t.takenBy === childPhone);
  const takenCount  = myTasks.length;
  const doneCount   = myTasks.filter((t) => ['Godkjent', 'Betalt'].includes(t.status)).length;
  const totalEarned = myTasks.filter((t) => t.status === 'Betalt').reduce((s, t) => s + t.reward, 0);
  const pendingKr   = myTasks.filter((t) => t.status === 'Godkjent').reduce((s, t) => s + t.reward, 0);

  const completionRate = takenCount > 0 ? Math.round((doneCount / takenCount) * 100) : 0;

  const handleLogout = () => {
    Alert.alert(
      'Logg ut',
      'Er du sikker? Du sendes tilbake til start.',
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Logg ut',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  if (!child) {
    return (
      <ScreenContainer bg={Colors.bgPrimary}>
        <ScreenHeader title="Min profil" />
        <Card>
          <EmptyState
            icon="user-x"
            title="Profil ikke funnet"
            subtitle="Kontakt forelder for å bli registrert."
            accentColor={Colors.brand}
          />
        </Card>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer bg={Colors.bgPrimary}>
      <ScreenHeader title="Min profil" />

      {/* Profile identity card */}
      <Animated.View entering={FadeInDown.duration(300)}>
        <View style={styles.profileCard}>
          {/* Avatar */}
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarEmoji}>{child.avatarEmoji}</Text>
          </View>
          {/* Name + phone */}
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{child.name}</Text>
            <Text style={styles.profilePhone}>{child.phone}</Text>
          </View>
          {/* Earned badge */}
          <View style={styles.earnedBadge}>
            <Text style={styles.earnedBadgeValue}>{totalEarned} kr</Text>
            <Text style={styles.earnedBadgeLabel}>tjent</Text>
          </View>
        </View>
      </Animated.View>

      {/* Stats row */}
      <Animated.View
        entering={FadeInDown.delay(60).duration(300)}
        style={styles.statsRow}
      >
        <StatCard
          label="Oppgaver tatt"
          value={takenCount}
          icon="list"
          accent={Colors.adultPrimary}
        />
        <StatCard
          label="Fullført"
          value={doneCount}
          icon="check-circle"
          accent={Colors.statusSuccess}
        />
      </Animated.View>

      {/* Completion progress */}
      {takenCount > 0 && (
        <Animated.View entering={FadeInDown.delay(120).duration(300)}>
          <Card variant="outlined">
            <ProgressBar
              value={completionRate}
              color={Colors.brand}
              trackColor={Colors.borderDefault}
              label="Fullføringsgrad"
              sublabel={`${doneCount} av ${takenCount} oppgaver fullført`}
              height={6}
            />
          </Card>
        </Animated.View>
      )}

      {/* Pending payout */}
      {pendingKr > 0 && (
        <Animated.View entering={FadeInDown.delay(180).duration(300)}>
          <Card>
            <ListRow
              title="Venter på Vipps"
              right={
                <Text style={styles.pendingAmount}>{pendingKr} kr</Text>
              }
              showDivider={false}
            />
          </Card>
        </Animated.View>
      )}

      <Button
        label="Logg ut"
        onPress={handleLogout}
        variant="danger"
        style={styles.logoutButton}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    ...Elevation.md,
  },
  avatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.brandSurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm2,
  },
  avatarEmoji: {
    fontSize: 30,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: FontSize.heading,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    lineHeight: LineHeight.loose,
  },
  profilePhone: {
    fontSize: FontSize.label,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    lineHeight: LineHeight.tight,
    marginTop: 1,
  },
  earnedBadge: {
    alignItems: 'center',
    backgroundColor: Colors.brandSurface,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm2,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderBrand,
  },
  earnedBadgeValue: {
    fontSize: FontSize.body,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    color: Colors.brand,
    lineHeight: LineHeight.normal,
  },
  earnedBadgeLabel: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.regular,
    color: Colors.brandDeep,
    lineHeight: LineHeight.tight,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  pendingAmount: {
    fontSize: FontSize.body,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    color: Colors.brand,
    lineHeight: LineHeight.normal,
  },
  logoutButton: {
    marginTop: Layout.sectionGap,
  },
});
