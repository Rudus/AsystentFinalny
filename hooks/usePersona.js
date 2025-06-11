import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PERSONA_KEY = '@PorannyAsystent:persona';

export const usePersona = () => {
  const [persona, setPersona] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const loadPersona = useCallback(async () => {
    setIsLoading(true);
    try {
      const savedPersona = await AsyncStorage.getItem(PERSONA_KEY);
      if (savedPersona !== null) {
        setPersona(JSON.parse(savedPersona));
      }
    } catch (e) {
      console.error('Nie udało się załadować persony.', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePersona = async (newPersonaData) => {
    try {
      const mergedPersona = { ...persona, ...newPersonaData };
      await AsyncStorage.setItem(PERSONA_KEY, JSON.stringify(mergedPersona));
      setPersona(mergedPersona);
    } catch (e) {
      console.error('Nie udało się zapisać persony.', e);
    }
  };

  useEffect(() => {
    loadPersona();
  }, [loadPersona]);

  return { persona, isLoading, updatePersona };
};