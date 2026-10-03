document.addEventListener("DOMContentLoaded", async () => {
    if (window.lucide) { lucide.createIcons(); }

    const translations = {
        bn: {
            headerDesc: "বিশ্বমানের সম্পূর্ণ স্বয়ংক্রিয় এআই মিউজিক ও সোশ্যাল ভিডিও প্ল্যাটফর্ম",
            creditsText: "ক্রেডিট অবশিষ্ট",
            upgradeText: "আনলিমিটেড নিন",
            titleInput: "আপনার গানের ভাবনা লিখুন",
            placeholder: "যেমন: বর্ষার রাতে নদীর পাড়ে দাঁড়িয়ে ফেলে আসা স্মৃতির বাঁশির সুর...",
            songLang: "গানের ভাষা:",
            targetRegion: "🎯 টার্গেট দেশ ও সোশ্যাল মিডিয়া:",
            genreLbl: "সুর ও জনরা (Genres):",
            genreSearchPlaceholder: "🔍 জনরা খুঁজুন (বাউল, Rock, Lo-Fi, Classical)...",
            btnCreate: "সম্পূর্ণ গান তৈরি করুন (-১ ক্রেডিট)",
            consoleTitle: "লাইভ স্টুডিও আউটপুট",
            readyMsg: "ভাবনা লিখুন এবং গান তৈরি করুন বাটনে চাপ দিন।",
            downloadAudio: "MP3 অডিও",
            downloadVideo: "MP4 ভিডিও",
            license: "১০০% বাণিজ্যিক ও কপিরাইট মুক্ত লাইসেন্স অন্তর্ভুক্ত",
            about: "আমাদের সম্পর্কে",
            contact: "যোগাযোগ",
            terms: "শর্তাবলী",
            privacy: "গোপনীয়তা নীতি",
            refund: "রিফান্ড পলিসি"
        },
        en: {
            headerDesc: "Universal AI Music & Country-Targeted Viral Studio",
            creditsText: "Credits",
            upgradeText: "Get Unlimited",
            titleInput: "Write Your Song Concept",
            placeholder: "e.g. A peaceful acoustic melody under the rainy night...",
            songLang: "Song Language:",
            targetRegion: "🎯 Target Country & Dominant Social Media:",
            genreLbl: "Musical Tradition / Genre:",
            genreSearchPlaceholder: "🔍 Search Genre (e.g. Baul, Rock, Lo-Fi)...",
            btnCreate: "Generate Track (-1 Credit)",
            consoleTitle: "Live Studio Output",
            readyMsg: "Enter your prompt and click Generate Track to begin.",
            downloadAudio: "MP3",
            downloadVideo: "MP4 Video",
            license: "100% Commercial Copyright Free Certificate Included",
            about: "About Us",
            contact: "Contact Us",
            terms: "Terms of Service",
            privacy: "Privacy Policy",
            refund: "Refund Policy"
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
            license: "100% कमर्शियल कॉपीराइट फ्री लाइसेंस शामिल",
            about: "हमारे बारे में",
            contact: "संपर्क करें",
            terms: "सेवा की शर्तें",
            privacy: "गोपनीयता नीति",
            refund: "रिफंड नीति"
        }
    };

    const fallbackLanguages = [
        { code: "bn", name: "বাংলা (Bengali)", flag: "🇧🇩" },
        { code: "en", name: "English (Universal)", flag: "🌐" },
        { code: "hi", name: "हिन्दी (Hindi)", flag: "🇮🇳" },
        { code: "es", name: "Español (Spanish)", flag: "🇪🇸" },
        { code: "ar", name: "العربية (Arabic)", flag: "🇸🇦" },
        { code: "fr", name: "Français (French)", flag: "🇫🇷" },
        { code: "de", name: "Deutsch (German)", flag: "🇩🇪" },
        { code: "pt", name: "Português (Portuguese)", flag: "🇧🇷" },
        { code: "ru", name: "Русский (Russian)", flag: "🇷🇺" },
        { code: "ja", name: "日本語 (Japanese)", flag: "🇯🇵" },
        { code: "zh", name: "中文 (Chinese)", flag: "🇨🇳" }
    ];

    let userCredits = parseInt(localStorage.getItem("melody_credits") || "10");
    let savedCreations = JSON.parse(localStorage.getItem("melody_creations") || "[]");
    let currentLang = localStorage.getItem("selected_site_lang") || "bn";
    let allCategories = [];

    const creditBalanceEl = document.getElementById("creditBalance");
    const topCreationsCount = document.getElementById("topCreationsCount");
    const modalCreationsGrid = document.getElementById("modalCreationsGrid");
    const creationsModal = document.getElementById("creationsModal");
    const btnOpenCreations = document.getElementById("btnOpenCreations");
    const btnCloseCreations = document.getElementById("btnCloseCreations");

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
    const ctx = canvas ? canvas.getContext("2d") : null;
    const videoContainer = document.getElementById("videoContainer");
    const badgeAspect = document.getElementById("badgeAspect");

    let mediaRecorder = null;
    let recordedChunks = [];

    function updateCredits(count) {
        userCredits = count;
        localStorage.setItem("melody_credits", userCredits);
        if (creditBalanceEl) creditBalanceEl.innerText = userCredits;
    }

    async function loadLanguages() {
        let langs = fallbackLanguages;
        try {
            const res = await fetch("/languages.json");
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) langs = data;
            }
        } catch (e) {}

        if (siteLangSelect) siteLangSelect.innerHTML = "";
        if (songLangSelect) songLangSelect.innerHTML = "";

        langs.forEach(l => {
            const label = `${l.flag || "🌐"} ${l.name}`;
            if (siteLangSelect) siteLangSelect.appendChild(new Option(label, l.code));
            if (songLangSelect) songLangSelect.appendChild(new Option(label, l.code));
        });

        if (siteLangSelect) siteLangSelect.value = currentLang;
        if (songLangSelect) songLangSelect.value = currentLang;
    }

    async function loadGenres() {
        try {
            const res = await fetch("/genres.json");
            if (res.ok) {
                allCategories = await res.json();
            }
        } catch (e) {}
        renderGenres(allCategories, "");
    }

    function applyLanguage(lang) {
        currentLang = lang;
        localStorage.setItem("selected_site_lang", lang);

        const t = translations[lang] || translations["en"];

        if (document.getElementById("headerDesc")) document.getElementById("headerDesc").innerText = t.headerDesc;
        if (document.getElementById("lblCredits")) document.getElementById("lblCredits").innerText = t.creditsText;
        if (document.getElementById("btnUpgradeText")) document.getElementById("btnUpgradeText").innerText = t.upgradeText;
        if (document.getElementById("titleInputBox")) document.getElementById("titleInputBox").innerHTML = `<i data-lucide="sparkles" class="w-4 h-4 text-indigo-400"></i> ${t.titleInput}`;
        if (input) input.placeholder = t.placeholder;
        if (document.getElementById("lblSongLang")) document.getElementById("lblSongLang").innerText = t.songLang;
        if (document.getElementById("lblTargetRegion")) document.getElementById("lblTargetRegion").innerText = t.targetRegion;
        if (document.getElementById("lblGenre")) document.getElementById("lblGenre").innerText = t.genreLbl;
        if (genreSearch) genreSearch.placeholder = t.genreSearchPlaceholder;
        if (document.getElementById("btnCreateText")) document.getElementById("btnCreateText").innerText = t.btnCreate;
        if (document.getElementById("titleStudioConsole")) document.getElementById("titleStudioConsole").innerText = t.consoleTitle;
        if (document.getElementById("btnDownloadText")) document.getElementById("btnDownloadText").innerText = t.downloadAudio;
        if (document.getElementById("btnDownloadVideoText")) document.getElementById("btnDownloadVideoText").innerText = t.downloadVideo;
        if (document.getElementById("lblLicenseNotice")) document.getElementById("lblLicenseNotice").innerText = t.license;

        const fAbout = document.querySelector("footer a[href=\x27/about\x27]");
        const fContact = document.querySelector("footer a[href=\x27/contact\x27]");
        const fTerms = document.querySelector("footer a[href=\x27/terms\x27]");
        const fPrivacy = document.querySelector("footer a[href=\x27/privacy\x27]");
        const fRefund = document.querySelector("footer a[href=\x27/refund\x27]");

        if (fAbout && t.about) fAbout.innerText = t.about;
        if (fContact && t.contact) fContact.innerText = t.contact;
        if (fTerms && t.terms) fTerms.innerText = t.terms;
        if (fPrivacy && t.privacy) fPrivacy.innerText = t.privacy;
        if (fRefund && t.refund) fRefund.innerText = t.refund;

        renderGenres(allCategories, genreSearch ? genreSearch.value.trim() : "");
        if (window.lucide) { lucide.createIcons(); }
    }

    function renderGenres(categories, filterText = "") {
        if (!genreSelect) return;
        genreSelect.innerHTML = "";
        let count = 0;

        categories.forEach(cat => {
            const catName = (cat.category && (cat.category[currentLang] || cat.category["en"])) || "Music Category";
            const matched = (cat.genres || []).filter(g => {
                const name = g[currentLang] || g["en"] || "";
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

        if (genreCount) genreCount.innerText = `${count} Genres`;
    }

    await loadLanguages();
    await loadGenres();
    applyLanguage(currentLang);

    if (siteLangSelect) {
        siteLangSelect.addEventListener("change", (e) => {
            applyLanguage(e.target.value);
            if (songLangSelect) songLangSelect.value = e.target.value;
        });
    }

    if (genreSearch) {
        genreSearch.addEventListener("input", (e) => {
            renderGenres(allCategories, e.target.value.trim());
        });
    }

    try {
        const setRes = await fetch("/api/admin/site-settings");
        const setData = await setRes.json();
        if (setData.success) {
            if (setData.settings.bannerNotice && document.getElementById("liveBanner")) {
                document.getElementById("liveBanner").innerText = setData.settings.bannerNotice;
            }
            if (setData.settings.starterPrice && document.getElementById("dispStarterPrice")) {
                document.getElementById("dispStarterPrice").innerText = `₹${setData.settings.starterPrice}`;
            }
            if (setData.settings.creatorPrice && document.getElementById("dispCreatorPrice")) {
                document.getElementById("dispCreatorPrice").innerText = `₹${setData.settings.creatorPrice}`;
            }
        }
    } catch(e) {}

    if (countryTargetSelect) {
        countryTargetSelect.addEventListener("change", () => {
            const aspect = countryTargetSelect.options[countryTargetSelect.selectedIndex].dataset.aspect;
            if (aspect === "9:16") {
                if (videoContainer) videoContainer.className = "relative rounded-lg overflow-hidden border border-slate-800 max-h-80 aspect-[9/16] bg-black flex items-center justify-center mx-auto transition-all";
                if (badgeAspect) badgeAspect.innerText = "9:16 Shorts/TikTok Ready";
            } else {
                if (videoContainer) videoContainer.className = "relative rounded-lg overflow-hidden border border-slate-800 max-h-72 aspect-video bg-black flex items-center justify-center mx-auto transition-all";
                if (badgeAspect) badgeAspect.innerText = "16:9 YouTube HD Landscape";
            }
        });
    }

    function renderCreations() {
        if (topCreationsCount) topCreationsCount.innerText = savedCreations.length;
        if (!modalCreationsGrid) return;

        if (savedCreations.length === 0) {
            modalCreationsGrid.innerHTML = `
                <div class="col-span-full py-12 text-center text-slate-500 text-xs">
                    <i data-lucide="disc-3" class="w-8 h-8 mx-auto mb-2 opacity-40"></i>
                    এখনও কোনো গান তৈরি করেননি। ওপরের বক্সে ভাবনা লিখে গান তৈরি করুন!
                </div>
            `;
        } else {
            modalCreationsGrid.innerHTML = savedCreations.map((c, i) => `
                <div class="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                    <div>
                        <div class="flex items-center justify-between">
                            <span class="text-[10px] text-indigo-400 font-mono">${c.genre}</span>
                            <span class="text-[10px] text-slate-500 font-mono">${c.date}</span>
                        </div>
                        <h4 class="text-xs font-semibold text-white mt-1 truncate">${c.title}</h4>
                        <p class="text-[10px] text-slate-400 mt-0.5 line-clamp-2">${c.lyrics.slice(0, 80)}...</p>
                    </div>
                    <audio controls src="${c.audioUrl}" class="w-full h-7"></audio>
                    <div class="flex items-center justify-between pt-2 border-t border-slate-900">
                        <span class="text-[9px] text-emerald-400 font-mono">${c.licenseId}</span>
                        <a href="${c.audioUrl}" download="track-${i+1}.mp3" class="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                            <i data-lucide="download" class="w-3 h-3"></i> MP3 ডাউনলোড
                        </a>
                    </div>
                </div>
            `).join("");
        }
        if (window.lucide) { lucide.createIcons(); }
    }

    if (btnOpenCreations) {
        btnOpenCreations.addEventListener("click", () => {
            renderCreations();
            if (creationsModal) creationsModal.classList.remove("hidden");
        });
    }
    if (btnCloseCreations) {
        btnCloseCreations.addEventListener("click", () => {
            if (creationsModal) creationsModal.classList.add("hidden");
        });
    }

    const pricingModal = document.getElementById("pricingModal");
    if (document.getElementById("btnPricing")) {
        document.getElementById("btnPricing").addEventListener("click", () => pricingModal && pricingModal.classList.remove("hidden"));
    }
    if (document.getElementById("btnCloseModal")) {
        document.getElementById("btnCloseModal").addEventListener("click", () => pricingModal && pricingModal.classList.add("hidden"));
    }

    document.querySelectorAll(".buy-plan-btn").forEach(b => {
        b.addEventListener("click", () => {
            const added = parseInt(b.dataset.credits);
            updateCredits(userCredits + added);
            alert(`🎉 পেমেন্ট সফল! ${added} টি ক্রেডিট অ্যাকাউন্টে যুক্ত হয়েছে।`);
            if (pricingModal) pricingModal.classList.add("hidden");
        });
    });

    updateCredits(userCredits);
    renderCreations();

    function startVisualizerAndRecorder() {
        if (!canvas) return;
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
                if (downloadVideoLink) {
                    downloadVideoLink.href = URL.createObjectURL(blob);
                    downloadVideoLink.download = `melodyai-${Date.now()}.${mimeType === "video/mp4" ? "mp4" : "webm"}`;
                }
            };

            mediaRecorder.start();
            setTimeout(() => {
                if (mediaRecorder && mediaRecorder.state === "recording") {
                    mediaRecorder.stop();
                }
            }, 6000);
        } catch(e) {}

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

    if (btn) {
        btn.addEventListener("click", async () => {
            if (userCredits <= 0) {
                if (pricingModal) pricingModal.classList.remove("hidden");
                return alert("আপনার কোনো ক্রেডিট নেই! অনুগ্রহ করে ক্রেডিট রিচার্জ করুন।");
            }

            const text = input ? input.value.trim() : "";
            const genre = genreSelect ? genreSelect.value || "Modern Melody" : "Modern Melody";
            const targetSongLang = songLangSelect ? songLangSelect.value : "bn";
            const targetPlatform = countryTargetSelect ? countryTargetSelect.value : "global";

            if (!text) return alert("অনুগ্রহ করে আপনার গানের ভাবনাটি লিখুন।");

            updateCredits(userCredits - 1);
            btn.disabled = true;
            if (badgeStatus) {
                badgeStatus.innerText = "GENERATING";
                badgeStatus.className = "text-[10px] bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded animate-pulse";
            }
            if (playerSection) playerSection.classList.add("hidden");

            if (statusBox) statusBox.innerText = `[১/৩] এআই সুর ও লিরিক্স তৈরি হচ্ছে (${genre})...\n`;

            try {
                const lyrRes = await fetch("/api/generate-lyrics", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt: text, genre, language: targetSongLang })
                });
                const lyrData = await lyrRes.json();

                if (statusBox) statusBox.innerText += `[২/৩] অডিও হারমোনিক্স এবং সুর প্রসেস হচ্ছে...\n`;

                const audRes = await fetch("/api/generate-audio", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ lyrics: lyrData.lyrics, genre, prompt: text })
                });
                const audData = await audRes.json();

                if (statusBox) statusBox.innerText += `[৩/৩] সোশ্যাল মিডিয়ার ভাইরাল MP4 ভিডিও ফ্রেম তৈরি সম্পন্ন হচ্ছে...\n`;
                await fetch("/api/generate-video", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ audioUrl: audData.audioUrl, style: genre, platform: targetPlatform })
                });

                if (audData.success) {
                    if (statusBox) statusBox.innerText = `✨ সম্পূর্ণ গান ও লিরিক্স প্রস্তুত:\n\n${lyrData.lyrics}`;
                    if (trackTitle) trackTitle.innerText = text.slice(0, 24);
                    if (trackMeta && countryTargetSelect) trackMeta.innerText = `${genre} • সোশ্যাল ফরম্যাট: ${countryTargetSelect.options[countryTargetSelect.selectedIndex].text.slice(0, 20)}...`;
                    if (audioPlayer) audioPlayer.src = audData.audioUrl;
                    if (downloadAudioLink) downloadAudioLink.href = audData.audioUrl;
                    if (licenseCode) licenseCode.innerText = audData.licenseId;

                    if (playerSection) playerSection.classList.remove("hidden");
                    if (badgeStatus) {
                        badgeStatus.innerText = "READY";
                        badgeStatus.className = "text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-mono";
                    }

                    savedCreations.unshift({
                        title: text.slice(0, 30),
                        genre: genre,
                        lyrics: lyrData.lyrics,
                        audioUrl: audData.audioUrl,
                        licenseId: audData.licenseId,
                        date: new Date().toLocaleDateString()
                    });
                    localStorage.setItem("melody_creations", JSON.stringify(savedCreations));
                    renderCreations();

                    startVisualizerAndRecorder();
                    if (audioPlayer) audioPlayer.play().catch(() => {});
                }
            } catch(err) {
                if (statusBox) statusBox.innerText += "\nগান তৈরি করতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।";
                if (badgeStatus) badgeStatus.innerText = "FAILED";
            } finally {
                btn.disabled = false;
            }
        });
    }
});
