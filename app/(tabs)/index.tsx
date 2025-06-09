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
import * as Notifications from 'expo-notifications';

// Konfiguracja, jak powiadomienie ma się zachowywać, gdy aplikacja jest aktywna
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

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
  const moodEmojis = {'Produktywny': '💻', 'Kreatywny': '🎨', 'Spokojny': '🧘'};
  
  // --- ZMIANA: Tworzymy dedykowany kanał dla alarmów ---
  const ALARM_CHANNEL_ID = 'alarm_channel';

  const registerForPushNotificationsAsync = async () => {
    if (Platform.OS === 'android') {
      // Stworzenie dedykowanego kanału dla alarmów o najwyższym priorytecie
      await Notifications.setNotificationChannelAsync(ALARM_CHANNEL_ID, {
        name: 'Alarmy Asystenta',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250, 250, 250],
        sound: 'default', // W przyszłości można dodać własny dźwięk
        lightColor: '#FF231F7C',
        bypassDnd: true, // Omiń tryb "Nie przeszkadzać"
      });
    }

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Błąd uprawnień', 'Nie udało się uzyskać uprawnień do wysyłania powiadomień!');
      return false;
    }
    return true;
  }

  useEffect(() => {
    registerForPushNotificationsAsync();
    generatePlan();
  }, []);


  const callGemini = async (prompt) => {
    const apiKey = "AIzaSyB-EGE7jFgFFO2SJLwz6o4rJw7gkSAYsiI"; 
    if (apiKey === "YOUR_API_KEY_HERE") {
        throw new Error("API Key not provided.");
    }
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
    const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error(`Błąd API: ${response.statusText}`);
    const result = await response.json();
    if (result.candidates && result.candidates.length > 0) {
        return result.candidates[0].content.parts[0].text;
    } else {
        throw new Error('Otrzymano nieprawidłową odpowiedź od Gemini.');
    }
  };

  const handleSetAlarm = async () => {
    const h = parseInt(hour, 10);
    const m = parseInt(minute, 10);
    if (isNaN(h) || h < 0 || h > 23 || isNaN(m) || m < 0 || m > 59) {
      setAlarmMessage('Wprowadź poprawną godzinę (HH:MM).');
      return;
    }

    await Notifications.cancelAllScheduledNotificationsAsync();

    const now = new Date();
    const triggerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);

    if (triggerDate < now) {
        triggerDate.setDate(triggerDate.getDate() + 1);
    }
    
    try {
        // --- ZMIANA: Planujemy powiadomienie w naszym nowym, specjalnym kanale ---
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Poranny Asystent jest gotowy! ☀️",
                body: 'Kliknij, aby zobaczyć swój plan na dziś!',
                sound: 'default',
                priority: Notifications.AndroidNotificationPriority.MAX,
                sticky: true, // "Przykleja" powiadomienie, utrudniając jego przypadkowe odrzucenie
                vibrate: [0, 250, 250, 250, 250, 250], // Wibracja specyficzna dla alarmu
            },
            trigger: {
                channelId: ALARM_CHANNEL_ID, // Użyj dedykowanego kanału
                date: triggerDate,
            }
        });
        const formattedDate = triggerDate.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });
        const formattedTime = triggerDate.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
        setAlarmMessage(`Alarm ustawiony na: ${formattedDate}, ${formattedTime}`);
        Alert.alert('Sukces!', `Alarm pełnoekranowy został pomyślnie ustawiony.`);
    } catch (e) {
        console.error(e);
        Alert.alert('Błąd', 'Wystąpił błąd podczas ustawiania alarmu.');
    }
  };
  
  const getMockCalendarEvents = () => {
    return Promise.resolve([
        { title: 'Spotkanie z zespołem marketingowym' },
        { title: 'Wizyta u dentysty' },
    ]);
  };

  const generatePlan = async () => {
    setIsLoadingPlan(true);
    setPlan('');
    try {
        const events = await getMockCalendarEvents();
        const eventsString = events.map(e => `- ${e.title}`).join('\n');
        const prompt = `Jesteś moim osobistym asystentem. Mój nastrój na dziś to: "${selectedMood}". Na podstawie poniższych wydarzeń z kalendarza, stwórz dla mnie motywujący i dobrze zorganizowany plan. Mów do mnie bezpośrednio. Podziel plan na sekcje. Bądź zwięzły, dodaj jedno zdanie motywacyjne na początek. WAŻNE: Każdą pozycję z kalendarza oznacz jako '[ZADANIE]', np. 'Spotkanie z zespołem marketingowym [ZADANIE]'. Oto wydarzenia:\n${eventsString}`;
        const textResponse = await callGemini(prompt);
        setPlan(textResponse);
    } catch (error) {
      setPlan(`Przepraszam, wystąpił błąd: ${error.message}`);
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
        const prompt = `Jesteś ekspertem od produktywności. Moje główne zadanie to: "${taskTitle}". Podziel to zadanie na 3 do 5 mniejszych, konkretnych i wykonalnych pod-zadań. Przedstaw je w formie listy punktowanej.`;
        const textResponse = await callGemini(prompt);
        setTaskSteps(textResponse);
    } catch(error) {
        setTaskSteps(`Wystąpił błąd: ${error.message}`);
    } finally {
        setIsLoadingTask(false);
    }
  };

  const renderPlan = () => {
    if (!plan) return null;
    return plan.split('\n').map((line, index) => {
      const isTask = line.includes('[ZADANIE]');
      const taskTitle = isTask ? line.replace('[ZADANIE]', '').trim() : '';
      if (isTask) return (<TouchableOpacity key={index} onPress={() => breakDownTask(taskTitle)}><Text style={styles.taskItem}>✨ {taskTitle}</Text></TouchableOpacity>);
      if (line.startsWith('## ')) return <Text key={index} style={styles.planSubtitle}>{line.replace('## ', '')}</Text>
      if (line.startsWith('* ')) return <Text key={index} style={styles.planListItem}>• {line.replace('* ', '')}</Text>
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
            <Text style={styles.cardTitle}>Ustaw godzinę pobudki</Text>
            <View style={styles.timeInputContainer}>
                <TextInput style={styles.timeInput} value={hour} onChangeText={setHour} keyboardType="number-pad" maxLength={2} />
                <Text style={styles.timeSeparator}>:</Text>
                <TextInput style={styles.timeInput} value={minute} onChangeText={setMinute} keyboardType="number-pad" maxLength={2} />
            </View>
            <CustomButton title="Zapisz godzinę" onPress={handleSetAlarm} />
            <Text style={styles.alarmMessage}>{alarmMessage}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>✨ Ustal Nastrój Dnia</Text>
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
                <Text style={styles.cardTitle}>Twój Plan Dnia</Text>
                <CustomButton title="Odśwież" onPress={generatePlan} style={styles.refreshButton} textStyle={styles.refreshButtonText}/>
            </View>
            {isLoadingPlan ? <ActivityIndicator size="large" color="#3498db" style={styles.loader} /> : renderPlan()}
        </View>
      </ScrollView>
      <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.cardTitle}>✨ Podziel zadanie na kroki</Text>
                <Text style={styles.modalTaskTitle}>{currentTask}</Text>
                {isLoadingTask ? <ActivityIndicator size="large" color="#3498db" style={styles.loader} /> : <Text style={styles.planText}>{taskSteps.replace(/\* /g, '• ')}</Text>}
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