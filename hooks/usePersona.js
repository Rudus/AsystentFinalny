import React, { useState, useEffect, useCallback } from 'react'; // POPRAWKA: Dodano import React i useCallback
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

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
      } else {
        setPersona({});
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

  const clearPersona = async () => {
      try {
          await AsyncStorage.removeItem(PERSONA_KEY);
          setPersona({});
          Alert.alert("Sukces", "Persona została wyczyszczona.");
      } catch(e) {
          console.error('Nie udało się wyczyścić persony.', e);
          Alert.alert("Błąd", "Wystąpił błąd podczas czyszczenia persony.");
      }
  };

  useEffect(() => {
    loadPersona();
  }, [loadPersona]);

  return { persona, isLoading, updatePersona, clearPersona };
};