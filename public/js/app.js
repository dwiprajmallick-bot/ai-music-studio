document.addEventListener("DOMContentLoaded", async () => {
    if (window.lucide) { lucide.createIcons(); }

    const translations = {
        bn: {
            headerDesc: "বিশ্বমানের সম্পূর্ণ স্বয়ংক্রিয় এআই মিউজিক ও সোশ্যাল ভিডিও প্ল্যাটফর্ম",
            creditsText: "ক্রেডিট অবশিষ্ট",
            upgradeText: "আনলিমিটেড নিন",
            titleInput: "আপনার গানের ভাবনা লিখুন",
            placeholder: "যেমন: বর্ষার রাতে নদীর পাড়ে দাঁড়িয়ে ফেলে আসা স্মৃতির বাঁশির সুর...",
            songLang: "গানের ভাষা:",
            targetRegion: "🎯 টার্গেট দেশ ও সোশ্যাল মিডিয়া:",
            genreLbl: "সুর ও জনরা (Genres):",
            genreSearchPlaceholder: "🔍 জনরা খুঁজুন (বাউল, Rock, Lo-Fi, Classical)...",
            btnCreate: "সম্পূর্ণ গান তৈরি করুন (-১ ক্রেডিট)",
            consoleTitle: "লাইভ স্টুডিও আউটপুট",
            readyMsg: "ভাবনা লিখুন এবং গান তৈরি করুন বাটনে চাপ দিন।",
            downloadAudio: "MP3 অডিও",
            downloadVideo: "MP4 ভিডিও",
            license: "১০০% বাণিজ্যিক ও কপিরাইট মুক্ত লাইসেন্স অন্তর্ভুক্ত"
        },
        en: {
            headerDesc: "Autonomous Universal AI Music & Social Video Engine",
            creditsText: "Credits",
            upgradeText: "Get Unlimited",
            titleInput: "Write Your Song Concept",
            placeholder: "e.g. A peaceful acoustic melody under the rainy night...",
            songLang: "Song Language:",
            targetRegion: "🎯 Target Country & Social Media:",
            genreLbl: "Musical Tradition / Genre:",
            genreSearchPlaceholder: "🔍 Search Genre (e.g. Baul, Rock, Lo-Fi)...",
            btnCreate: "Generate Track (-1 Credit)",
            consoleTitle: "Live Studio Output",
            readyMsg: "Enter your prompt and click Generate Track.",
            downloadAudio: "MP3",
            downloadVideo: "MP4 Video",
            license: "100% Commercial Copyright Free Certificate Included"
        },
        hi: {
            headerDesc: "विश्वस्तरीय स्वचालित एआई संगीत एवं सोशल मीडिया वीडियो स्टूडियो",
            creditsText: "क्रेडिट शेष",
            upgradeText: "अनलिमिटेड लें",
            titleInput: "अपनी सोच लिखें",
            placeholder: "उदा: चांदनी रात में खोई हुई यादों का एक शांत अकॉस्टिक गीत...",
            songLang: "गीत की भाषा:",
            targetRegion: "🎯 लक्षित देश और सोशल मीडिया:",
            genreLbl: "संगीत शैली (Genre):",
            genreSearchPlaceholder: "🔍 शैली खोजें...",
            btnCreate: "गीत बनाएं (-1 क्रेडिट)",
            consoleTitle: "लाइव स्टूडियो आउटपुट",
            readyMsg: "विचार लिखें और गीत बनाएं बटन दबाएं।",
            downloadAudio: "MP3 ऑडियो",
            downloadVideo: "MP4 वीडियो",
            license: "100% कमर्शियल कॉपीराइट फ्री लाइसेंस शामिल"
        }
    };

    let userCredits = parseInt(localStorage.getItem("melody_credits") || "10");
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
    const downloadVideoLink = document.getElementById("downloadVideoLink");
    const trackTitle = document.getElementById("trackTitle");
    const trackMeta = document.getElementById("trackMeta");
    const licenseCode = document.getElementById("licenseCode");
    const canvas = document.getElementById("visualCanvas");
    const ctx = canvas.getContext("2d");
    const videoContainer = document.getElementById("videoContainer");
    const badgeAspect = document.getElementById("badgeAspect");

    let mediaRecorder = null;
    let recordedChunks = [];

    const pricingModal = document.getElementById("pricingModal");
    document.getElementById("btnPricing").addEventListener("click", () => pricingModal.classList.remove("hidden"));
    document.getElementById("btnCloseModal").addEventListener("click", () => pricingModal.classList.add("hidden"));

    document.querySelectorAll(".buy-plan-btn").forEach(b => {
        b.addEventListener("click", () => {
            const added = parseInt(b.dataset.credits);
            updateCredits(userCredits + added);
            alert(`🎉 Success! Added ${added} credits.`);
            pricingModal.classList.add("hidden");
        });
    });

    countryTargetSelect.addEventListener("change", () => {
        const aspect = countryTargetSelect.options[countryTargetSelect.selectedIndex].dataset.aspect;
        if (aspect === "9:16") {
            videoContainer.className = "relative rounded-lg overflow-hidden border border-slate-800 max-h-80 aspect-[9/16] bg-black flex items-center justify-center mx-auto transition-all";
            badgeAspect.innerText = "9:16 Shorts/TikTok Ready";
        } else {
            videoContainer.className = "relative rounded-lg overflow-hidden border border-slate-800 max-h-72 aspect-video bg-black flex items-center justify-center mx-auto transition-all";
            badgeAspect.innerText = "16:9 YouTube HD Landscape";
        }
    });

    let currentLang = "bn";
    let allCategories = [];

    try {
        const langRes = await fetch("/languages.json");
        const languages = await langRes.json();
        languages.forEach(l => {
            siteLangSelect.appendChild(new Option(`${l.flag} ${l.name}`, l.code));
            songLangSelect.appendChild(new Option(`${l.flag} ${l.name}`, l.code));
        });
        siteLangSelect.value = "bn";
        songLangSelect.value = "bn";
    } catch(e) {}

    try {
        const genRes = await fetch("/genres.json");
        allCategories = await genRes.json();
    } catch(e) {}

    function applyLanguage(lang) {
        currentLang = lang;
        const t = translations[lang] || translations["bn"];

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
        document.getElementById("btnDownloadText").innerText = t.downloadAudio;
        document.getElementById("btnDownloadVideoText").innerText = t.downloadVideo;
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
    applyLanguage("bn");

    // Audio Visualizer & Video Stream Capture
    function startVisualizerAndRecorder() {
        canvas.width = canvas.parentElement.clientWidth || 360;
        canvas.height = canvas.parentElement.clientHeight || 480;

        try {
            const canvasStream = canvas.captureStream(30);
            recordedChunks = [];
            
            const mimeType = MediaRecorder.isTypeSupported("video/mp4") ? "video/mp4" : "video/webm";
            mediaRecorder = new MediaRecorder(canvasStream, { mimeType });

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) recordedChunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: mimeType });
                downloadVideoLink.href = URL.createObjectURL(blob);
                downloadVideoLink.download = `melodyai-${Date.now()}.${mimeType === "video/mp4" ? "mp4" : "webm"}`;
            };

            mediaRecorder.start();
            setTimeout(() => {
                if (mediaRecorder && mediaRecorder.state === "recording") {
                    mediaRecorder.stop();
                }
            }, 6000);
        } catch (e) {
            console.log("Recorder initialized:", e);
        }

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
            requestAnimationFrame(draw);
        }
        draw();
    }

    btn.addEventListener("click", async () => {
        if (userCredits <= 0) {
            pricingModal.classList.remove("hidden");
            return alert("আপনার কোনো ক্রেডিট নেই! অনুগ্রহ করে আনলিমিটেড প্ল্যান নিন।");
        }

        const text = input.value.trim();
        const genre = genreSelect.value || "Modern Melody";
        const targetSongLang = songLangSelect.value;
        const targetPlatform = countryTargetSelect.value;

        if (!text) return alert("অনুগ্রহ করে আপনার গানের ভাবনাটি লিখুন।");

        updateCredits(userCredits - 1);

        btn.disabled = true;
        badgeStatus.innerText = "GENERATING";
        badgeStatus.className = "text-[10px] bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded animate-pulse";
        playerSection.classList.add("hidden");

        statusBox.innerText = `[১/৩] এআই সুর ও কাব্যিক লিরিক্স তৈরি হচ্ছে (${genre})...\n`;

        try {
            const lyrRes = await fetch("/api/generate-lyrics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: text, genre, language: targetSongLang })
            });
            const lyrData = await lyrRes.json();

            statusBox.innerText += `[২/৩] স্টুডিও কোয়ালিটি হারমোনিক্স এবং অডিও প্রসেস হচ্ছে...\n`;

            const audRes = await fetch("/api/generate-audio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lyrics: lyrData.lyrics, genre, prompt: text })
            });
            const audData = await audRes.json();

            statusBox.innerText += `[৩/৩] সোশ্যাল মিডিয়ার ভাইরাল MP4 ভিডিও ফ্রেম এনকোড সম্পন্ন হচ্ছে...\n`;
            await fetch("/api/generate-video", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ audioUrl: audData.audioUrl, style: genre, platform: targetPlatform })
            });

            if (audData.success) {
                statusBox.innerText = `✨ সম্পূর্ণ গান ও লিরিক্স প্রস্তুত:\n\n${lyrData.lyrics}`;
                
                trackTitle.innerText = text.slice(0, 24);
                trackMeta.innerText = `${genre} • সোশ্যাল ফরম্যাট: ${countryTargetSelect.options[countryTargetSelect.selectedIndex].text.slice(0, 20)}...`;
                audioPlayer.src = audData.audioUrl;
                downloadAudioLink.href = audData.audioUrl;
                licenseCode.innerText = audData.licenseId;
                
                playerSection.classList.remove("hidden");
                badgeStatus.innerText = "READY";
                badgeStatus.className = "text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-mono";

                startVisualizerAndRecorder();
                audioPlayer.play().catch(() => {});
            }
        } catch(err) {
            statusBox.innerText += "\nগান তৈরি করতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।";
            badgeStatus.innerText = "FAILED";
        } finally {
            btn.disabled = false;
        }
    });

    document.getElementById("btnShareSocial").addEventListener("click", () => {
        if (navigator.share) {
            navigator.share({
                title: "My AI Song",
                text: "MelodyAI Pro দিয়ে তৈরি আমার গান শুনুন!",
                url: window.location.href
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("ওয়েবসাইটের লিংক কপি করা হয়েছে!");
        }
    });
});
