import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles'; // Importujemy style

export const Timeline = ({ tasks, onEventPress }) => {
  const timeToMinutes = (time) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };
  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const sortedTasks = tasks.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));

  return sortedTasks.map((task, index) => {
    const startTimeMinutes = timeToMinutes(task.time);
    const endTimeMinutes = startTimeMinutes + task.duration;
    const endTime = formatTime(endTimeMinutes);

    let freeTimeElement = null;
    if (index < sortedTasks.length - 1) {
      const nextTaskStartTimeMinutes = timeToMinutes(sortedTasks[index + 1].time);
      const freeTime = nextTaskStartTimeMinutes - endTimeMinutes;
      if (freeTime > 0) {
        freeTimeElement = (
          <View style={styles.freeTimeSlot}>
            <View style={styles.freeTimePlus}><Text style={styles.freeTimePlusText}>+</Text></View>
            <Text style={styles.freeTimeText}>{freeTime} min czasu wolnego</Text>
          </View>
        );
      }
    }

    return (
      <TouchableOpacity key={index} onPress={() => onEventPress(task)}>
        <View style={styles.timelineItem}>
          <View style={[styles.timelineDot, { backgroundColor: task.color }]} />
          <View style={[styles.timelineContent, { backgroundColor: task.color }]}>
            <Text style={styles.timelineTime}>{task.time} - {endTime} ({task.duration} min)</Text>
            <Text style={styles.timelineTitle}>{task.title}</Text>
          </View>
          {freeTimeElement}
        </View>
      </TouchableOpacity>
    );
  });
};