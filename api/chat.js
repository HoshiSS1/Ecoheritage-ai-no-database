module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
    const { query, systemPrompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Gemini API Key is not configured on the server.' });
    }
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: [{ parts: [{ text: query }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
            })
        });
        if (!response.ok) {
            const errText = await response.text();
            console.error('Gemini API Error Response:', errText);
            return res.status(response.status).json({ error: `Gemini API Error: ${response.statusText}` });
        }
        const data = await response.json();
        return res.status(200).json({ text: data?.candidates?.[0]?.content?.parts?.[0]?.text });
    } catch (error) {
        console.error('Serverless function error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
