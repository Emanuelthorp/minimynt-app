import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppContext } from '../store/AppContext';
import { Colors } from '../constants/tokens';
import AdultTabs from './AdultTabs';
import ChildTabs from './ChildTabs';
import RoleSelectScreen from '../screens/auth/RoleSelectScreen';
import PhoneScreen from '../screens/auth/PhoneScreen';
import OTPScreen from '../screens/auth/OTPScreen';

export type AuthStackParamList = {
  RoleSelect: undefined;
  Phone: { role: 'adult' | 'child' };
  OTP: { role: 'adult' | 'child'; phone: string };
};

const AuthStack = createStackNavigator<AuthStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="RoleSelect" component={RoleSelectScreen} />
      <AuthStack.Screen name="Phone" component={PhoneScreen} />
      <AuthStack.Screen name="OTP" component={OTPScreen} />
    </AuthStack.Navigator>
  );
}

export default function RootNavigator() {
  const { state, isLoading } = useAppContext();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.adultAccent} />
      </View>
    );
  }

  if (state.roleLock === 'adult') {
    return <AdultTabs />;
  }

  if (state.roleLock === 'child') {
    return <ChildTabs />;
  }

  return <AuthNavigator />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.adultBg,
  },
});
