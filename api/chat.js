/**
 * EcoHeritage AI - Vercel Serverless Function cho Chatbot
 * 
 * File này hoạt động như một API Proxy trung gian ở phía máy chủ (Serverless),
 * giúp gọi trực tiếp tới Google Gemini API mà không để lộ API Key ở phía Client-side.
 */

module.exports = async function handler(req, res) {
    // 1. Chỉ chấp nhận các yêu cầu gửi bằng phương thức POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Phương thức không được hỗ trợ (Method Not Allowed)' });
    }

    // 2. Trích xuất câu hỏi (query) và chỉ dẫn hệ thống (systemPrompt) từ body của request
    const { query, systemPrompt } = req.body;

    // 3. Lấy API Key từ biến môi trường của hệ thống (Vercel Environment Variables)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Lỗi cấu hình: Gemini API Key chưa được cài đặt trên server.' });
    }

    try {
        // 4. Thực hiện gửi yêu cầu (fetch request) trực tiếp tới Google Gemini API
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                // Cấu hình vai trò cho AI (chuyên gia y học cổ truyền Đông y)
                system_instruction: { parts: [{ text: systemPrompt }] },
                // Nội dung câu hỏi người dùng
                contents: [{ parts: [{ text: query }] }],
                // Cài đặt thông số sinh văn bản (độ sáng tạo nhiệt độ 0.7, độ dài tối đa 1024 tokens)
                generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
            })
        });

        // 5. Nếu API Google trả về mã lỗi (không phải 2xx)
        if (!response.ok) {
            const errText = await response.text();
            console.error('Gemini API Error Response:', errText);
            return res.status(response.status).json({ error: `Lỗi kết nối Gemini API: ${response.statusText}` });
        }

        // 6. Phân tích kết quả JSON và trích xuất chuỗi văn bản trả lời của AI
        const data = await response.json();
        const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        // 7. Trả kết quả về cho client với mã trạng thái 200 OK
        return res.status(200).json({ text: aiText });

    } catch (error) {
        // Xử lý các lỗi kết nối mạng hoặc lỗi cú pháp runtime
        console.error('Serverless function error:', error);
        return res.status(500).json({ error: 'Lỗi máy chủ nội bộ (Internal Server Error)' });
    }
}
