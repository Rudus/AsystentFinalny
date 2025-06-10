import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles.js';

export const TimelineWidget = ({ title, tasks, dayKey, onEventPress, onAddPress, isToday = false }) => {
    const timeToMinutes = (time) => { const [h,m]=time.split(':').map(Number); return h*60+m; };
    const formatTime = (minutes) => { const h=Math.floor(minutes/60),m=minutes%60; return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`; };
    const sortedTasks = [...tasks].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));

    return (
        <View style={[styles.widget, isToday ? styles.pinkWidget : styles.darkWidget]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={[styles.widgetTitleSmall, isToday ? { color: 'black' } : { color: '#9CA3AF'}]}>{title}</Text>
                <TouchableOpacity onPress={() => onAddPress(null, dayKey)} style={[styles.addButton, isToday ? {backgroundColor: 'rgba(0,0,0,0.1)'} : {backgroundColor: 'rgba(255,255,255,0.1)'}]}>
                    <Text style={[isToday ? {color: 'black'} : {color: 'white'}]}>+</Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.timeline, isToday ? {borderLeftColor: 'rgba(0,0,0,0.15)'} : {borderLeftColor: 'rgba(255,255,255,0.15)'}]}>
                {sortedTasks.length === 0 && <Text style={[styles.emptyTimelineText, isToday ? {color: 'black'} : {}]}>Brak zaplanowanych wydarzeń.</Text>}
                {sortedTasks.map((task, index) => {
                    const startTimeMinutes = timeToMinutes(task.time);
                    const endTimeMinutes = startTimeMinutes + task.duration;
                    const endTime = formatTime(endTimeMinutes);
                    let freeTimeElement = null;
                    if (index < sortedTasks.length - 1) {
                        const freeTime = timeToMinutes(sortedTasks[index + 1].time) - endTimeMinutes;
                        if (freeTime > 0) {
                            freeTimeElement = <TouchableOpacity onPress={() => onAddPress(endTime, dayKey)} style={styles.freeTimeSlot}><Text style={[styles.addEventText, isToday ? {color: 'rgba(0,0,0,0.5)'} : {}]}>+ Dodaj ({freeTime} min)</Text></TouchableOpacity>;
                        }
                    }
                    return (
                        <View key={task.id}>
                            <TouchableOpacity onPress={() => onEventPress(task, dayKey)} style={styles.timelineItem}>
                                <View style={[styles.timelineDot, { backgroundColor: task.color, borderColor: isToday ? '#F4C2C4' : '#1C1C1E'}]} />
                                <View style={{ marginLeft: 24 }}>
                                    <Text style={[styles.timelineTitle, isToday ? {color: 'black'} : {}]}>{task.title}</Text>
                                    <Text style={[styles.timelineTime, isToday ? {color: 'rgba(0,0,0,0.7)'} : {}]}>{task.time} ({task.duration} min)</Text>
                                </View>
                            </TouchableOpacity>
                            {freeTimeElement}
                        </View>
                    );
                })}
            </View>
        </View>
    );
};