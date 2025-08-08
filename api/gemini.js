export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo POST permitido' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  const userPrompt = req.body.prompt;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userPrompt }] }]
      })
    });

    const data = await response.json();

    const output = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sin respuesta de Gemini";

    res.status(200).json({ result: output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en servidor' });
  }
}
