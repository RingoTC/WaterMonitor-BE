const OpenAI = require("openai");
const express = require('express');
const router = express.Router();

const fetchChatGPT = async (place) => {
    const openai = new OpenAI({
        apiKey: "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",
        dangerouslyAllowBrowser:true,
    });

    try {
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are required to provide a brief introduction about the city user mentioned in English and no more than 60 words." },{ role: "user", content: place }],
            model: "gpt-3.5-turbo",
        });
        console.log(chatCompletion);
        return chatCompletion;
    } catch (error) {
        return {
            "status": "error",
            "message": error.message,
        }
    }
};

router.get('/:place', async (req, res) => {
    const place = req.params.place;
    const result = await fetchChatGPT(place);
    res.json({
        "status": "success",
        "data": result.choices[0].message.content,
    });
});

module.exports = router;
