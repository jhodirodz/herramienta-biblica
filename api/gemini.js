export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo POST permitido' });
  }

  // Obtenemos la clave desde las variables de entorno de Vercel
  const apiKey = process.env.GEMINI_API_KEY;
  
  // Usamos el mismo modelo que tienes configurado en el frontend
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Pasamos exactamente el mismo payload que envía el index.html
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    // Devolvemos la data tal cual la entrega Google, 
    // así el frontend la puede procesar como ya lo hace hoy.
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor', details: err.message });
  }
}
