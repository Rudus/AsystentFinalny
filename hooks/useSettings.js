import React, { useState, useEffect, useCallback } from 'react'; // POPRAWKA: Dodano import React
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@PorannyAsystent:settings';

export const useSettings = () => {
  const [settings, setSettings] = useState({
    hour: '08',
    minute: '00',
    isTimeSetterVisible: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const savedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
      if (savedSettings !== null) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (e) {
      console.error('Nie udało się załadować ustawień.', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSettings = async (newSettings) => {
    try {
      const mergedSettings = { ...settings, ...newSettings };
      const jsonValue = JSON.stringify(mergedSettings);
      await AsyncStorage.setItem(SETTINGS_KEY, jsonValue);
      setSettings(mergedSettings);
    } catch (e) {
      console.error('Nie udało się zapisać ustawień.', e);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return { settings, isLoading, saveSettings };
};