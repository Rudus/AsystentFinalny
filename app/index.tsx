import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Platform, UIManager, LayoutAnimation, AppState } from 'react-native';
import { useFonts, JosefinSans_400Regular, JosefinSans_600SemiBold, JosefinSans_700Bold } from '@expo-google-fonts/josefin-sans';

import { styles } from '../styles.js';
import { TimeSetterWidget } from '../components/TimeSetterWidget';
import { DateWidget } from '../components/DateWidget';
import { TimelineWidget } from '../components/TimelineWidget';
import { CalendarWidget } from '../components/CalendarWidget';
import { MajordomoModal } from '../components/MajordomoModal';
import { EditEventModal } from '../components/EditEventModal';
import { useCalendar } from '../hooks/useCalendar';
import { useSettings } from '../hooks/useSettings';
import { usePersona } from '../hooks/usePersona';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function AppScreen() {
  let [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_600SemiBold,
    JosefinSans_700Bold,
  });

  const { settings, isLoading: isLoadingSettings, saveSettings } = useSettings();
  const { persona, updatePersona } = usePersona();
  const { plan, isLoadingPlan, generatePlan, saveEvent } = useCalendar();

  const [isMajordomoVisible, setIsMajordomoVisible] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        generatePlan();
      }
    });
    return () => { subscription.remove(); };
  }, [generatePlan]);

  const handleSetAlarm = (time) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    saveSettings({ ...time, isTimeSetterVisible: false });
  };

  const showTimeSetter = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    saveSettings({ isTimeSetterVisible: true });
  };

  const openModal = (mode, data) => {
      setEventToEdit({ mode, ...data });
      setIsEditModalVisible(true);
  };

  const handleSaveEvent = async (eventData) => {
      const success = await saveEvent(eventData, eventToEdit?.event?.id);
      if (success) {
          setIsEditModalVisible(false);
          setEventToEdit(null);
          await generatePlan();
      }
  };

  const handleDateSelect = (dateKey) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      if (selectedDate && selectedDate.dateKey === dateKey) {
          setSelectedDate(null);
      } else {
          setSelectedDate({
              dateKey: dateKey,
              formatted: new Date(dateKey).toLocaleDateString('pl-PL', {day: 'numeric', month: 'long', weekday: 'long'}).toUpperCase(),
          });
      }
  };


  if (!fontsLoaded || isLoadingSettings) {
    return <View style={styles.centeredView}><ActivityIndicator size="large" color="#fff" /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      {settings && !settings.isTimeSetterVisible && (
        <TouchableOpacity style={styles.topRightClock} onPress={showTimeSetter}>
          <Text style={styles.topRightClockIcon}>🕒</Text>
          <Text style={styles.topRightClockText}>{`${settings.hour}:${settings.minute}`}</Text>
        </TouchableOpacity>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TimeSetterWidget
          isVisible={settings.isTimeSetterVisible}
          initialHour={settings.hour}
          initialMinute={settings.minute}
          onSave={handleSetAlarm}
        />
        <DateWidget />
        <TimelineWidget
          title="HARMONOGRAM NA DZIŚ"
          tasks={plan ? plan.today : []}
          dayKey={plan ? plan.todayKey : ''}
          onEventPress={(event, day) => openModal('edit', { event, day })}
          onAddPress={(startTime, day) => openModal('add', { startTime, day })}
          isToday
        />
        <TimelineWidget
          title="PLAN NA JUTRO"
          tasks={plan ? plan.tomorrow : []}
          dayKey={plan ? plan.tomorrowKey : ''}
          onEventPress={(event, day) => openModal('edit', { event, day })}
          onAddPress={(startTime, day) => openModal('add', { startTime, day })}
        />
        {selectedDate && (
             <TimelineWidget
                title={`PLAN NA: ${selectedDate.formatted}`}
                tasks={plan ? (plan.allForCalendar[selectedDate.dateKey] || []) : []}
                dayKey={selectedDate.dateKey}
                onEventPress={(event, day) => openModal('edit', {event, day})}
                onAddPress={(startTime, day) => openModal('add', {startTime, day})}
            />
        )}
        <CalendarWidget
            events={plan ? plan.allForCalendar : {}}
            onDateSelect={handleDateSelect}
            selectedDateKey={selectedDate ? selectedDate.dateKey : null}
        />
      </ScrollView>

      <MajordomoModal
        isVisible={isMajordomoVisible}
        onClose={() => setIsMajordomoVisible(false)}
        onPlanRequest={(title) => openModal('add', { title, day: plan ? plan.todayKey : '' })}
        persona={persona} // Przekazujemy personę
        updatePersona={updatePersona} // Przekazujemy funkcję do aktualizacji
      />
      {eventToEdit && (
          <EditEventModal
            isVisible={isEditModalVisible}
            data={eventToEdit}
            onClose={() => setIsEditModalVisible(false)}
            onSave={handleSaveEvent}
          />
      )}
    </SafeAreaView>
  );
}