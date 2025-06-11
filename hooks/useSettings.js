import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@PorannyAsystent:settings';

export const useSettings = () => {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    try {
      const savedSettingsJSON = await AsyncStorage.getItem(SETTINGS_KEY);
      if (savedSettingsJSON !== null) {
        setSettings(JSON.parse(savedSettingsJSON));
      } else {
        setSettings({ hour: '08', minute: '00', isTimeSetterVisible: true });
      }
    } catch (e) {
      console.error('Nie udało się załadować ustawień.', e);
      setSettings({ hour: '08', minute: '00', isTimeSetterVisible: true });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSettings = async (newSettings) => {
    try {
      const currentSettings = settings || {};
      const mergedSettings = { ...currentSettings, ...newSettings };
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
