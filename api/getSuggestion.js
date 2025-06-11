// Importujemy naszą bazę sugestii. Musi być ona również wgrana na GitHuba.
import { allSuggestions } from '../data/suggestions.js';

export default async function handler(request, response) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  try {
    const persona = request.body?.persona || {};

    const filteredSuggestions = allSuggestions.filter(suggestion => {
        if (suggestion.personaKey && persona[suggestion.personaKey] === false) {
            return false;
        }
        return true;
    }).map(s => s.title);

    // --- POPRAWIONY, BARDZIEJ "STANOWCZY" PROMPT ---
    const prompt = `
      Twoim zadaniem jest przetworzenie listy zadań i zwrócenie odpowiedzi w formacie JSON.
      Dziś jest ${new Date().toLocaleDateString('pl-PL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
      Biorąc to pod uwagę, wybierz 3 najważniejsze lub najbardziej adekwatne zadania z poniższej listy:
      ${JSON.stringify(filteredSuggestions)}.

      Dla każdego z wybranych 3 zadań, stwórz krótki, jednozdaniowy, przyjazny opis, który zachęci użytkownika do działania.

      Zwróć odpowiedź TYLKO I WYŁĄCZNIE jako string JSON, który jest tablicą obiektów.
      Nie dodawaj żadnych innych słów, formatowania markdown, ani bloku kodu (np. \`\`\`json).
      Twoja odpowiedź musi być idealnie parsowalna przez JSON.parse().

      Przykład idealnej odpowiedzi:
      [{"key": "Wizyta u dentysty", "description": "Regularne kontrole to klucz do zdrowego uśmiechu. Może to dobry moment, by umówić wizytę?"},{"key": "Rozliczenie podatków", "description": "Ostateczny termin zbliża się wielkimi krokami. Nie zostawiaj tego na ostatnią chwilę!"},{"key": "Wymiana opon", "description": "Nadchodzi nowy sezon, warto pomyśleć o bezpieczeństwie na drodze."}]
    `;

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        throw new Error(`Błąd odpowiedzi od Gemini: ${errorText}`);
    }

    const result = await geminiResponse.json();

    // --- MECHANIZM ZABEZPIECZAJĄCY ---
    // Próbujemy "oczyścić" odpowiedź, jeśli Gemini dodało niepotrzebne formatowanie
    let rawText = result.candidates[0].content.parts[0].text;
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const suggestions = JSON.parse(rawText);
    response.status(200).json({ suggestions });

  } catch (error) {
    console.error('Błąd w funkcji getSuggestion:', error);
    response.status(500).json({ error: error.message });
  }
}
