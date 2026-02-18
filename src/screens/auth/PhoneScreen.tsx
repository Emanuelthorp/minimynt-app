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

type PhoneNavigationProp = StackNavigationProp<AuthStackParamList, 'Phone'>;
type PhoneRouteProp = RouteProp<AuthStackParamList, 'Phone'>;

type Props = {
  navigation: PhoneNavigationProp;
  route: PhoneRouteProp;
};

export default function PhoneScreen({ navigation, route }: Props) {
  const { role } = route.params;
  const { state } = useAppContext();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const isAdult = role === 'adult';
  const bg = isAdult ? Colors.adultBg : Colors.childBg;
  const cardBg = isAdult ? Colors.adultCard : Colors.childCard;

  function handleSend() {
    setError('');

    if (phone.length !== 8 || !/^\d{8}$/.test(phone)) {
      setError('Mobilnummeret må ha 8 siffer.');
      return;
    }

    if (role === 'child') {
      const found = state.children.some((child) => child.phone === phone);
      if (!found) {
        setError('Ikke registrert barn.');
        return;
      }
    }

    navigation.navigate('OTP', { role, phone });
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Tilbake</Text>
          </TouchableOpacity>

          <View style={styles.headerSection}>
            <Text style={styles.title}>Logg inn</Text>
          </View>

          <View style={[styles.formCard, { backgroundColor: cardBg }]}>
            <Text style={styles.label}>Mobilnummer (8 siffer)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              maxLength={8}
              placeholder="12345678"
              placeholderTextColor={Colors.textMuted}
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                setError('');
              }}
              returnKeyType="done"
            />

            {error.length > 0 && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: isAdult ? Colors.adultAccent : Colors.childAccent },
              ]}
              onPress={handleSend}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Send kode</Text>
            </TouchableOpacity>
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
  },
  backButton: {
    marginBottom: Spacing.md,
  },
  backButtonText: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
  },
  headerSection: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
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
    paddingVertical: Spacing.sm,
    fontSize: FontSize.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  errorText: {
    fontSize: FontSize.sm,
    color: Colors.danger,
    marginBottom: Spacing.md,
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
});
