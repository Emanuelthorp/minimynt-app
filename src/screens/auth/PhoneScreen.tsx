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
import { Feather } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import {
  Colors,
  Spacing,
  FontSize,
  FontWeight,
  FontFamily,
  LineHeight,
  Layout,
  Radius,
} from '../../constants/tokens';
import { useAppContext } from '../../store/AppContext';
import { AuthStackParamList } from '../../navigation/RootNavigator';
import Input from '../../components/Input';
import Button from '../../components/Button';

type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'Phone'>;
  route: RouteProp<AuthStackParamList, 'Phone'>;
};

export default function PhoneScreen({ navigation, route }: Props) {
  const { role } = route.params;
  const { state } = useAppContext();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const isAdult = role === 'adult';
  const accentColor = isAdult ? Colors.adultPrimary : Colors.brand;
  const surfaceColor = isAdult ? Colors.adultSurface : Colors.brandSurface;

  function handleSend() {
    setError('');

    if (phone.length !== 8 || !/^\d{8}$/.test(phone)) {
      setError('Mobilnummeret må ha 8 siffer.');
      return;
    }

    if (role === 'child') {
      const found = state.children.some((child) => child.phone === phone);
      if (!found) {
        setError('Ikke registrert barn. Be forelder registrere deg først.');
        return;
      }
    }

    navigation.navigate('OTP', { role, phone });
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: Colors.bgPrimary }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={20} color={Colors.textSecondary} />
            <Text style={styles.backButtonText}>Tilbake</Text>
          </TouchableOpacity>

          {/* Role indicator */}
          <View style={[styles.roleIndicator, { backgroundColor: surfaceColor }]}>
            <Feather
              name={isAdult ? 'users' : 'user'}
              size={16}
              color={accentColor}
            />
            <Text style={[styles.roleLabel, { color: accentColor }]}>
              {isAdult ? 'Forelder' : 'Barn'}
            </Text>
          </View>

          <View style={styles.headerSection}>
            <Text style={styles.title}>Logg inn</Text>
            <Text style={styles.subtitle}>
              {isAdult
                ? 'Oppgi ditt mobilnummer for å fortsette'
                : 'Oppgi nummeret forelder registrerte deg med'}
            </Text>
          </View>

          <View style={styles.formSection}>
            <Input
              label="Mobilnummer (8 siffer)"
              placeholder="12345678"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                setError('');
              }}
              accentColor={accentColor}
              keyboardType="numeric"
              maxLength={8}
              returnKeyType="done"
              onSubmitEditing={handleSend}
            />

            {error.length > 0 && (
              <View style={styles.errorRow}>
                <Feather name="alert-circle" size={13} color={Colors.statusDanger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Button
              label="Send kode"
              onPress={handleSend}
              accentColor={accentColor}
              disabled={phone.length === 0}
              style={styles.sendButton}
            />
          </View>
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
    paddingTop: Spacing.md,
    maxWidth: Layout.appMaxWidth,
    width: '100%',
    alignSelf: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: FontSize.body,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    lineHeight: LineHeight.normal,
  },
  roleIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    marginBottom: Spacing.md,
  },
  roleLabel: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.semibold,
    fontFamily: FontFamily.semibold,
  },
  headerSection: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize.display,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    lineHeight: LineHeight.hero,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.body,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    lineHeight: LineHeight.loose,
  },
  formSection: {
    gap: Spacing.sm,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  errorText: {
    fontSize: FontSize.label,
    fontFamily: FontFamily.regular,
    color: Colors.statusDanger,
    lineHeight: LineHeight.tight,
    flex: 1,
  },
  sendButton: {
    marginTop: Spacing.xs,
  },
});
