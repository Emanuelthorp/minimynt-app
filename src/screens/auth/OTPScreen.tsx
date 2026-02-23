import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import {
  Colors,
  Spacing,
  Radius,
  FontSize,
  FontWeight,
  FontFamily,
  LineHeight,
  Layout,
} from '../../constants/tokens';
import { useAppContext } from '../../store/AppContext';
import { AuthStackParamList } from '../../navigation/RootNavigator';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Feather } from '@expo/vector-icons';

type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'OTP'>;
  route: RouteProp<AuthStackParamList, 'OTP'>;
};

const VALID_OTP = '1234';

export default function OTPScreen({ navigation, route }: Props) {
  const { role, phone } = route.params;
  const { dispatch } = useAppContext();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const isAdult = role === 'adult';
  const accentColor = isAdult ? Colors.adultPrimary : Colors.brand;
  const chipBg = isAdult ? Colors.adultSurface : Colors.brandSurface;

  function handleConfirm() {
    setError('');

    if (code !== VALID_OTP) {
      setError('Feil kode. Prøv igjen. (Demo-kode: 1234)');
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerSection}>
            <View style={[styles.phoneChip, { backgroundColor: chipBg }]}>
              <Feather name="smartphone" size={14} color={accentColor} />
              <Text style={[styles.phoneDisplay, { color: accentColor }]}>{phone}</Text>
            </View>
            <Text style={styles.title}>Bekreft mobilnummer</Text>
            <Text style={styles.hint}>
              Vi har sendt en 4-sifret kode via SMS til ditt nummer.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            <Input
              label="SMS-kode"
              placeholder="• • • •"
              value={code}
              onChangeText={(text) => {
                setCode(text);
                setError('');
              }}
              accentColor={accentColor}
              keyboardType="numeric"
              maxLength={4}
              returnKeyType="done"
              onSubmitEditing={handleConfirm}
              style={styles.codeInput}
            />

            {error.length > 0 && (
              <View style={styles.errorRow}>
                <Feather name="alert-circle" size={13} color={Colors.statusDanger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Button
              label="Bekreft"
              onPress={handleConfirm}
              accentColor={accentColor}
              disabled={code.length === 0}
              style={styles.confirmButton}
            />
          </View>

          {/* Back link */}
          <TouchableOpacity
            style={styles.backLink}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backLinkText}>← Tilbake</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    justifyContent: 'space-between',
    maxWidth: Layout.appMaxWidth,
    width: '100%',
    alignSelf: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  phoneChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    marginBottom: Spacing.lg,
  },
  phoneDisplay: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.semibold,
    letterSpacing: 1,
  },
  title: {
    fontSize: FontSize.title,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    lineHeight: LineHeight.loose,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  hint: {
    fontSize: FontSize.label,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: LineHeight.normal,
    maxWidth: 260,
  },
  formSection: {
    gap: Spacing.sm,
  },
  codeInput: {
    textAlign: 'center',
    fontSize: FontSize.display,
    fontFamily: FontFamily.bold,
    letterSpacing: 12,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    justifyContent: 'center',
  },
  errorText: {
    fontSize: FontSize.label,
    fontFamily: FontFamily.regular,
    color: Colors.statusDanger,
    lineHeight: LineHeight.tight,
    textAlign: 'center',
  },
  confirmButton: {
    marginTop: Spacing.xs,
  },
  backLink: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  backLinkText: {
    fontSize: FontSize.body,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    lineHeight: LineHeight.normal,
  },
});
