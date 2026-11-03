import "dotenv/config";

const getGeminiAPIResponse = async (message) => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("Google API key is missing from Backend/.env");
    }

    const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: message }]
                    }
                ]
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        console.error("Gemini API Error:", response.status, data);
        throw new Error(
            data?.error?.message || "Gemini API request failed"
        );
    }

    const reply = data?.candidates?.[0]?.content?.parts
        ?.map(part => part.text || "")
        .join("");

    if (!reply?.trim()) {
        throw new Error("Gemini returned no text response.");
    }

    return reply;
};

export default getGeminiAPIResponse;
