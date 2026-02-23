import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Radius, Spacing, Layout, LineHeight } from '../../constants/tokens';
import { useAppContext } from '../../store/AppContext';
import { Child } from '../../store/types';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';

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

  // Edit modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editChild, setEditChild] = useState<Child | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmoji, setEditEmoji] = useState(EMOJI_OPTIONS[0]);
  const [editNameError, setEditNameError] = useState('');

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

  function openEditModal(child: Child) {
    setEditChild(child);
    setEditName(child.name);
    setEditEmoji(child.avatarEmoji);
    setEditNameError('');
    setEditModalVisible(true);
  }

  function closeEditModal() {
    setEditModalVisible(false);
    setEditChild(null);
    setEditNameError('');
  }

  function handleEditSave() {
    if (!editName.trim()) {
      setEditNameError('Navn er påkrevd.');
      return;
    }
    if (!editChild) return;
    dispatch({
      type: 'UPDATE_CHILD',
      payload: {
        phone: editChild.phone,
        name: editName.trim(),
        avatarEmoji: editEmoji,
      },
    });
    closeEditModal();
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
    <View style={styles.wrapper}>
      <ScreenContainer bg={Colors.adultSurface}>
        <ScreenHeader
          title="Familie"
          subtitle={`${children.length} barn registrert`}
        />

        {children.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Ingen barn lagt til ennå</Text>
            <Text style={styles.emptySubtitle}>
              Trykk på knappen nedenfor for å legge til ditt første barn.
            </Text>
          </Card>
        ) : (
          children.map((child) => (
            <Card key={child.phone}>
              <View style={styles.childRow}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarEmoji}>{child.avatarEmoji}</Text>
                </View>
                <View style={styles.childInfo}>
                  <Text style={styles.childName}>{child.name}</Text>
                  <Text style={styles.childPhone}>{child.phone}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => openEditModal(child)}
                  style={styles.editIconBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Feather name="edit-2" size={16} color={Colors.textSecondary} />
                </TouchableOpacity>
                <Button
                  label="Fjern"
                  onPress={() => handleRemove(child.phone, child.name)}
                  variant="secondary"
                  accentColor={Colors.statusDanger}
                  style={styles.removeBtn}
                />
              </View>
            </Card>
          ))
        )}

        <Button
          label="Legg til barn"
          onPress={openModal}
          accentColor={Colors.adultPrimary}
          style={styles.addButton}
        />
      </ScreenContainer>

      {/* Edit child modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent onRequestClose={closeEditModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Rediger barn</Text>

            <Input
              label="Navn"
              placeholder="Barnets navn"
              value={editName}
              onChangeText={setEditName}
              accentColor={Colors.adultPrimary}
              autoCapitalize="words"
              returnKeyType="done"
              containerStyle={styles.fieldSpacing}
            />
            {editNameError ? <Text style={styles.errorText}>{editNameError}</Text> : null}

            <Text style={styles.fieldLabel}>Velg avatar</Text>
            <View style={styles.emojiGrid}>
              {EMOJI_OPTIONS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[
                    styles.emojiOption,
                    editEmoji === emoji && styles.emojiOptionSelected,
                  ]}
                  onPress={() => setEditEmoji(emoji)}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button
              label="Lagre"
              onPress={handleEditSave}
              accentColor={Colors.adultPrimary}
              style={styles.saveButton}
            />
            <TouchableOpacity style={styles.cancelLink} onPress={closeEditModal}>
              <Text style={styles.cancelLinkText}>Avbryt</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add child modal */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Legg til barn</Text>

            <Input
              label="Navn"
              placeholder="Barnets navn"
              value={name}
              onChangeText={setName}
              accentColor={Colors.adultPrimary}
              autoCapitalize="words"
              returnKeyType="next"
              containerStyle={styles.fieldSpacing}
            />
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

            <Input
              label="Telefonnummer"
              placeholder="8 siffer"
              value={phone}
              onChangeText={setPhone}
              accentColor={Colors.adultPrimary}
              keyboardType="phone-pad"
              maxLength={8}
              returnKeyType="done"
              containerStyle={styles.fieldSpacing}
            />
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

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

            <Button
              label="Lagre"
              onPress={handleSave}
              accentColor={Colors.adultPrimary}
              style={styles.saveButton}
            />
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
  wrapper: {
    flex: 1,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: FontSize.label,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: LineHeight.tight,
  },
  childRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: Colors.bgSecondary,
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
    fontSize: FontSize.body,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  childPhone: {
    fontSize: FontSize.label,
    color: Colors.textSecondary,
  },
  editIconBtn: {
    padding: Spacing.xs,
    marginRight: Spacing.sm,
  },
  removeBtn: {
    paddingHorizontal: Spacing.md,
  },
  addButton: {
    marginTop: Spacing.sm,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlayScrim,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.bgPrimary,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    padding: Layout.modalPadding,
    paddingBottom: Layout.modalPaddingBottom,
  },
  modalTitle: {
    fontSize: FontSize.title,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Layout.modalTitleGap,
    textAlign: 'center',
  },
  fieldSpacing: {
    marginBottom: Spacing.sm,
  },
  fieldLabel: {
    fontSize: FontSize.label,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
  },
  errorText: {
    fontSize: FontSize.caption,
    color: Colors.statusDanger,
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
    borderRadius: Radius.md,
    backgroundColor: Colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiOptionSelected: {
    borderColor: Colors.adultPrimary,
    backgroundColor: Colors.adultMuted,
  },
  emojiText: {
    fontSize: 26,
  },
  saveButton: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  cancelLink: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  cancelLinkText: {
    fontSize: FontSize.label,
    color: Colors.textSecondary,
  },
});
