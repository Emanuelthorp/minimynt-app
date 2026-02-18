import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../constants/tokens';
import { useAppContext } from '../../store/AppContext';

const EMOJI_OPTIONS = ['🧒', '👦', '👧', '🧑', '👶', '🐣', '🦊', '🐧'];

export default function FamilyScreen() {
  const { state, dispatch } = useAppContext();
  const { children } = state;

  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_OPTIONS[0]);
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  function resetForm() {
    setName('');
    setPhone('');
    setSelectedEmoji(EMOJI_OPTIONS[0]);
    setNameError('');
    setPhoneError('');
  }

  function openModal() {
    resetForm();
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
    resetForm();
  }

  function handleSave() {
    let valid = true;

    if (!name.trim()) {
      setNameError('Navn er påkrevd.');
      valid = false;
    } else {
      setNameError('');
    }

    const cleanPhone = phone.trim();
    if (!/^\d{8}$/.test(cleanPhone)) {
      setPhoneError('Telefonnummer må være 8 siffer.');
      valid = false;
    } else if (children.some((c) => c.phone === cleanPhone)) {
      setPhoneError('Dette telefonnummeret er allerede registrert.');
      valid = false;
    } else {
      setPhoneError('');
    }

    if (!valid) return;

    dispatch({
      type: 'ADD_CHILD',
      payload: {
        name: name.trim(),
        phone: cleanPhone,
        avatarEmoji: selectedEmoji,
      },
    });
    closeModal();
  }

  function handleRemove(childPhone: string, childName: string) {
    Alert.alert(
      'Fjern barn',
      `Er du sikker på at du vil fjerne ${childName}?`,
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Fjern',
          style: 'destructive',
          onPress: () => dispatch({ type: 'REMOVE_CHILD', payload: childPhone }),
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Familie</Text>
          <Text style={styles.subtitle}>
            {children.length} {children.length === 1 ? 'barn' : 'barn'} registrert
          </Text>
        </View>

        {/* Children list */}
        {children.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>👨‍👩‍👧‍👦</Text>
            <Text style={styles.emptyTitle}>Ingen barn lagt til ennå</Text>
            <Text style={styles.emptySubtitle}>
              Trykk på knappen nedenfor for å legge til ditt første barn.
            </Text>
          </View>
        ) : (
          children.map((child) => (
            <View key={child.phone} style={styles.childCard}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarEmoji}>{child.avatarEmoji}</Text>
              </View>
              <View style={styles.childInfo}>
                <Text style={styles.childName}>{child.name}</Text>
                <Text style={styles.childPhone}>{child.phone}</Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemove(child.phone, child.name)}
                accessibilityLabel={`Fjern ${child.name}`}
              >
                <Text style={styles.removeButtonText}>Fjern</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* Add child button */}
        <TouchableOpacity style={styles.addButton} onPress={openModal}>
          <Text style={styles.addButtonText}>+ Legg til barn</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add child Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Legg til barn</Text>

            {/* Name input */}
            <Text style={styles.fieldLabel}>Navn</Text>
            <TextInput
              style={[styles.input, nameError ? styles.inputError : null]}
              placeholder="Barnets navn"
              placeholderTextColor={Colors.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              returnKeyType="next"
            />
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

            {/* Phone input */}
            <Text style={styles.fieldLabel}>Telefonnummer</Text>
            <TextInput
              style={[styles.input, phoneError ? styles.inputError : null]}
              placeholder="8 siffer"
              placeholderTextColor={Colors.textMuted}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={8}
              returnKeyType="done"
            />
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

            {/* Emoji picker */}
            <Text style={styles.fieldLabel}>Velg avatar</Text>
            <View style={styles.emojiGrid}>
              {EMOJI_OPTIONS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[
                    styles.emojiOption,
                    selectedEmoji === emoji && styles.emojiOptionSelected,
                  ]}
                  onPress={() => setSelectedEmoji(emoji)}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Actions */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Lagre</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelLink} onPress={closeModal}>
              <Text style={styles.cancelLinkText}>Avbryt</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.adultBg,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  emptyCard: {
    backgroundColor: Colors.adultCard,
    borderRadius: Radius.md,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  childCard: {
    backgroundColor: Colors.adultCard,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.adultBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarEmoji: {
    fontSize: 26,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  childPhone: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  removeButton: {
    backgroundColor: Colors.danger,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  removeButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  addButton: {
    backgroundColor: Colors.adultAccent,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  addButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.adultCard,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  modalTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  fieldLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.adultBg,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
    fontSize: FontSize.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  errorText: {
    fontSize: FontSize.xs,
    color: Colors.danger,
    marginBottom: Spacing.sm,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  emojiOption: {
    width: 52,
    height: 52,
    borderRadius: Radius.sm,
    backgroundColor: Colors.adultBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiOptionSelected: {
    borderColor: Colors.adultAccent,
    backgroundColor: 'rgba(61,155,233,0.15)',
  },
  emojiText: {
    fontSize: 26,
  },
  saveButton: {
    backgroundColor: Colors.adultAccent,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  saveButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  cancelLink: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  cancelLinkText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
});
