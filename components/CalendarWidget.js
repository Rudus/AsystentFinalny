import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles.js';

export const CalendarWidget = ({ events, onDateSelect, selectedDateKey }) => {
    const today = new Date();
    const days = Array.from({ length: 21 }, (_, i) => {
        const date = new Date();
        date.setDate(today.getDate() + i);
        const dateString = date.toISOString().slice(0, 10);
        return {
            day: date.getDate(),
            isToday: i === 0,
            dateKey: dateString,
            eventCount: (events[dateString] || []).length
        };
    });

    return (
        <View style={[styles.widget, styles.darkWidget]}>
            <View style={styles.calendarHeader}>
                {['PN','WT','ŚR','CZ','PT','SO','ND'].map(day => <Text key={day} style={styles.calendarDayName}>{day}</Text>)}
            </View>
            <View style={styles.calendarGrid}>
                {days.map((day) => (
                    <TouchableOpacity key={day.dateKey} style={styles.calendarCell} onPress={() => onDateSelect(day.dateKey)}>
                        <View style={[styles.calendarDay, day.isToday && styles.calendarDayToday, day.dateKey === selectedDateKey && styles.calendarDaySelected]}>
                            <Text style={(day.isToday || day.dateKey === selectedDateKey) ? {color: 'black'} : {color: 'white'}}>{day.day}</Text>
                        </View>
                        {day.eventCount > 0 &&
                            <View style={styles.dotsContainer}>
                                {Array.from({length: Math.min(day.eventCount, 4)}, (_, i) => <View key={`${day.dateKey}-dot-${i}`} style={styles.eventDot} />)}
                            </View>
                        }
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};