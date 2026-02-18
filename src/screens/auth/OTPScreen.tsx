import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../../constants/tokens';
import { useAppContext } from '../../store/AppContext';
import { AuthStackParamList } from '../../navigation/RootNavigator';

type OTPNavigationProp = StackNavigationProp<AuthStackParamList, 'OTP'>;
type OTPRouteProp = RouteProp<AuthStackParamList, 'OTP'>;

type Props = {
  navigation: OTPNavigationProp;
  route: OTPRouteProp;
};

const VALID_OTP = '1234';

export default function OTPScreen({ navigation, route }: Props) {
  const { role, phone } = route.params;
  const { dispatch } = useAppContext();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const isAdult = role === 'adult';
  const bg = isAdult ? Colors.adultBg : Colors.childBg;
  const cardBg = isAdult ? Colors.adultCard : Colors.childCard;
  const accentColor = isAdult ? Colors.adultAccent : Colors.childAccent;

  function handleConfirm() {
    setError('');

    if (code !== VALID_OTP) {
      setError('Feil kode. Prøv igjen.');
      return;
    }

    if (role === 'adult') {
      dispatch({ type: 'SET_ADULT_PHONE', payload: phone });
      dispatch({ type: 'SET_ROLE_LOCK', payload: 'adult' });
    } else {
      dispatch({ type: 'SET_CHILD_PHONE', payload: phone });
      dispatch({ type: 'SET_ROLE_LOCK', payload: 'child' });
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <View style={styles.headerSection}>
            <Text style={styles.title}>Bekreft mobilnummer</Text>
            <Text style={styles.phoneDisplay}>{phone}</Text>
          </View>

          <View style={[styles.formCard, { backgroundColor: cardBg }]}>
            <Text style={styles.label}>SMS-kode</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              maxLength={4}
              placeholder="••••"
              placeholderTextColor={Colors.textMuted}
              value={code}
              onChangeText={(text) => {
                setCode(text);
                setError('');
              }}
              returnKeyType="done"
              secureTextEntry={false}
              textAlign="center"
            />

            {error.length > 0 && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <TouchableOpacity
              style={[styles.button, { backgroundColor: accentColor }]}
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Bekreft</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.backLink}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backLinkText}>Tilbake</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    justifyContent: 'space-between',
    paddingBottom: Spacing.xl,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  phoneDisplay: {
    fontSize: FontSize.lg,
    color: Colors.textMuted,
    textAlign: 'center',
    letterSpacing: 2,
  },
  formCard: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  label: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
    fontWeight: FontWeight.medium,
  },
  input: {
    backgroundColor: Colors.adultBg,
    color: Colors.text,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSize.xxl,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    letterSpacing: 8,
  },
  errorText: {
    fontSize: FontSize.sm,
    color: Colors.danger,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  button: {
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  buttonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  backLink: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  backLinkText: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textDecorationLine: 'underline',
  },
});
