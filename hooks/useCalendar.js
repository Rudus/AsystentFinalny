import React, { useState, useEffect, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import * as Calendar from 'expo-calendar';
import * as Notifications from 'expo-notifications';

export const useCalendar = () => {
  const [plan, setPlan] = useState(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);
  const [defaultCalendarId, setDefaultCalendarId] = useState(null);

  const setupPermissionsAndCalendar = useCallback(async () => {
    await Notifications.requestPermissionsAsync();
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Brak dostępu', 'Nie przyznano dostępu do kalendarza.');
      return;
    }
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const primaryCalendar = calendars.find(cal => cal.isPrimary) || calendars[0];
    if (primaryCalendar) {
        setDefaultCalendarId(primaryCalendar.id);
    }
  }, []);

  useEffect(() => {
    setupPermissionsAndCalendar();
  }, [setupPermissionsAndCalendar]);

  const generatePlan = useCallback(async () => {
    setIsLoadingPlan(true);
    try {
      const { status } = await Calendar.getCalendarPermissionsAsync();
      if (status !== 'granted') {
          setPlan({ today: [], tomorrow: [], allForCalendar: {}, upcomingTwoWeeks: [], todayKey: '', tomorrowKey: '' });
          return;
      }

      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      if (calendars.length === 0) {
          setPlan({ today: [], tomorrow: [], allForCalendar: {}, upcomingTwoWeeks: [], todayKey: '', tomorrowKey: '' });
          return;
      }

      const calendarIds = calendars.map(cal => cal.id);

      const today = new Date();
      today.setHours(0,0,0,0);
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 14);

      const rawEvents = await Calendar.getEventsAsync(calendarIds, today, endDate);

      const events = rawEvents.map(event => {
          const startTime = new Date(event.startDate);
          const endTime = new Date(event.endDate);
          const duration = Math.round((endTime - startTime) / (1000 * 60));
          return {
              id: event.id,
              time: `${String(startTime.getHours()).padStart(2, '0')}:${String(startTime.getMinutes()).padStart(2, '0')}`,
              date: startTime.toISOString().slice(0, 10),
              duration: duration > 0 ? duration : 30,
              title: event.title,
              color: event.color || '#3b82f6',
              originalEvent: event,
          };
      });

      const todayKey = today.toISOString().slice(0, 10);
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      const tomorrowKey = tomorrow.toISOString().slice(0, 10);

      const allEventsForCalendar = {};
      events.forEach(event => {
          const eventDateKey = event.date;
          if (!allEventsForCalendar[eventDateKey]) allEventsForCalendar[eventDateKey] = [];
          allEventsForCalendar[eventDateKey].push(event);
      });

      const upcomingTwoWeeks = events.filter(e => e.date !== todayKey);

      setPlan({
          today: allEventsForCalendar[todayKey] || [],
          tomorrow: allEventsForCalendar[tomorrowKey] || [],
          allForCalendar: allEventsForCalendar,
          upcomingTwoWeeks: upcomingTwoWeeks,
          todayKey: todayKey,
          tomorrowKey: tomorrowKey,
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Błąd", "Nie udało się załadować wydarzeń z kalendarza.");
    } finally {
      setIsLoadingPlan(false);
    }
  }, []);

  useEffect(() => {
      generatePlan();
  }, [generatePlan]);

  const saveEvent = async (eventData, eventId) => {
    if (!defaultCalendarId) {
      Alert.alert("Błąd", "Nie znaleziono domyślnego kalendarza do zapisu.");
      return false;
    }

    const [hour, minute] = eventData.time.split(':').map(Number);
    const startDate = new Date(eventData.day);
    startDate.setHours(hour, minute, 0, 0);
    const endDate = new Date(startDate.getTime() + (eventData.duration * 60000));
    const details = { title: eventData.title, startDate, endDate, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };

    try {
        if (eventId) {
            await Calendar.updateEventAsync(eventId, details);
            Alert.alert("Sukces", "Wydarzenie zostało zaktualizowane!");
        } else {
            await Calendar.createEventAsync(defaultCalendarId, details);
            Alert.alert("Sukces", "Nowe wydarzenie zostało dodane do Twojego kalendarza!");
        }
        return true;
    } catch(error) {
        console.error("Błąd zapisu do kalendarza:", error);
        Alert.alert("Błąd", "Nie udało się zapisać wydarzenia w kalendarzu.");
        return false;
    }
  };

  return { plan, isLoadingPlan, generatePlan, saveEvent };
};