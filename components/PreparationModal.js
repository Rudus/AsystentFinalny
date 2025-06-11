import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { styles } from '../styles.js';

const Checkbox = ({ label, value, onValueChange }) => (
    <TouchableOpacity style={styles.checkboxContainer} onPress={() => onValueChange(!value)}>
        <View style={[styles.checkbox, value && styles.checkboxChecked]}>
            {value && <Text style={styles.checkboxCheck}>✓</Text>}
        </View>
        <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
);

export const PreparationModal = ({ isVisible, onClose, upcomingEvents }) => {
    const [view, setView] = useState('selection');
    const [selectedEvents, setSelectedEvents] = useState({});
    const [preparationPlan, setPreparationPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setView('selection');
            setSelectedEvents({});
            setPreparationPlan(null);
        }
    }, [isVisible]);

    // POPRAWKA: Przekazujemy unikalny identyfikator (id + data)
    const handleToggleEvent = (uniqueId) => {
        setSelectedEvents(prev => ({ ...prev, [uniqueId]: !prev[uniqueId] }));
    };

    const handleGeneratePreparation = async () => {
        // POPRAWKA: Filtrujemy po unikalnym identyfikatorze
        const eventsToPrepare = upcomingEvents.filter(e => {
            const uniqueId = `${e.id}-${e.date}`;
            return selectedEvents[uniqueId];
        });

        if (eventsToPrepare.length === 0) {
            Alert.alert("Wybierz wydarzenia", "Zaznacz przynajmniej jedno wydarzenie, aby przygotować plan.");
            return;
        }

        setView('loading');
        setIsLoading(true);
        try {
            const prompt = `Dla tych wydarzeń: ${JSON.stringify(eventsToPrepare.map(e=>e.title))}, zasugeruj listę zadań przygotowawczych.`;

            // Symulowana odpowiedź
            await new Promise(res => setTimeout(res, 1500));
            const mockResponse = eventsToPrepare.map(event => ({
                eventTitle: event.title,
                tasks: [
                    "Potwierdź termin i godzinę.",
                    "Przygotuj niezbędne dokumenty.",
                    "Sprawdź dojazd i zaplanuj trasę."
                ]
            }));
            setPreparationPlan(mockResponse);
            setView('results');
        } catch(error) {
            Alert.alert("Błąd", "Nie udało się wygenerować planu przygotowań.");
            setView('selection');
        } finally {
            setIsLoading(false);
        }
    };

    const renderContent = () => {
        switch(view) {
            case 'loading':
                return <View style={{alignItems: 'center', minHeight: 200, justifyContent: 'center'}}><ActivityIndicator size="large" color="#fff" /><Text style={styles.majordomoSubtitle}>Asystent analizuje...</Text></View>;
            case 'results':
                return (
                    <ScrollView>
                        <Text style={styles.majordomoTitle}>Plan Przygotowań 📝</Text>
                        {preparationPlan.map((plan) => (
                            <View key={plan.eventTitle} style={styles.suggestionCard}>
                                <View>
                                    <Text style={styles.suggestionTitle}>{plan.eventTitle}</Text>
                                    {plan.tasks.map((task, i) => <Text key={`${plan.eventTitle}-task-${i}`} style={styles.preparationTask}>• {task}</Text>)}
                                </View>
                            </View>
                        ))}
                        <TouchableOpacity onPress={onClose} style={styles.closeMajordomoButton}><Text style={{color: 'white', fontWeight: 'bold'}}>Gotowe!</Text></TouchableOpacity>
                    </ScrollView>
                );
            case 'selection':
            default:
                return (
                    <>
                        <Text style={styles.majordomoTitle}>Przygotujmy się! 🧐</Text>
                        <Text style={styles.majordomoSubtitle}>Zaznacz nadchodzące wydarzenia, które wymagają przygotowań.</Text>
                        <ScrollView style={{maxHeight: 300, width: '100%'}}>
                            {upcomingEvents.map(event => {
                                // POPRAWKA: Tworzymy unikalny identyfikator dla każdego wydarzenia
                                const uniqueId = `${event.id}-${event.date}`;
                                return (
                                    <Checkbox
                                        key={uniqueId}
                                        label={`${event.title} (${new Date(event.date).toLocaleDateString('pl-PL', {day: '2-digit', month: '2-digit'})})`}
                                        value={!!selectedEvents[uniqueId]}
                                        onValueChange={() => handleToggleEvent(uniqueId)}
                                    />
                                );
                            })}
                        </ScrollView>
                        <TouchableOpacity onPress={handleGeneratePreparation} style={[styles.closeMajordomoButton, {backgroundColor: '#3b82f6'}]}><Text style={{color: 'white', fontWeight: 'bold'}}>Generuj Plan Przygotowań</Text></TouchableOpacity>
                        <TouchableOpacity onPress={onClose} style={[styles.closeMajordomoButton, {backgroundColor: 'transparent'}]}><Text style={{color: '#9CA3AF'}}>Pomiń</Text></TouchableOpacity>
                    </>
                );
        }
    };

    return (
        <Modal animationType="fade" transparent={true} visible={isVisible} onRequestClose={onClose}>
            <View style={styles.centeredView}>
                <View style={styles.majordomoModalView}>
                    {renderContent()}
                </View>
            </View>
        </Modal>
    );
};
