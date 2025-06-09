import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';
import { styles } from '../styles';

const CustomButton = ({ title, onPress, style, textStyle }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <Text style={[styles.buttonText, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

export const EditEventModal = ({ isVisible, event, onClose, onSave }) => {
  const [editedTitle, setEditedTitle] = useState('');
  const [editedHour, setEditedHour] = useState('');
  const [editedMinute, setEditedMinute] = useState('');
  const [editedDuration, setEditedDuration] = useState('');
  const [editedColor, setEditedColor] = useState('#3b82f6');

  const eventColors = ['#3b82f6', '#16a34a', '#f97316', '#ef4444'];

  useEffect(() => {
    if (event) {
      setEditedTitle(event.title);
      const [h, m] = event.time.split(':');
      setEditedHour(h);
      setEditedMinute(m);
      setEditedDuration(String(event.duration));
      setEditedColor(event.color);
    }
  }, [event]);

  const handleSaveChanges = () => {
    const updatedEvent = {
      ...event,
      title: editedTitle,
      time: `${editedHour.padStart(2, '0')}:${editedMinute.padStart(2, '0')}`,
      duration: parseInt(editedDuration, 10) || 30,
      color: editedColor,
    };
    onSave(updatedEvent);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.editModalContainer}>
        <View style={styles.editModalContent}>
          <Text style={styles.modalTitle}>Edytuj wydarzenie</Text>

          <Text style={styles.inputLabel}>Nazwa wydarzenia</Text>
          <TextInput style={styles.modalInput} value={editedTitle} onChangeText={setEditedTitle} />

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flex: 1, marginRight: 10}}>
              <Text style={styles.inputLabel}>Godzina</Text>
              <View style={styles.timeInputContainerModal}>
                <TextInput style={styles.timeInputModal} value={editedHour} onChangeText={setEditedHour} keyboardType="number-pad" maxLength={2} />
                <Text style={styles.timeSeparatorModal}>:</Text>
                <TextInput style={styles.timeInputModal} value={editedMinute} onChangeText={setEditedMinute} keyboardType="number-pad" maxLength={2} />
              </View>
            </View>
            <View style={{flex: 1, marginLeft: 10}}>
              <Text style={styles.inputLabel}>Czas trwania (min)</Text>
              <TextInput style={styles.modalInput} value={editedDuration} onChangeText={setEditedDuration} keyboardType="number-pad" />
            </View>
          </View>

          <Text style={styles.inputLabel}>Kolor wydarzenia</Text>
          <View style={styles.colorSelector}>
            {eventColors.map(color => (
              <TouchableOpacity
                key={color}
                style={[styles.colorCircle, { backgroundColor: color }, editedColor === color && styles.colorCircleSelected]}
                onPress={() => setEditedColor(color)}
              />
            ))}
          </View>

          <View style={styles.modalButtonRow}>
            <CustomButton title="Anuluj" onPress={onClose} style={styles.cancelButton} textStyle={styles.cancelButtonText} />
            <CustomButton title="Zapisz" onPress={handleSaveChanges} style={styles.saveButton} />
          </View>
        </View>
      </View>
    </Modal>
  );
};