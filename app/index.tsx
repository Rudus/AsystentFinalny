import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Platform,
  Alert,
  LayoutAnimation,
  UIManager,
} from 'react-native';

import { Timeline } from '../components/Timeline';
import { EditEventModal } from '../components/EditEventModal';
import { useCalendar } from '../hooks/useCalendar';
import { styles } from '../styles'; // Importujemy style z osobnego pliku

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CustomButton = ({ title, onPress, style, textStyle }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <Text style={[styles.buttonText, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

export default function App() {
  const [hour, setHour] = useState('07');
  const [minute, setMinute] = useState('30');
  const [selectedMood, setSelectedMood] = useState('Produktywny');
  const [isTimeSetterVisible, setIsTimeSetterVisible] = useState(true);

  const { plan, isLoadingPlan, generatePlan } = useCalendar(selectedMood);

  // Stany dla modala edycji
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);

  const handleSetAlarm = () => {
    // Tutaj w przyszłości będzie logika powiadomień
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsTimeSetterVisible(false);
  };

  const showTimeSetter = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsTimeSetterVisible(true);
  };

  const openEditModal = (event, dayKey) => {
    setEventToEdit({ ...event, dayKey });
    setIsEditModalVisible(true);
  };

  const handleSaveChanges = (updatedEvent) => {
    if (!eventToEdit) return;

    // To jest uproszczona logika - w prawdziwej aplikacji
    // zaktualizowalibyśmy dane w kalendarzu systemowym.
    // Na razie symulujemy odświeżenie.
    generatePlan();
    setIsEditModalVisible(false);
  };

  const moods = ['Produktywny', 'Kreatywny', 'Spokojny'];
  const moodEmojis = { 'Produktywny': '💻', 'Kreatywny': '🎨', 'Spokojny': '🧘' };

  return (
    <SafeAreaView style={styles.container}>
      {!isTimeSetterVisible && (
        <TouchableOpacity style={styles.topRightClock} onPress={showTimeSetter}>
          <Text style={styles.topRightClockIcon}>🕒</Text>
          <Text style={styles.topRightClockText}>{`${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`}</Text>
        </TouchableOpacity>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Poranny Asystent</Text>

        {isTimeSetterVisible && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Ustaw godzinę powiadomienia</Text>
            <View style={styles.timeInputContainer}>
              <TextInput style={styles.timeInput} value={hour} onChangeText={setHour} keyboardType="number-pad" maxLength={2} />
              <Text style={styles.timeSeparator}>:</Text>
              <TextInput style={styles.timeInput} value={minute} onChangeText={setMinute} keyboardType="number-pad" maxLength={2} />
            </View>
            <CustomButton title="Zapisz" onPress={handleSetAlarm} />
          </View>
        )}

        <View style={styles.moodSelectorCompact}>
          <Text style={styles.moodLabel}>Nastrój na dziś:</Text>
          <View style={styles.moodButtonsContainer}>
            {moods.map(mood => (
              <TouchableOpacity key={mood} style={[styles.moodButton, selectedMood === mood && styles.moodButtonSelected]} onPress={() => setSelectedMood(mood)}>
                <Text style={[styles.moodButtonText, selectedMood === mood && styles.moodButtonTextSelected]}>{moodEmojis[mood]}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Twój Plan Dnia</Text>
          {isLoadingPlan ? (
            <ActivityIndicator size="large" color="#3498db" />
          ) : plan ? (
            <>
              <Text style={styles.planIntro}>{plan.intro}</Text>
              <Text style={styles.dayHeader}>Dziś</Text>
              <Timeline tasks={plan.today} onEventPress={(event) => openEditModal(event, 'today')} />
              <Text style={styles.dayHeader}>Jutro</Text>
              <Timeline tasks={plan.tomorrow} onEventPress={(event) => openEditModal(event, 'tomorrow')} />
            </>
          ) : (
            <Text>Nie udało się załadować planu lub nie masz na dziś żadnych wydarzeń.</Text>
          )}
        </View>
      </ScrollView>

      {eventToEdit && (
        <EditEventModal
          isVisible={isEditModalVisible}
          event={eventToEdit}
          onClose={() => setIsEditModalVisible(false)}
          onSave={handleSaveChanges}
        />
      )}
    </SafeAreaView>
  );
}