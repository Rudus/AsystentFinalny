import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { styles } from '../styles.js';
import { allSuggestions } from '../data/suggestions.js';

export const MajordomoModal = ({ isVisible, onClose, onPlanRequest, persona, updatePersona }) => {
  const [view, setView] = useState('suggestions');
  const [currentSuggestions, setCurrentSuggestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [eventToSchedule, setEventToSchedule] = useState(null);

  const filteredSuggestions = useMemo(() => {
      return allSuggestions.filter(suggestion => {
          if (suggestion.personaKey && persona[suggestion.personaKey] === false) {
              return false;
          }
          return true;
      });
  }, [persona]);

  useEffect(() => {
    if (isVisible) {
      const shuffled = [...filteredSuggestions].sort(() => 0.5 - Math.random());
      setCurrentSuggestions(shuffled.slice(0, 3));
      setView('suggestions');
    }
  }, [isVisible, filteredSuggestions]);

  const handleDismiss = (suggestion) => {
    if (suggestion.question) {
      setCurrentQuestion(suggestion.question);
      setView('question');
    } else {
      setCurrentSuggestions(currentSuggestions.filter(s => s.title !== suggestion.title));
    }
  };

  const handleQuestionAnswer = (answer) => {
      if (answer === 'no' && currentQuestion) {
          updatePersona({ [currentQuestion.key]: false });
      }
      setView('suggestions');
      setCurrentSuggestions(currentSuggestions.filter(s => s.question?.key !== currentQuestion?.key));
  };

  const handleAccept = (suggestion) => {
      setEventToSchedule(suggestion);
      setView('schedule');
  };

  const handleSchedule = (time) => {
      onPlanRequest(eventToSchedule.title); // Przekazujemy tylko tytuł do zaplanowania
      onClose();
  };

  const renderSuggestions = () => (
    <>
      <Text style={styles.majordomoTitle}>Sugestie Asystenta 🤵‍♂️</Text>
      <Text style={styles.majordomoSubtitle}>Pamiętajmy o kilku ważnych sprawach.</Text>
      {currentSuggestions.length > 0 ? currentSuggestions.map((item, index) => (
        <View key={index} style={styles.suggestionCard}>
          <Text style={{fontSize: 40}}>{item.icon}</Text>
          <View style={{flex: 1, marginHorizontal: 16}}>
            <Text style={styles.suggestionTitle}>{item.title}</Text>
            <Text style={styles.suggestionDesc}>{item.description}</Text>
          </View>
          <View>
            <TouchableOpacity onPress={() => handleAccept(item)} style={[styles.suggestionButton, {backgroundColor: '#16a34a'}]}><Text style={styles.suggestionButtonText}>✓</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => handleDismiss(item)} style={[styles.suggestionButton, {backgroundColor: '#ef4444', marginTop: 8}]}><Text style={styles.suggestionButtonText}>×</Text></TouchableOpacity>
          </View>
        </View>
      )) : <Text style={styles.majordomoSubtitle}>Na dziś to wszystko. Miłego dnia!</Text>}
      <TouchableOpacity onPress={onClose} style={styles.closeMajordomoButton}>
        <Text style={{color: 'white', fontWeight: 'bold'}}>Pokaż mój plan dnia</Text>
      </TouchableOpacity>
    </>
  );

  const renderQuestion = () => (
      <>
        <Text style={styles.majordomoTitle}>Szybkie pytanie...</Text>
        <Text style={styles.majordomoSubtitle}>{currentQuestion?.text}</Text>
        <View style={{flexDirection: 'row', gap: 16, width: '100%'}}>
            <TouchableOpacity onPress={() => handleQuestionAnswer('yes')} style={[styles.closeMajordomoButton, {flex: 1, backgroundColor: '#16a34a'}]}><Text style={{color: 'white', fontWeight: 'bold'}}>Tak</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => handleQuestionAnswer('no')} style={[styles.closeMajordomoButton, {flex: 1, backgroundColor: '#ef4444'}]}><Text style={{color: 'white', fontWeight: 'bold'}}>Nie</Text></TouchableOpacity>
        </View>
      </>
  );

  const renderScheduler = () => {
    const suggestion1 = "Jutro o 10:00";
    const suggestion2 = "Pojutrze o 14:30";

    return (
        <>
            <Text style={styles.majordomoTitle}>Zaplanuj: {eventToSchedule?.title}</Text>
            <Text style={styles.majordomoSubtitle}>Znalazłem kilka wolnych terminów. Który Ci pasuje?</Text>
            <TouchableOpacity onPress={() => handleSchedule(suggestion1)} style={styles.closeMajordomoButton}><Text style={{color: 'white', fontWeight: 'bold'}}>{suggestion1}</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => handleSchedule(suggestion2)} style={styles.closeMajordomoButton}><Text style={{color: 'white', fontWeight: 'bold'}}>{suggestion2}</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => handleSchedule('custom')} style={[styles.closeMajordomoButton, {backgroundColor: 'transparent', borderWidth: 1, borderColor: '#374151'}]}><Text style={{color: 'white', fontWeight: 'bold'}}>Wybierz własny termin</Text></TouchableOpacity>
        </>
    );
  }

  return (
    <Modal animationType="fade" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.majordomoModalView}>
          {view === 'suggestions' && renderSuggestions()}
          {view === 'question' && renderQuestion()}
          {view === 'schedule' && renderScheduler()}
        </View>
      </View>
    </Modal>
  );
};