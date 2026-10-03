const axios = require("axios");

class AILyricsService {
    static async generate(prompt, languageCode = "bn", genre = "Melody") {
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey || apiKey === "your_openai_key_here") {
            return this.generateSimulatedLyrics(prompt, languageCode, genre);
        }

        try {
            const systemPrompt = `You are a legendary global music composer and lyricist capable of writing fluently in any world language.
Target Language Code: ${languageCode}
Genre / Musical Tradition: ${genre}

Rules:
1. Write 100% original, poetic lyrics entirely in the requested language script.
2. Structure: [Intro], [Verse 1], [Chorus], [Verse 2], [Chorus], [Outro].
3. Ensure exact rhyming patterns and meter suitable for singing. Zero copyright infringement.`;

            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: `Song Concept/Theme: ${prompt}` }
                    ],
                    temperature: 0.75
                },
                {
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error("AI API Call error, switching to native fallback generator:", error.message);
            return this.generateSimulatedLyrics(prompt, languageCode, genre);
        }
    }

    static generateSimulatedLyrics(prompt, lang, genre) {
        const sampleDictionary = {
            bn: `[সুর: ${genre} | ভাবনা: ${prompt}]\n\n[স্থায়ী]\nমেঘের ডানায় ভেসে আসা এক অচিন সুরের তান,\nমনের কোণে জেগে ওঠে নতুন দিনের গান।\n\n[অন্তরা]\nসীমানা ছাড়িয়ে সুর চলে যায় দূর দিগন্তের তীরে,\nসব ভাষা আজ এক হয়ে যায় ভালোবাসার নীড়ে...`,
            en: `[Style: ${genre} | Prompt: ${prompt}]\n\n[Verse 1]\nWhispers in the morning light, carried by the breeze,\nA universal melody flowing through the trees.\n\n[Chorus]\nAcross all lands and borders, under the same blue sky,\nOur voices rise together where spirits never die...`,
            hi: `[शैली: ${genre} | विषय: ${prompt}]\n\n[मुखड़ा]\nहवाओं में बहती हुई एक प्यारी सी धुन,\nदिल की गहराइयों से आज नई आवाज़ को सुन।\n\n[अंतरा]\nहर ज़ुबान की अपनी मिठास, हर सुर में है जान,\nसंगीत के इस संगम से सजा है ये जहाँ...`,
            es: `[Estilo: ${genre} | Tema: ${prompt}]\n\n[Verso 1]\nBajo el cielo estrellado despierta una canción,\nUn ritmo sin fronteras que abraza el corazón.\n\n[Coro]\nCanta el viento libremente en cada despertar,\nLa música une al mundo entero en un solo lugar...`,
            ar: `[النمط: ${genre} | الموضوع: ${prompt}]\n\n[المقدمة]\nأنغام تطير عبر الأفق بلا حدود،\nتجمع القلوب بنور الوجود.\n\n[اللازمة]\nصوت الحياة ينادي في كل مكان،\nتتلاقى اللغات في أعذب الألحان...`
        };

        return sampleDictionary[lang] || sampleDictionary["en"];
    }
}

module.exports = AILyricsService;
