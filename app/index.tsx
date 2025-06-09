import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Modal,
  Platform,
  Alert,
} from 'react-native';
// KROK 1: Importujemy now?, pot??n? bibliotek? Notifee
import notifee, { TimestampTrigger, TriggerType, AndroidImportance } from '@notifee/react-native';


const CustomButton = ({ title, onPress, style, textStyle }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <Text style={[styles.buttonText, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

const App = () => {
  const [hour, setHour] = useState('07');
  const [minute, setMinute] = useState('30');
  const [alarmMessage, setAlarmMessage] = useState('');
  const [plan, setPlan] = useState('');
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [selectedMood, setSelectedMood] = useState('Produktywny');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoadingTask, setIsLoadingTask] = useState(false);
  const [currentTask, setCurrentTask] = useState('');
  const [taskSteps, setTaskSteps] = useState('');

  const moods = ['Produktywny', 'Kreatywny', 'Spokojny'];
  const moodEmojis = {'Produktywny': '??', 'Kreatywny': '??', 'Spokojny': '??'};
  
  // Funkcja prosi o uprawnienia dla Notifee
  async function requestNotifeePermissions() {
    // Na nowszych wersjach Androida trzeba poprosi? o pozwolenie na wysy?anie powiadomie里
    if(Platform.OS === 'android' && Platform.Version >= 33) {
        await notifee.requestPermission();
    }
  }

  useEffect(() => {
    requestNotifeePermissions();
    generatePlan();
  }, []);

  const callGemini = async (prompt) => {
    const apiKey = "AIzaSyB-EGE7jFgFFO2SJLwz6o4rJw7gkSAYsiI"; 
    if (apiKey === "YOUR_API_KEY_HERE") throw new Error("API Key not provided.");
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
    const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error(`B??d API: ${response.statusText}`);
    const result = await response.json();
    if (result.candidates && result.candidates.length > 0) return result.candidates[0].content.parts[0].text;
    else throw new Error('Otrzymano nieprawid?ow? odpowied? od Gemini.');
  };

  const handleSetAlarm = async () => {
    const h = parseInt(hour, 10);
    const m = parseInt(minute, 10);
    if (isNaN(h) || h < 0 || h > 23 || isNaN(m) || m < 0 || m > 59) {
      Alert.alert('B??dna godzina', 'Prosz? wprowadzi? poprawn? godzin? (HH:MM).');
      return;
    }

    const now = new Date();
    const triggerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
    if (triggerDate <= now) {
      triggerDate.setDate(triggerDate.getDate() + 1);
    }
    
    try {
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: triggerDate.getTime(),
      };

      const channelId = await notifee.createChannel({
        id: 'alarm_channel',
        name: 'Alarmy Aplikacji',
        sound: 'default',
        vibration: true,
        vibrationPattern: [300, 500],
        importance: AndroidImportance.HIGH,
      });

      await notifee.cancelAllNotifications();

      await notifee.createTriggerNotification(
        {
          title: 'Poranny Asystent jest gotowy! ??',
          body: 'Kliknij, aby zobaczy? sw車j plan na dzi?!',
          android: {
            channelId,
            importance: AndroidImportance.HIGH,
            fullScreenAction: {
              id: 'default',
            },
          },
        },
        trigger,
      );

      const formattedDate = triggerDate.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });
      const formattedTime = triggerDate.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
      setAlarmMessage(`Alarm ustawiony na: ${formattedDate}, ${formattedTime}`);
      Alert.alert('Sukces!', `Prawdziwy alarm pe?noekranowy zosta? ustawiony.`);
    } catch (e) {
      console.error(e);
      Alert.alert('B??d', 'Wyst?pi? b??d podczas ustawiania alarmu z Notifee.');
    }
  };
  
  const getMockCalendarEvents = () => {
    return Promise.resolve([{ title: 'Spotkanie z zespo?em' }, { title: 'Wizyta u dentysty' }]);
  };

  const generatePlan = async () => {
    setIsLoadingPlan(true);
    setPlan('');
    try {
      const events = await getMockCalendarEvents();
      const eventsString = events.map(e => `- ${e.title}`).join('\n');
      const prompt = `Jeste? moim osobistym asystentem. M車j nastr車j na dzi? to: "${selectedMood}". Na podstawie poni?szych wydarze里 z kalendarza, stw車rz dla mnie motywuj?cy i dobrze zorganizowany plan. M車w do mnie bezpo?rednio. Podziel plan na sekcje. B?d? zwi?z?y, dodaj jedno zdanie motywacyjne. WA?NE: Ka?d? pozycj? z kalendarza oznacz jako '[ZADANIE]', np. 'Spotkanie z zespo?em [ZADANIE]'. Oto wydarzenia:\n${eventsString}`;
      const textResponse = await callGemini(prompt);
      setPlan(textResponse);
    } catch (error) {
      setPlan(`Przepraszam, wyst?pi? b??d: ${error.message}`);
    } finally {
      setIsLoadingPlan(false);
    }
  };

  const breakDownTask = async (taskTitle) => {
    setCurrentTask(taskTitle);
    setIsModalVisible(true);
    setIsLoadingTask(true);
    setTaskSteps('');
    try {
      const prompt = `Jeste? ekspertem od produktywno?ci. Moje g?車wne zadanie to: "${taskTitle}". Podziel to zadanie na 3 do 5 mniejszych, konkretnych i wykonalnych pod-zada里. Przedstaw je w formie listy punktowanej.`;
      const textResponse = await callGemini(prompt);
      setTaskSteps(textResponse);
    } catch(error) {
      setTaskSteps(`Wyst?pi? b??d: ${error.message}`);
    } finally {
      setIsLoadingTask(false);
    }
  };

  const renderPlan = () => {
    if (!plan) return null;
    return plan.split('\n').map((line, index) => {
      const isTask = line.includes('[ZADANIE]');
      const taskTitle = isTask ? line.replace('[ZADANIE]', '').trim() : '';
      if (isTask) return (<TouchableOpacity key={index} onPress={() => breakDownTask(taskTitle)}><Text style={styles.taskItem}>? {taskTitle}</Text></TouchableOpacity>);
      if (line.startsWith('## ')) return <Text key={index} style={styles.planSubtitle}>{line.replace('## ', '')}</Text>
      if (line.startsWith('* ')) return <Text key={index} style={styles.planListItem}>? {line.replace('* ', '')}</Text>
      return <Text key={index} style={styles.planText}>{line}</Text>;
    });
  };

  useEffect(() => {
    generatePlan();
  }, [selectedMood]);


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Poranny Asystent</Text>
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Ustaw godzin? pobudki</Text>
            <View style={styles.timeInputContainer}>
                <TextInput style={styles.timeInput} value={hour} onChangeText={setHour} keyboardType="number-pad" maxLength={2} />
                <Text style={styles.timeSeparator}>:</Text>
                <TextInput style={styles.timeInput} value={minute} onChangeText={setMinute} keyboardType="number-pad" maxLength={2} />
            </View>
            <CustomButton title="Zapisz godzin?" onPress={handleSetAlarm} />
            <Text style={styles.alarmMessage}>{alarmMessage}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>? Ustal Nastr車j Dnia</Text>
          <View style={styles.moodSelector}>
            {moods.map(mood => (
              <TouchableOpacity key={mood} style={[styles.moodButton, selectedMood === mood && styles.moodButtonSelected]} onPress={() => setSelectedMood(mood)}>
                <Text style={[styles.moodButtonText, selectedMood === mood && styles.moodButtonTextSelected]}>{mood} {moodEmojis[mood]}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.card}>
            <View style={styles.planHeader}>
                <Text style={styles.cardTitle}>Tw車j Plan Dnia</Text>
                <CustomButton title="Od?wie?" onPress={generatePlan} style={styles.refreshButton} textStyle={styles.refreshButtonText}/>
            </View>
            {isLoadingPlan ? <ActivityIndicator size="large" color="#3498db" style={styles.loader} /> : renderPlan()}
        </View>
      </ScrollView>
      <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.cardTitle}>? Podziel zadanie na kroki</Text>
                <Text style={styles.modalTaskTitle}>{currentTask}</Text>
                {isLoadingTask ? <ActivityIndicator size="large" color="#3498db" style={styles.loader} /> : <Text style={styles.planText}>{taskSteps.replace(/\* /g, '? ')}</Text>}
                <CustomButton title="Zamknij" onPress={() => setIsModalVisible(false)} style={{marginTop: 20}}/>
            </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  scrollContent: { padding: 20 },
  header: { fontSize: 32, fontWeight: 'bold', color: '#EAEAEA', textAlign: 'center', marginBottom: 30 },
  card: { backgroundColor: '#1E1E1E', borderRadius: 15, padding: 20, marginBottom: 25, borderWidth: 1, borderColor: '#2a2a2a' },
  cardTitle: { fontSize: 22, fontWeight: '600', color: '#EAEAEA', marginBottom: 15 },
  button: { backgroundColor: '#3498db', paddingVertical: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  timeInputContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
  timeInput: { color: '#EAEAEA', backgroundColor: '#2c2c2c', fontSize: 48, fontWeight: 'bold', textAlign: 'center', width: 100, borderRadius: 10, paddingVertical: 10 },
  timeSeparator: { color: '#EAEAEA', fontSize: 48, marginHorizontal: 10 },
  alarmMessage: { marginTop: 15, textAlign: 'center', color: '#3498db', fontSize: 16, minHeight: 20 },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  refreshButton: { backgroundColor: 'transparent', borderColor: '#3498db', borderWidth: 1, paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
  refreshButtonText: { color: '#3498db', fontSize: 14, fontWeight: 'bold' },
  loader: { marginVertical: 40 },
  planText: { fontSize: 16, color: '#DDD', lineHeight: 26 },
  planSubtitle: { fontSize: 18, fontWeight: 'bold', color: '#EAEAEA', marginTop: 15, marginBottom: 5 },
  planListItem: { fontSize: 16, color: '#DDD', lineHeight: 26, marginLeft: 10 },
  taskItem: { fontSize: 16, color: '#3498db', lineHeight: 26, textDecorationLine: 'underline', marginVertical: 4 },
  moodSelector: { flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', gap: 10 },
  moodButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, borderWidth: 1, borderColor: '#555' },
  moodButtonSelected: { backgroundColor: '#3498db', borderColor: '#3498db' },
  moodButtonText: { color: '#AAA' },
  moodButtonTextSelected: { color: '#FFF', fontWeight: 'bold' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
  modalContent: { backgroundColor: '#1E1E1E', borderRadius: 15, padding: 25, margin: 20, width: '90%', borderWidth: 1, borderColor: '#2a2a2a' },
  modalTaskTitle: { fontSize: 16, color: '#999', marginBottom: 20, fontStyle: 'italic' },
});

export default App;