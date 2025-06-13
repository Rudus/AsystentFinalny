// Plik: api/getPreparationPlan.js
// =========================================================================================
// Ta funkcja serwerowa przyjmuje listę wydarzeń, pyta Gemini o plan przygotowań
// i zwraca odpowiedź w formacie JSON.

export default async function handler(request, response) {
    // 1. Sprawdzamy, czy zapytanie jest typu POST
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    // 2. Bezpiecznie odczytujemy klucz API ze zmiennych środowiskowych Vercela
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        console.error("Brak klucza GEMINI_API_KEY w zmiennych środowiskowych Vercela.");
        return response.status(500).json({ error: 'Brak konfiguracji serwera: Klucz API nie jest ustawiony.' });
    }

    try {
        // 3. Odczytujemy listę tytułów wydarzeń z ciała zapytania
        const { events } = request.body;

        if (!events || !Array.isArray(events) || events.length === 0) {
            return response.status(400).json({ error: 'Nieprawidłowe dane wejściowe: Oczekiwano tablicy "events".' });
        }

        // 4. Tworzymy precyzyjny prompt dla Gemini
        const prompt = `
            Jesteś ekspertem od produktywności i osobistym asystentem.
            Twoim zadaniem jest stworzenie listy zadań przygotowawczych dla podanych wydarzeń.
            
            Dla każdego z wydarzeń z poniższej listy, przygotuj 2-3 konkretne, krótkie zadania do wykonania.
            Skup się na praktycznych czynnościach, które pomogą mi się dobrze przygotować.

            Zwróć odpowiedź TYLKO I WYŁĄCZNIE jako string JSON, który jest tablicą obiektów.
            Każdy obiekt w tablicy musi mieć klucze "eventTitle" (string) i "tasks" (tablica stringów).
            Nie dodawaj żadnych dodatkowych słów, formatowania markdown, ani bloku kodu (np. \`\`\`json).
            Twoja odpowiedź musi być idealnie parsowalna przez JSON.parse().

            Oto wydarzenia: ${JSON.stringify(events)}
        `;

        // 5. Wysyłamy zapytanie do API Gemini
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

        // 6. Czyścimy i parsujemy odpowiedź, aby upewnić się, że jest to poprawny JSON
        const cleanedJsonString = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const preparationPlan = JSON.parse(cleanedJsonString);

        // 7. Odsyłamy gotowy plan do aplikacji
        response.status(200).json({ plan: preparationPlan });

    } catch (error) {
        console.error('Błąd w funkcji getPreparationPlan:', error);
        response.status(500).json({ error: error.message });
    }
}
