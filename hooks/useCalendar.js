import { useState, useEffect, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import * as Calendar from 'expo-calendar';
import * as Notifications from 'expo-notifications'; // Potrzebne do uprawnień

export const useCalendar = (selectedMood) => {
  const [plan, setPlan] = useState(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);

  const setupPermissions = async () => {
    await Notifications.requestPermissionsAsync();
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Brak dostępu', 'Nie przyznano dostępu do kalendarza. Aplikacja nie będzie mogła wyświetlać Twoich wydarzeń.');
    }
  };

  useEffect(() => {
    setupPermissions();
  }, []);

  const getCalendarEvents = async () => {
    const { status } = await Calendar.getCalendarPermissionsAsync();
    if (status !== 'granted') return [];

    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const defaultCalendar = calendars.find(cal => cal.isPrimary) || calendars[0];

    if (!defaultCalendar) return [];

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 2);

    const events = await Calendar.getEventsAsync([defaultCalendar.id], startDate, endDate);

    return events.map(event => {
        const startTime = new Date(event.startDate);
        const endTime = new Date(event.endDate);
        const duration = Math.round((endTime - startTime) / (1000 * 60));
        return {
            time: `${String(startTime.getHours()).padStart(2, '0')}:${String(startTime.getMinutes()).padStart(2, '0')}`,
            duration: duration > 0 ? duration : 30,
            title: event.title,
            color: defaultCalendar.color || '#3b82f6',
            isAllDay: event.allDay,
            originalEvent: event,
        };
    });
  };

  // Symulacja wywołania Gemini - wklej tu swoją funkcję callGemini
  const callGeminiMock = async (prompt) => {
      return new Promise(resolve => setTimeout(() => resolve("Oto Twój spersonalizowany plan dnia na podstawie Twojego kalendarza:"), 500));
  }

  const generatePlan = useCallback(async () => {
    setIsLoadingPlan(true);
    setPlan(null);
    try {
      const events = await getCalendarEvents();
      const eventsString = events.map(e => `- ${e.title}`).join('\n');
      const prompt = `Jesteś moim osobistym asystentem. Mój nastrój na dziś to: "${selectedMood}". Na podstawie wydarzeń: ${eventsString}, stwórz krótkie wprowadzenie do planu dnia.`;

      const introText = await callGeminiMock(prompt); // Używamy mocka

      const today = new Date().toISOString().slice(0, 10);
      const tomorrowDate = new Date();
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      const tomorrow = tomorrowDate.toISOString().slice(0, 10);

      setPlan({
          intro: introText,
          today: events.filter(e => new Date(e.originalEvent.startDate).toISOString().slice(0,10) === today),
          tomorrow: events.filter(e => new Date(e.originalEvent.startDate).toISOString().slice(0,10) === tomorrow)
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Błąd", "Nie udało się załadować wydarzeń z kalendarza.");
    } finally {
      setIsLoadingPlan(false);
    }
  }, [selectedMood]);

  useEffect(() => {
      generatePlan();
  }, [selectedMood, generatePlan]);

  return { plan, isLoadingPlan, generatePlan };
};