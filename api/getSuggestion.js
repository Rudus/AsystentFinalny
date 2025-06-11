// Plik: /api/getSuggestion.js
export default async function handler(request, response) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const { mood } = request.body;
  const prompt = `Jesteś moim majordomusem. Jest ${new Date().toLocaleDateString('pl-PL')}. Mój nastrój to "${mood}". Zaproponuj mi 2 ważne, życiowe zadania, o których mogłem zapomnieć.`;

  try {
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    if (!geminiResponse.ok) {
      throw new Error('Błąd odpowiedzi od Gemini');
    }

    const result = await geminiResponse.json();
    const suggestionText = result.candidates[0].content.parts[0].text;
    response.status(200).json({ suggestion: suggestionText });
  } catch (error) {
    response.status(500).json({ error: 'Nie udało się pobrać sugestii.' });
  }
}
