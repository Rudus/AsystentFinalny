import { allSuggestions } from '../data/suggestions.js';

export default async function handler(request, response) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  try {
    // Krok 1: Odbierz dane z aplikacji
    const { persona } = request.body;

    // Krok 2: Filtruj sugestie na podstawie persony
    const filteredSuggestions = allSuggestions.filter(suggestion => {
        if (suggestion.personaKey && persona[suggestion.personaKey] === false) {
            return false;
        }
        return true;
    }).map(s => s.title); // Bierzemy tylko nazwy, aby dać je Gemini

    // Krok 3: Stwórz inteligentny prompt dla Gemini
    const prompt = `
      Jesteś proaktywnym, pomocnym asystentem-majordomusem. Dziś jest ${new Date().toLocaleDateString('pl-PL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
      Twoim zadaniem jest wybranie 3 najważniejszych lub najbardziej adekwatnych zadań z poniższej listy i stworzenie dla nich krótkiego, przyjaznego opisu.
      Lista potencjalnych zadań: ${JSON.stringify(filteredSuggestions)}.

      Zwróć odpowiedź TYLKO I WYŁĄCZNIE w formacie JSON, jako tablica obiektów. Nie dodawaj żadnych innych słów ani formatowania markdown.
      Przykład formatu:
      [
        {"key": "Wizyta u dentysty", "description": "Regularne kontrole to klucz do zdrowego uśmiechu. Może to dobry moment, by umówić wizytę?"},
        {"key": "Rozliczenie podatków", "description": "Ostateczny termin zbliża się wielkimi krokami. Nie zostawiaj tego na ostatnią chwilę!"},
        {"key": "Wymiana opon", "description": "Nadchodzi nowy sezon, warto pomyśleć o bezpieczeństwie na drodze."}
      ]
    `;

    // Krok 4: Wywołaj Gemini
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
    const rawText = result.candidates[0].content.parts[0].text;
    
    // Krok 5: Sparsuj odpowiedź JSON i odeślij do aplikacji
    const suggestions = JSON.parse(rawText);
    response.status(200).json({ suggestions });

  } catch (error) {
    console.error('Błąd w funkcji getSuggestion:', error);
    response.status(500).json({ error: error.message });
  }
}
