const AILyricsService = require("../services/aiLyricsService");
const AIAudioService = require("../services/aiAudioService");
const AIVideoService = require("../services/aiVideoService");

exports.generateLyrics = async (req, res) => {
    try {
        const { prompt, language, genre } = req.body;
        if (!prompt) return res.status(400).json({ success: false, message: "Prompt is required" });

        const lyrics = await AILyricsService.generate(prompt, language, genre);
        res.json({ success: true, prompt, language, genre, lyrics });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.generateAudio = async (req, res) => {
    try {
        const { lyrics, genre, prompt } = req.body;
        const audioData = await AIAudioService.generate(lyrics, genre, prompt);

        res.json({
            success: true,
            genre: genre || "Melody",
            ...audioData,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.generateVideo = async (req, res) => {
    try {
        const { audioUrl, style, prompt, language } = req.body;
        const videoData = await AIVideoService.generate(audioUrl, style, prompt, language);

        res.json({
            success: true,
            ...videoData,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
