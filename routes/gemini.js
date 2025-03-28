const express = require("express");
const router = express.Router();
const {GoogleGenAI} = require("@google/genai")

// Initialize AI with API key
const ai = new GoogleGenAI({
  apiKey:process.env.GEMINI_KEY,
});

router.post("/gemini/process-task", async (req, res) => {
  try {
    const { taskText } = req.body;
    console.log(taskText);

    const prompt = `Extract task details from this text: "${taskText}". Provide a structured JSON response with "title" and "desc".`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents:prompt,
    });
    console.log(response.text);

    const cleanedText = response.text.replace(/^```json|```/g, "").trim();

    // Try parsing the cleaned response
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(cleanedText);
    } catch (error) {
      console.error("JSON Parsing Error:", error);
      jsonResponse = { rawText: cleanedText }; // Fallback if parsing fails
    }

    res.status(200).json({ message: "success", taskDetails: jsonResponse });
   
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
});


module.exports = router;
