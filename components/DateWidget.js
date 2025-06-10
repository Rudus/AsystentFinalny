import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles.js';

export const DateWidget = () => {
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('pl-PL', { weekday: 'long' }).toUpperCase();
    const dayAndMonth = today.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' }).toUpperCase();

    return (
        <View style={[styles.widget, styles.darkWidget, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
            <View>
                <Text style={styles.dateWidgetDay}>{dayOfWeek}</Text>
                <Text style={styles.dateWidgetDate}>{dayAndMonth}</Text>
            </View>
            <Text style={{ fontSize: 50 }}>🗓️</Text>
        </View>
    );
};