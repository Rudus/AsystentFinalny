import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../styles.js';

const CustomButton = ({ title, onPress, style, textStyle }) => (
  <TouchableOpacity style={[styles.buttonBlack, {backgroundColor: '#fff'}, style]} onPress={onPress}>
    <Text style={[styles.buttonBlackText, {color: '#000'}, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

export const EditEventModal = ({ isVisible, data, onClose, onSave }) => {
  const [editedTitle, setEditedTitle] = useState('');
  const [editedHour, setEditedHour] = useState('');
  const [editedMinute, setEditedMinute] = useState('');
  const [editedDuration, setEditedDuration] = useState('');

  useEffect(() => {
    if (data && data.event) { // Edycja
      setEditedTitle(data.event.title);
      const [h, m] = data.event.time.split(':');
      setEditedHour(h);
      setEditedMinute(m);
      setEditedDuration(String(data.event.duration));
    } else if (data) { // Dodawanie
      setEditedTitle(data.title || '');
      const [h, m] = (data.startTime || '12:00').split(':');
      setEditedHour(h);
      setEditedMinute(m);
      setEditedDuration('30');
    }
  }, [data]);

  const handleSaveChanges = () => {
    const eventData = {
      title: editedTitle,
      time: `${editedHour.padStart(2, '0')}:${editedMinute.padStart(2, '0')}`,
      duration: parseInt(editedDuration, 10) || 30,
      day: data.day,
    };
    onSave(eventData);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
        <View style={styles.editModalContainer}>
            <View style={styles.editModalContent}>
                <Text style={styles.modalTitle}>{data?.mode === 'edit' ? 'Edytuj wydarzenie' : 'Dodaj nowe wydarzenie'}</Text>
                <Text style={styles.inputLabel}>NAZWA WYDARZENIA</Text>
                <TextInput style={styles.modalInput} value={editedTitle} onChangeText={setEditedTitle} />
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flex: 1, marginRight: 10}}>
                    <Text style={styles.inputLabel}>GODZINA</Text>
                    <View style={styles.timeInputContainerModal}>
                        <TextInput style={styles.timeInputModal} value={editedHour} onChangeText={setEditedHour} keyboardType="number-pad" maxLength={2} />
                        <Text style={styles.timeSeparatorModal}>:</Text>
                        <TextInput style={styles.timeInputModal} value={editedMinute} onChangeText={setEditedMinute} keyboardType="number-pad" maxLength={2} />
                    </View>
                    </View>
                    <View style={{flex: 1, marginLeft: 10}}>
                    <Text style={styles.inputLabel}>CZAS TRWANIA (MIN)</Text>
                    <TextInput style={styles.modalInput} value={editedDuration} onChangeText={setEditedDuration} keyboardType="number-pad" />
                    </View>
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