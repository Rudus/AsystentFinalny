import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { styles } from '../styles.js';

const CustomButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.buttonBlack} onPress={onPress}>
    <Text style={styles.buttonBlackText}>{title}</Text>
  </TouchableOpacity>
);

export const TimeSetterWidget = ({ isVisible, initialHour, initialMinute, onSave }) => {
    const [hour, setHour] = useState(initialHour);
    const [minute, setMinute] = useState(initialMinute);

    useEffect(() => {
        setHour(initialHour);
        setMinute(initialMinute);
    }, [initialHour, initialMinute]);
    
    if (!isVisible) return null;

    const handleSave = () => {
        onSave({ hour, minute });
    };

    return (
        <View style={[styles.widget, { backgroundColor: '#F2A413' }]}>
            <Text style={[styles.widgetTitle, { color: 'black' }]}>Ustaw godzinę pobudki</Text>
            <View style={styles.timeInputContainerWidget}>
                <TextInput style={styles.timeInputWidget} value={hour} onChangeText={setHour} keyboardType="number-pad" maxLength={2} />
                <Text style={styles.timeSeparatorWidget}>:</Text>
                <TextInput style={styles.timeInputWidget} value={minute} onChangeText={setMinute} keyboardType="number-pad" maxLength={2} />
            </View>
            <CustomButton title="Zapisz" onPress={handleSave} />
        </View>
    );
};