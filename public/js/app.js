document.addEventListener("DOMContentLoaded", async () => {
    if (window.lucide) { lucide.createIcons(); }

    const translations = {
        bn: {
            headerDesc: "সারা বিশ্বের সমস্ত ভাষায় গান ও দেশের সোশ্যাল মিডিয়াভিত্তিক ভিডিও স্টুডিও",
            creditsText: "ক্রেডিট অবশিষ্ট",
            upgradeText: "আনলিমিটেড নিন",
            titleInput: "আপনার মাতৃভাষায় গানের ভাবনা লিখুন",
            placeholder: "যেমন: বর্ষার রাতে নদীর পাড়ে দাঁড়িয়ে ফেলে আসা স্মৃতির বাঁশির সুর...",
            songLang: "গানের ভাষা:",
            targetRegion: "🎯 টার্গেট দেশ ও সবচেয়ে জনপ্রিয় সোশ্যাল মিডিয়া:",
            genreLbl: "সুর ও জনরা (Genres):",
            genreSearchPlaceholder: "🔍 জনরা খুঁজুন (বাউল, Rock, Lo-Fi, Classical)...",
            btnCreate: "গান ও ভিডিও তৈরি করুন (-১ ক্রেডিট)",
            consoleTitle: "লাইভ স্টুডিও আউটপুট",
            readyMsg: "দেশ ও সোশ্যাল মিডিয়া বেছে নিয়ে বাটনে চাপুন।",
            download: "ডাউনলোড",
            license: "১০০% বাণিজ্যিক ও কপিরাইট মুক্ত লাইসেন্স অন্তর্ভুক্ত"
        },
        en: {
            headerDesc: "Universal AI Music & Country-Targeted Viral Studio",
            creditsText: "Credits",
            upgradeText: "Get Unlimited",
            titleInput: "Write Your Song Concept",
            placeholder: "e.g. A romantic acoustic love ballad under the rainy night...",
            songLang: "Song Language:",
            targetRegion: "🎯 Target Country & Dominant Social Media:",
            genreLbl: "Musical Tradition / Genre:",
            genreSearchPlaceholder: "🔍 Search Genre (e.g. Baul, Rock, Lo-Fi, Pop)...",
            btnCreate: "Generate Track (-1 Credit)",
            consoleTitle: "Live Studio Output",
            readyMsg: "Select target country and click Generate Track to begin.",
            download: "Download",
            license: "100% Commercial Copyright Free Certificate Included"
        },
        hi: {
            headerDesc: "विश्व की सभी भाषाओं में संगीत और देश-विशिष्ट वायरल वीडियो स्टूडियो",
            creditsText: "क्रेडिट शेष",
            upgradeText: "अनलिमिटेड लें",
            titleInput: "अपनी मातृभाषा में गीत की सोच लिखें",
            placeholder: "उदा: चांदनी रात में खोई हुई यादों का एक शांत अकॉस्टिक गीत...",
            songLang: "गीत की भाषा:",
            targetRegion: "🎯 लक्षित देश और प्रमुख सोशल मीडिया:",
            genreLbl: "संगीत शैली (Genre):",
            genreSearchPlaceholder: "🔍 शैली खोजें (शास्त्रीय, रॉक, गज़ल, पॉप)...",
            btnCreate: "गीत और वीडियो बनाएं (-1 क्रेडिट)",
            consoleTitle: "लाइव स्टूडियो आउटपुट",
            readyMsg: "देश और प्लेटफॉर्म चुनें और गीत बनाएं बटन दबाएं।",
            download: "डाउनलोड",
            license: "100% कमर्शियल कॉपीराइट फ्री लाइसेंस शामिल"
        }
    };

    let userCredits = parseInt(localStorage.getItem("melody_credits") || "5");
    const creditBalanceEl = document.getElementById("creditBalance");
    function updateCredits(count) {
        userCredits = count;
        localStorage.setItem("melody_credits", userCredits);
        creditBalanceEl.innerText = userCredits;
    }
    updateCredits(userCredits);

    const siteLangSelect = document.getElementById("siteLangSelect");
    const songLangSelect = document.getElementById("songLangSelect");
    const countryTargetSelect = document.getElementById("countryTargetSelect");
    const platformHint = document.getElementById("platformHint");
    const btn = document.getElementById("submitBtn");
    const input = document.getElementById("promptInput");
    const genreSelect = document.getElementById("genreSelect");
    const genreSearch = document.getElementById("genreSearch");
    const genreCount = document.getElementById("genreCount");
    const statusBox = document.getElementById("statusBox");
    const badgeStatus = document.getElementById("badgeStatus");
    const playerSection = document.getElementById("playerSection");
    const audioPlayer = document.getElementById("audioPlayer");
    const downloadAudioLink = document.getElementById("downloadAudioLink");
    const trackTitle = document.getElementById("trackTitle");
    const trackMeta = document.getElementById("trackMeta");
    const licenseCode = document.getElementById("licenseCode");
    const canvas = document.getElementById("visualCanvas");
    const ctx = canvas.getContext("2d");
    const videoContainer = document.getElementById("videoContainer");
    const badgeAspect = document.getElementById("badgeAspect");

    const pricingModal = document.getElementById("pricingModal");
    document.getElementById("btnPricing").addEventListener("click", () => pricingModal.classList.remove("hidden"));
    document.getElementById("btnCloseModal").addEventListener("click", () => pricingModal.classList.add("hidden"));

    document.querySelectorAll(".buy-plan-btn").forEach(b => {
        b.addEventListener("click", () => {
            const added = parseInt(b.dataset.credits);
            updateCredits(userCredits + added);
            alert(`🎉 Success! Added ${added} credits to your account.`);
            pricingModal.classList.add("hidden");
        });
    });

    // দেশের সোশ্যাল মিডিয়া বদলালে ভিডিও অ্যাসপেক্ট রেশিও অ্যাডাপ্ট করা
    countryTargetSelect.addEventListener("change", () => {
        const selected = countryTargetSelect.options[countryTargetSelect.selectedIndex];
        const aspect = selected.dataset.aspect;
        if (aspect === "9:16") {
            videoContainer.className = "relative rounded-lg overflow-hidden border border-slate-800 max-h-80 aspect-[9/16] bg-black flex items-center justify-center mx-auto transition-all duration-300";
            badgeAspect.innerText = "9:16 Viral Mode (TikTok / Shorts / Reels)";
            platformHint.innerText = "⚡ 9:16 Vertical Viral Algorithm Active for this Region";
        } else {
            videoContainer.className = "relative rounded-lg overflow-hidden border border-slate-800 max-h-72 aspect-video bg-black flex items-center justify-center mx-auto transition-all duration-300";
            badgeAspect.innerText = "16:9 Landscape Mode (YouTube / X HD)";
            platformHint.innerText = "📺 16:9 Cinematic Landscape Algorithm Active for this Region";
        }
    });

    let currentLang = "en";
    let allCategories = [];

    try {
        const langRes = await fetch("/languages.json");
        const languages = await langRes.json();
        languages.forEach(l => {
            siteLangSelect.appendChild(new Option(`${l.flag} ${l.name}`, l.code));
            songLangSelect.appendChild(new Option(`${l.flag} ${l.name}`, l.code));
        });
        siteLangSelect.value = "en";
        songLangSelect.value = "en";
    } catch(e) {}

    try {
        const genRes = await fetch("/genres.json");
        allCategories = await genRes.json();
    } catch(e) {}

    function applyLanguage(lang) {
        currentLang = lang;
        const t = translations[lang] || translations["en"];

        document.getElementById("headerDesc").innerText = t.headerDesc;
        document.getElementById("lblCredits").innerText = t.creditsText;
        document.getElementById("btnUpgradeText").innerText = t.upgradeText;
        document.getElementById("titleInputBox").innerHTML = `<i data-lucide="sparkles" class="w-4 h-4 text-indigo-400"></i> ${t.titleInput}`;
        input.placeholder = t.placeholder;
        document.getElementById("lblSongLang").innerText = t.songLang;
        document.getElementById("lblTargetRegion").innerText = t.targetRegion;
        document.getElementById("lblGenre").innerText = t.genreLbl;
        genreSearch.placeholder = t.genreSearchPlaceholder;
        document.getElementById("btnCreateText").innerText = t.btnCreate;
        document.getElementById("titleStudioConsole").innerText = t.consoleTitle;
        document.getElementById("btnDownloadText").innerText = t.download;
        document.getElementById("lblLicenseNotice").innerText = t.license;

        renderGenres(allCategories, genreSearch.value.trim());
        if (window.lucide) { lucide.createIcons(); }
    }

    function renderGenres(categories, filterText = "") {
        genreSelect.innerHTML = "";
        let count = 0;
        categories.forEach(cat => {
            const catName = cat.category[currentLang] || cat.category["en"];
            const matched = cat.genres.filter(g => {
                const name = g[currentLang] || g["en"];
                return name.toLowerCase().includes(filterText.toLowerCase()) || catName.toLowerCase().includes(filterText.toLowerCase());
            });

            if (matched.length > 0) {
                const group = document.createElement("optgroup");
                group.label = catName;
                matched.forEach(g => {
                    const gName = g[currentLang] || g["en"];
                    group.appendChild(new Option(gName, gName));
                    count++;
                });
                genreSelect.appendChild(group);
            }
        });
        genreCount.innerText = `${count} Genres`;
    }

    siteLangSelect.addEventListener("change", (e) => {
        applyLanguage(e.target.value);
        songLangSelect.value = e.target.value;
    });

    genreSearch.addEventListener("input", (e) => renderGenres(allCategories, e.target.value.trim()));
    applyLanguage("en");

    let animationId;
    function startVisualizer() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;

        function draw() {
            ctx.fillStyle = "rgba(2, 6, 23, 0.25)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const bars = 36;
            const w = canvas.width / bars;

            for (let i = 0; i < bars; i++) {
                const h = Math.random() * (canvas.height * 0.75) + 12;
                const x = i * w;
                const y = (canvas.height - h) / 2;

                const grad = ctx.createLinearGradient(0, y, 0, y + h);
                grad.addColorStop(0, "#ec4899");
                grad.addColorStop(0.5, "#8b5cf6");
                grad.addColorStop(1, "#3b82f6");

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.roundRect(x + 2, y, w - 4, h, 4);
                ctx.fill();
            }
            animationId = requestAnimationFrame(draw);
        }
        draw();
    }

    btn.addEventListener("click", async () => {
        if (userCredits <= 0) {
            pricingModal.classList.remove("hidden");
            return alert("You have 0 credits left! Please upgrade to continue.");
        }

        const text = input.value.trim();
        const genre = genreSelect.value || "Modern Melody";
        const targetSongLang = songLangSelect.value;
        const targetPlatform = countryTargetSelect.value;

        if (!text) return alert("Please enter a song concept or prompt.");

        updateCredits(userCredits - 1);

        btn.disabled = true;
        badgeStatus.innerText = "PROCESSING";
        badgeStatus.className = "text-[10px] bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded animate-pulse";
        playerSection.classList.add("hidden");

        statusBox.innerText = `[1/3] Generating lyrics in ${targetSongLang.toUpperCase()} (${genre})...\n`;

        try {
            const lyrRes = await fetch("/api/generate-lyrics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: text, genre, language: targetSongLang })
            });
            const lyrData = await lyrRes.json();

            statusBox.innerText += `[2/3] Synthesizing audio & vocal harmonics...\n`;

            const audRes = await fetch("/api/generate-audio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lyrics: lyrData.lyrics, genre, prompt: text })
            });
            const audData = await audRes.json();

            statusBox.innerText += `[3/3] Encoding video optimized for target region (${targetPlatform.toUpperCase()})...\n`;
            await fetch("/api/generate-video", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ audioUrl: audData.audioUrl, style: genre, platform: targetPlatform })
            });

            if (audData.success) {
                statusBox.innerText = `✨ Lyrics Generated (${targetSongLang.toUpperCase()}):\n\n${lyrData.lyrics}\n\n[Social Media Optimization Complete]`;
                
                trackTitle.innerText = text.slice(0, 24);
                trackMeta.innerText = `Region: ${targetPlatform.toUpperCase()} • ${genre}`;
                audioPlayer.src = audData.audioUrl;
                downloadAudioLink.href = audData.audioUrl;
                licenseCode.innerText = audData.licenseId;
                
                playerSection.classList.remove("hidden");
                badgeStatus.innerText = "COMPLETED";
                badgeStatus.className = "text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-mono";

                startVisualizer();
                audioPlayer.play().catch(() => {});
            }
        } catch(err) {
            statusBox.innerText += "\nError generating track. Please retry.";
            badgeStatus.innerText = "FAILED";
        } finally {
            btn.disabled = false;
        }
    });

    document.getElementById("btnShareSocial").addEventListener("click", () => {
        if (navigator.share) {
            navigator.share({
                title: "Viral AI Music Track",
                text: "Listen to my original AI track created with MelodyAI!",
                url: window.location.href
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Platform link copied to clipboard!");
        }
    });
});
