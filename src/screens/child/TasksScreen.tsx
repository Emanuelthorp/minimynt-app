import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Animated, { FadeInDown, SlideInRight } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import {
  Colors, FontSize, FontWeight, FontFamily,
  Spacing, Layout, LineHeight, Radius, Elevation,
} from '../../constants/tokens';
import { useAppContext } from '../../store/AppContext';
import { isTaskExpired } from '../../store/types';
import ScreenContainer from '../../components/ScreenContainer';
import Card from '../../components/Card';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import EarningsHero from '../../components/EarningsHero';
import ProgressBar from '../../components/ProgressBar';
import { SkeletonBlock } from '../../components/SkeletonLoader';

function TasksScreenSkeleton() {
  return (
    <View>
      {/* EarningsHero placeholder */}
      <SkeletonBlock width="100%" height={100} borderRadius={16} style={styles.skeletonHero} />
      {/* 2 task cards */}
      <SkeletonBlock width="100%" height={80} style={styles.skeletonCard} />
      <SkeletonBlock width="100%" height={80} style={styles.skeletonCard} />
    </View>
  );
}

export default function TasksScreen() {
  const { state, dispatch, isLoading } = useAppContext();
  const childPhone = state.childPhone ?? '';

  // Keep skeleton visible for at least 800ms
  const [showSkeleton, setShowSkeleton] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setShowSkeleton(true);
    } else {
      const timer = setTimeout(() => setShowSkeleton(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const handleTakeTask = (taskId: string) => {
    dispatch({ type: 'TAKE_TASK', payload: { taskId, childPhone } });
  };

  const handleCompleteTask = (taskId: string) => {
    dispatch({ type: 'COMPLETE_TASK', payload: taskId });
  };

  if (showSkeleton) {
    return (
      <ScreenContainer bg={Colors.bgPrimary}>
        <TasksScreenSkeleton />
      </ScreenContainer>
    );
  }

  const myTasks = state.tasks.filter((t) => t.takenBy === childPhone);
  const totalEarned = myTasks
    .filter((t) => t.status === 'Betalt')
    .reduce((sum, t) => sum + t.reward, 0);
  const pendingEarnings = myTasks
    .filter((t) => t.status === 'Godkjent')
    .reduce((sum, t) => sum + t.reward, 0);
  const completedCount = myTasks.filter((t) =>
    ['Godkjent', 'Betalt'].includes(t.status)
  ).length;

  const availableTasks = state.tasks.filter(
    (t) => t.status === 'Ledig' && !isTaskExpired(t)
  );
  const myTakenTasks = state.tasks.filter(
    (t) => t.status === 'Tatt' && t.takenBy === childPhone && !isTaskExpired(t)
  );
  const hasAnyTasks = availableTasks.length > 0 || myTakenTasks.length > 0;

  // Progress toward next milestone (every 100 kr)
  const milestoneSize = 100;
  const progress = totalEarned > 0
    ? ((totalEarned % milestoneSize) / milestoneSize) * 100
    : 0;
  const nextMilestone = Math.ceil((totalEarned + 1) / milestoneSize) * milestoneSize;

  const heroSublabel = pendingEarnings > 0
    ? `+ ${pendingEarnings} kr venter`
    : completedCount > 0
    ? `${completedCount} oppgaver fullført`
    : 'Fullfør oppgaver for å tjene';

  return (
    <ScreenContainer bg={Colors.bgPrimary}>
      {/* Earnings hero — white card, green amount only */}
      <Animated.View entering={FadeInDown.duration(400)}>
        <EarningsHero
          amount={totalEarned}
          label="Totalt tjent"
          sublabel={heroSublabel}
          badge={completedCount > 0 ? `${completedCount} fullført` : undefined}
        />
      </Animated.View>

      {/* Progress to next milestone */}
      {(totalEarned > 0 || myTakenTasks.length > 0) && (
        <Animated.View entering={FadeInDown.delay(60).duration(300)}>
          <Card variant="outlined" style={styles.progressCard}>
            <ProgressBar
              value={progress}
              color={Colors.brand}
              trackColor={Colors.borderDefault}
              label={`Mot ${nextMilestone} kr`}
              sublabel={`${totalEarned} av ${nextMilestone} kr`}
              height={6}
            />
          </Card>
        </Animated.View>
      )}

      {/* My taken tasks */}
      {myTakenTasks.length > 0 && (
        <Text style={styles.sectionTitle}>Dine oppgaver</Text>
      )}
      {myTakenTasks.map((task, index) => (
        <Animated.View
          key={task.id}
          entering={SlideInRight.delay(index * 60).duration(280).springify()}
        >
          <Card style={styles.taskCard}>
            <View style={styles.taskTop}>
              {/* Reward badge — brand green pill, white text */}
              <View style={styles.rewardBadge}>
                <Text style={styles.rewardBadgeText}>{task.reward} kr</Text>
              </View>
              {/* "Din oppgave" chip — navy */}
              <View style={styles.statusChip}>
                <Feather name="clock" size={11} color={Colors.adultPrimary} />
                <Text style={styles.statusChipText}>Din oppgave</Text>
              </View>
            </View>
            <Text style={styles.taskTitle}>{task.title}</Text>
            {task.description ? (
              <Text style={styles.taskDesc}>{task.description}</Text>
            ) : null}
            <Button
              label="Meld ferdig"
              onPress={() => handleCompleteTask(task.id)}
              accentColor={Colors.brand}
              style={styles.taskBtn}
            />
          </Card>
        </Animated.View>
      ))}

      {/* Available tasks */}
      {availableTasks.length > 0 && (
        <Text style={[styles.sectionTitle, myTakenTasks.length > 0 && styles.sectionTitleGap]}>
          Ledige oppgaver
        </Text>
      )}
      {availableTasks.map((task, index) => (
        <Animated.View
          key={task.id}
          entering={SlideInRight.delay((myTakenTasks.length + index) * 60).duration(280).springify()}
        >
          <Card style={styles.taskCard}>
            <View style={styles.taskTop}>
              {/* Reward chip — outlined neutral */}
              <View style={styles.rewardChipOutlined}>
                <Text style={styles.rewardChipOutlinedText}>{task.reward} kr</Text>
              </View>
            </View>
            <Text style={styles.taskTitle}>{task.title}</Text>
            {task.description ? (
              <Text style={styles.taskDesc}>{task.description}</Text>
            ) : null}
            <Button
              label="Ta oppgave"
              onPress={() => handleTakeTask(task.id)}
              accentColor={Colors.brand}
              variant="secondary"
              style={styles.taskBtn}
            />
          </Card>
        </Animated.View>
      ))}

      {!hasAnyTasks && (
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Card>
            <EmptyState
              icon="clipboard"
              title="Ingen oppgaver tilgjengelig"
              subtitle="Forelder legger til oppgaver du kan ta. Sjekk tilbake snart!"
              accentColor={Colors.brand}
            />
          </Card>
        </Animated.View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  skeletonHero: {
    marginBottom: Layout.cardGap,
  },
  skeletonCard: {
    marginBottom: 8,
  },
  progressCard: {
    marginBottom: Layout.cardGap,
  },
  sectionTitle: {
    fontSize: FontSize.label,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.semibold,
    color: Colors.textSecondary,
    letterSpacing: 0.3,
    lineHeight: LineHeight.tight,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  sectionTitleGap: {
    marginTop: Spacing.xl,
  },
  taskCard: {
    marginBottom: Spacing.sm,
  },
  taskTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  rewardBadge: {
    backgroundColor: Colors.brand,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  rewardBadgeText: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    color: Colors.textInverse,
  },
  rewardChipOutlined: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  rewardChipOutlinedText: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.semibold,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.adultSurface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  statusChipText: {
    fontSize: FontSize.caption,
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight.medium,
    color: Colors.adultPrimary,
    lineHeight: LineHeight.tight,
  },
  taskTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.semibold,
    color: Colors.textPrimary,
    lineHeight: LineHeight.normal,
    marginBottom: Spacing.xs,
  },
  taskDesc: {
    fontSize: FontSize.label,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    lineHeight: LineHeight.normal,
    marginBottom: Spacing.sm,
  },
  taskBtn: {
    marginTop: Spacing.sm,
  },
});
