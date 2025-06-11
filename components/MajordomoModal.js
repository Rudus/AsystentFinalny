import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { styles } from '../styles.js';

export const MajordomoModal = ({ isVisible, onClose, onPlanRequest, persona, updatePersona }) => {
    const suggestions = [
        { id: 'tires', icon: '🚗', title: 'Wymiana opon', description: 'Zbliża się nowy sezon.' },
        { id: 'dentist', icon: '🦷', title: 'Wizyta u dentysty', description: 'Pamiętaj o regularnej kontroli.' },
    ];

    const visibleSuggestions = suggestions.filter(s => !persona[s.id]);

    const handleDismiss = (suggestionId) => {
        updatePersona({ [suggestionId]: 'dismissed' });
    };

    if(visibleSuggestions.length === 0 && isVisible) {
        // Jeśli nie ma nic do pokazania, po prostu zamknij modal
        onClose();
        return null;
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}>
            <View style={styles.centeredView}>
                <View style={styles.majordomoModalView}>
                    <Text style={styles.majordomoTitle}>Sugestie Asystenta 🤵‍♂️</Text>
                    <Text style={styles.majordomoSubtitle}>Pamiętajmy o kilku ważnych sprawach.</Text>

                    {visibleSuggestions.map((item) => (
                        // POPRAWKA: Używamy stabilnego klucza `item.id`
                        <View key={item.id} style={styles.suggestionCard}>
                            <Text style={{fontSize: 40}}>{item.icon}</Text>
                            <View style={{flex: 1, marginHorizontal: 16}}>
                                <Text style={styles.suggestionTitle}>{item.title}</Text>
                                <Text style={styles.suggestionDesc}>{item.description}</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => onPlanRequest(item.title)} style={[styles.suggestionButton, {backgroundColor: '#16a34a'}]}>
                                    <Text>✓</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDismiss(item.id)} style={[styles.suggestionButton, {backgroundColor: '#ef4444', marginTop: 8}]}>
                                    <Text>×</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                    <TouchableOpacity onPress={onClose} style={styles.closeMajordomoButton}>
                        <Text style={{color: 'white', fontWeight: 'bold'}}>Pokaż mój plan dnia</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};