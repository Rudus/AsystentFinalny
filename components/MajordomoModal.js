import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { styles } from '../styles.js';

export const MajordomoModal = ({ isVisible, onClose, onPlanRequest }) => {
    const suggestions = [
        { icon: '🚗', title: 'Wymiana opon', description: 'Zbliża się nowy sezon.' },
        { icon: '🦷', title: 'Wizyta u dentysty', description: 'Pamiętaj o regularnej kontroli.' },
    ];

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

                    {suggestions.map((item, index) => (
                        <View key={index} style={styles.suggestionCard}>
                            <Text style={{fontSize: 40}}>{item.icon}</Text>
                            <View style={{flex: 1, marginHorizontal: 16}}>
                                <Text style={styles.suggestionTitle}>{item.title}</Text>
                                <Text style={styles.suggestionDesc}>{item.description}</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => onPlanRequest(item.title)} style={[styles.suggestionButton, {backgroundColor: '#16a34a'}]}>
                                    <Text>✓</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.suggestionButton, {backgroundColor: '#ef4444', marginTop: 8}]}>
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