import React from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppContext } from '../store/AppContext';
import { Colors, FontSize, FontFamily, FontWeight, Spacing, Radius } from '../constants/tokens';
import AdultTabs from './AdultTabs';
import ChildTabs from './ChildTabs';
import LandingScreen from '../screens/landing/LandingScreen';
import RoleSelectScreen from '../screens/auth/RoleSelectScreen';
import PhoneScreen from '../screens/auth/PhoneScreen';
import OTPScreen from '../screens/auth/OTPScreen';

export type AuthStackParamList = {
  Landing: undefined;
  RoleSelect: undefined;
  Phone: { role: 'adult' | 'child' };
  OTP: { role: 'adult' | 'child'; phone: string };
};

const AuthStack = createStackNavigator<AuthStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: Colors.bgPrimary },
      }}
    >
      <AuthStack.Screen name="Landing" component={LandingScreen} />
      <AuthStack.Screen name="RoleSelect" component={RoleSelectScreen} />
      <AuthStack.Screen name="Phone" component={PhoneScreen} />
      <AuthStack.Screen name="OTP" component={OTPScreen} />
    </AuthStack.Navigator>
  );
}

/**
 * Dev-mode role switcher — only visible in __DEV__ or when no role is locked.
 * Lets you instantly jump into adult or child mode without OTP flow.
 * Remove or gate behind a flag before production.
 */
function DevRoleSwitcher() {
  const { state, logout, dispatch } = useAppContext();

  if (!__DEV__) return null;

  const switchTo = (role: 'adult' | 'child') => {
    const phone = role === 'adult' ? '99999999' : '88888888'; // DEV ONLY — fake phone numbers
    if (role === 'adult') {
      dispatch({ type: 'SET_ADULT_PHONE', payload: phone });
    } else {
      dispatch({ type: 'SET_CHILD_PHONE', payload: phone });
    }
    dispatch({ type: 'SET_ROLE_LOCK', payload: role });
  };

  return (
    <View style={devStyles.bar}>
      <Text style={devStyles.label}>DEV</Text>
      <TouchableOpacity
        style={[devStyles.btn, state.roleLock === 'adult' && devStyles.btnActive]}
        onPress={() => switchTo('adult')}
      >
        <Text style={devStyles.btnText}>Forelder</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[devStyles.btn, state.roleLock === 'child' && devStyles.btnActive]}
        onPress={() => switchTo('child')}
      >
        <Text style={devStyles.btnText}>Barn</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[devStyles.btn, devStyles.btnLogout]} onPress={() => logout()}>
        <Text style={devStyles.btnText}>Ut</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function RootNavigator() {
  const { state, isLoading, dispatch } = useAppContext();

  // DEV: ?boot=adult or ?boot=child in URL auto-logs in for screenshots
  React.useEffect(() => {
    if (!__DEV__ || Platform.OS !== 'web') return;
    const params = new URLSearchParams(window.location.search);
    const boot = params.get('boot');
    if (boot === 'adult' && !state.roleLock) {
      dispatch({ type: 'SET_ADULT_PHONE', payload: '99999999' });
      dispatch({ type: 'SET_ROLE_LOCK', payload: 'adult' });
    } else if (boot === 'child' && !state.roleLock) {
      dispatch({ type: 'SET_CHILD_PHONE', payload: '88888888' });
      dispatch({ type: 'SET_ROLE_LOCK', payload: 'child' });
    }
  }, [isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.adultPrimary} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        {state.roleLock === 'adult' && <AdultTabs />}
        {state.roleLock === 'child' && <ChildTabs />}
        {!state.roleLock && <AuthNavigator />}
      </View>
      <DevRoleSwitcher />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgSecondary,
  },
});

const devStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    gap: Spacing.xs,
    // Only show on web for easy testing
    ...(Platform.OS !== 'web' ? { display: 'none' } : {}),
  } as any,
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F59E0B',
    marginRight: Spacing.xs,
    letterSpacing: 1,
  },
  btn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.sm,
    backgroundColor: '#333',
  },
  btnActive: {
    backgroundColor: Colors.brand,
  },
  btnLogout: {
    backgroundColor: '#7f1d1d',
  },
  btnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
});
