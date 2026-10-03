document.addEventListener("DOMContentLoaded", () => {
    if (window.lucide) { lucide.createIcons(); }

    const worldLanguages = [
        { code: "en", name: "English", native: "English", flag: "🇺🇸" },
        { code: "bn", name: "Bengali", native: "বাংলা", flag: "🇧🇩" },
        { code: "hi", name: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
        { code: "es", name: "Spanish", native: "Español", flag: "🇪🇸" },
        { code: "ar", name: "Arabic", native: "العربية", flag: "🇸🇦" },
        { code: "fr", name: "French", native: "Français", flag: "🇫🇷" },
        { code: "de", name: "German", native: "Deutsch", flag: "🇩🇪" },
        { code: "ru", name: "Russian", native: "Русский", flag: "🇷🇺" },
        { code: "ja", name: "Japanese", native: "日本語", flag: "🇯🇵" },
        { code: "zh", name: "Chinese", native: "中文", flag: "🇨🇳" },
        { code: "pt", name: "Portuguese", native: "Português", flag: "🇧🇷" },
        { code: "ur", name: "Urdu", native: "اردো", flag: "🇵🇰" },
        { code: "ta", name: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
        { code: "te", name: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
        { code: "tr", name: "Turkish", native: "Türkçe", flag: "🇹🇷" },
        { code: "it", name: "Italian", native: "Italiano", flag: "🇮🇹" },
        { code: "ko", name: "Korean", native: "한국어", flag: "🇰🇷" },
        { code: "id", name: "Indonesian", native: "Bahasa Indonesia", flag: "🇮🇩" }
    ];

    const dictionary = {
        en: {
            subHeader: "Universal AI Music & Video Generation in Any Language",
            titleInput: "Write Your Song Concept",
            placeholder: "Write in any language... e.g. A peaceful acoustic melody under the stars...",
            songLang: "Song Native Language:",
            genreLbl: "Musical Tradition / Genre:",
            genreSearchPlaceholder: "🔍 Search Genre (e.g., Classical, Jazz, Rock)...",
            formatLbl: "Output Format:",
            formats: {
                audio_video: "Song + Animated Visualizer (Video Sync)",
                audio_only: "Audio Track Only (WAV / MP3)"
            },
            btnCreate: "Generate Track Now",
            consoleTitle: "Live Studio Output",
            readyMsg: "Enter your prompt and choose your genre to begin.",
            download: "Download",
            license: "100% Royalty Free Commercial License",
            historyTitle: "Your Created Songs Library",
            emptyHistory: "No tracks created yet. Generate your first song above!"
        },
        bn: {
            subHeader: "সারা বিশ্বের সমস্ত ভাষায় গান ও ভিডিও স্টুডিও",
            titleInput: "আপনার মাতৃভাষায় গানের ভাবনা লিখুন",
            placeholder: "যেকোনো ভাষায় লিখুন... যেমন: বৃষ্টির রাতে ফেলে আসা স্মৃতির সুর...",
            songLang: "গানের ভাষা (Song Language):",
            genreLbl: "সুর ও জনরা (Genres):",
            genreSearchPlaceholder: "🔍 জনরা খুঁজুন (যেমন: বাউল, Classical, Lo-Fi)...",
            formatLbl: "আউটপুট ফরম্যাট:",
            formats: {
                audio_video: "গান + অ্যানিমেটেড ভিডিও (Video Sync)",
                audio_only: "শুধু অডিও গান (WAV / MP3)"
            },
            btnCreate: "তৈরি করুন (Generate Song)",
            consoleTitle: "লাইভ স্টুডিও কনসোল",
            readyMsg: "আপনার মাতৃভাষায় গানের ভাবনা লিখে তৈরি করুন বাটনে চাপুন।",
            download: "ডাউনলোড",
            license: "১০০% রয়্যালটি ও কপিরাইট মুক্ত লাইসেন্স",
            historyTitle: "আপনার তৈরি করা গানের লাইব্রেরি",
            emptyHistory: "এখনও কোনো গান তৈরি করেননি। ওপরে আপনার প্রথম গানটি তৈরি করুন!"
        },
        hi: {
            subHeader: "विश्व की सभी भाषाओं में एआई संगीत और वीडियो स्टूडियो",
            titleInput: "अपनी मातृभाषा में गीत की सोच लिखें",
            placeholder: "किसी भी भाषा में लिखें... जैसे: चांदनी रात में खोई हुई यादों का सुर...",
            songLang: "गीत की भाषा:",
            genreLbl: "संगीत शैली (Genre):",
            genreSearchPlaceholder: "🔍 शैली खोजें (उदा: शास्त्रीय, रॉक, जैज़)...",
            formatLbl: "आउटपुट प्रारूप:",
            formats: {
                audio_video: "गीत + एनिमेटेड वीडियो (Video Sync)",
                audio_only: "केवल ऑडियो गीत (WAV / MP3)"
            },
            btnCreate: "गीत तैयार करें (Generate Song)",
            consoleTitle: "लाइव स्टूडियो कंसोल",
            readyMsg: "अपनी भाषा में विचार लिखें और तैयार करें बटन दबाएं।",
            download: "डाउनलोड",
            license: "100% रॉयल्टी और कॉपीराइट मुक्त",
            historyTitle: "आपकी बनाई गई गानों की लाइब्रेरी",
            emptyHistory: "अभी तक कोई गाना नहीं बनाया गया। ऊपर अपना पहला गाना बनाएं!"
        },
        es: {
            subHeader: "Estudio Universal de Música y Video IA en Cualquier Idioma",
            titleInput: "Escribe la idea de tu canción en tu propio idioma",
            placeholder: "Escribe en cualquier idioma... ej. Una balada suave bajo la lluvia...",
            songLang: "Idioma de la canción:",
            genreLbl: "Género musical:",
            genreSearchPlaceholder: "🔍 Buscar género...",
            formatLbl: "Formato de salida:",
            formats: {
                audio_video: "Canción + Visualizador (Video Sync)",
                audio_only: "Solo Pista de Audio (WAV / MP3)"
            },
            btnCreate: "Generar Canción Ahora",
            consoleTitle: "Salida del Estudio en Vivo",
            readyMsg: "Introduce tu idea y selecciona un género para comenzar.",
            download: "Descargar",
            license: "Licencia 100% Libre de Derechos de Autor",
            historyTitle: "Tu Biblioteca de Canciones Creadas",
            emptyHistory: "¡Aún no hay canciones! Genera tu primera pista arriba."
        }
    };

    const genreCategories = [
        {
            category: { en: "Indian & South Asian", bn: "ভারতীয় ও দক্ষিণ এশীয় সংগীত", hi: "भारतीय शास्त्रीय और लोक" },
            genres: [
                { en: "Hindustani Classical (Khayal / Dhrupad)", bn: "হিন্দুস্তানি শাস্ত্রীয় (খেয়াল / ধ্রুপদ)", hi: "हिन्दुस्तानी शास्त्रीय" },
                { en: "Carnatic Classical", bn: "কর্ণাটক শাস্ত্রীয়", hi: "कर्नाटक शास्त्रीय" },
                { en: "Baul Folk Fusion", bn: "বাউল / ফোক (Baul Folk)", hi: "बाउल लोकगीत" },
                { en: "Sufi Qawwali", bn: "কাওয়ালি (Sufi Qawwali)", hi: "सूफ़ी कव्वाली" },
                { en: "Rabindra Sangeet Fusion", bn: "রবীন্দ্রসংগীত ফিউশন", hi: "रवींद्र संगीत फ़्यूज़न" },
                { en: "Bollywood Romantic Melody", bn: "বলিউড রোমান্টিক মেলোডি", hi: "बॉलीवुड रोमांटिक मेलोडी" },
                { en: "Punjabi Bhangra", bn: "ভাংড়া ও গিদ্ধা (Punjabi)", hi: "पंजाबी भांगड़ा" },
                { en: "Desi Hip-Hop (DHH)", bn: "দেশি হিপ-হপ (DHH)", hi: "देसी हिप-हॉप" }
            ]
        },
        {
            category: { en: "Pop & Dance", bn: "পপ ও ড্যান্স", hi: "पॉप और डांस" },
            genres: [
                { en: "Dance Pop", bn: "ড্যান্স পপ (Dance Pop)", hi: "डांस पॉप" },
                { en: "Synthpop", bn: "সিন্থপপ (Synthpop)", hi: "सिंथपॉप" },
                { en: "K-Pop", bn: "কে-পপ (K-Pop)", hi: "के-पॉप" },
                { en: "Acoustic Pop", bn: "অ্যাকোস্টিক পপ", hi: "अकॉस्टिक पॉप" }
            ]
        },
        {
            category: { en: "Rock, Metal & Alternative", bn: "রক ও মেটাল", hi: "রॉक और मेटल" },
            genres: [
                { en: "Classic Rock", bn: "ক্লাসিক রক (Classic Rock)", hi: "क्लासिक रॉक" },
                { en: "Hard Rock", bn: "হার্ড রক (Hard Rock)", hi: "हार्ड रॉक" },
                { en: "Heavy Metal", bn: "হেভি মেটাল (Heavy Metal)", hi: "हेवी मेटल" }
            ]
        },
        {
            category: { en: "Hip-Hop, Rap & Trap", bn: "হিপ-হপ ও র‍্যাপ", hi: "हिप-हॉप और रैप" },
            genres: [
                { en: "Boom Bap Old-School", bn: "বুম-বাপ (Boom Bap)", hi: "बूम बाप" },
                { en: "Trap Beat", bn: "ট্র্যাপ বিট (Trap Beat)", hi: "ट्रैप बीट" }
            ]
        },
        {
            category: { en: "Electronic & Ambient", bn: "ইলেকট্রনিক ও অ্যাম্বিয়েন্ট", hi: "इलेक्ट्रॉनिक" },
            genres: [
                { en: "Deep House", bn: "হাউস মিউজিক (House)", hi: "हाउस म्यूज़िक" },
                { en: "Lo-Fi Chill Beats", bn: "Lo-Fi চিল হিপ-হপ", hi: "लो-फ़ाई चिल" },
                { en: "Cinematic Epic Orchestra", bn: "সিনেমেটিক ফিল্ম স্কোর", hi: "सिनेमैटिक ऑर्केस्ट्रा" }
            ]
        }
    ];

    let currentLang = "en";
    let lastGeneratedTrack = null;

    // ক্রেডিট ব্যালেন্স
    let credits = parseInt(localStorage.getItem("melody_credits")) || 5;
    const creditBalance = document.getElementById("creditBalance");
    function updateCredits(count) {
        credits = count;
        localStorage.setItem("melody_credits", credits);
        creditBalance.innerText = `${credits} Credits`;
    }
    updateCredits(credits);

    // প্রাইসিং মডাল
    const pricingModal = document.getElementById("pricingModal");
    const openPricingBtn = document.getElementById("openPricingBtn");
    const closePricingBtn = document.getElementById("closePricingBtn");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const checkoutBtnText = document.getElementById("checkoutBtnText");

    let selectedPlanCredits = 100;
    let selectedPlanPrice = "₹499";

    openPricingBtn.onclick = () => pricingModal.classList.remove("hidden");
    closePricingBtn.onclick = () => pricingModal.classList.add("hidden");

    document.querySelectorAll(".select-plan").forEach(plan => {
        plan.addEventListener("click", () => {
            document.querySelectorAll(".select-plan").forEach(p => p.classList.remove("border-indigo-500", "border-2"));
            plan.classList.add("border-indigo-500", "border-2");
            selectedPlanCredits = parseInt(plan.dataset.credits);
            selectedPlanPrice = plan.dataset.price.split("/")[0].trim();
            checkoutBtnText.innerText = `Pay ${selectedPlanPrice} & Add ${selectedPlanCredits} Credits`;
        });
    });

    checkoutBtn.onclick = () => {
        checkoutBtn.disabled = true;
        checkoutBtnText.innerText = "Processing Payment via Gateway...";
        setTimeout(() => {
            updateCredits(credits + selectedPlanCredits);
            checkoutBtn.disabled = false;
            checkoutBtnText.innerText = "Payment Successful!";
            setTimeout(() => {
                pricingModal.classList.add("hidden");
                checkoutBtnText.innerText = `Pay ${selectedPlanPrice} & Add ${selectedPlanCredits} Credits`;
                alert(`Payment successful! ${selectedPlanCredits} Credits added to your studio account.`);
            }, 500);
        }, 1200);
    };

    // ক্রিয়েশন হিস্ট্রি
    let historyTracks = JSON.parse(localStorage.getItem("melody_history") || "[]");
    const historyGrid = document.getElementById("historyGrid");
    const historyCountBadge = document.getElementById("historyCountBadge");

    function renderHistory() {
        historyCountBadge.innerText = `${historyTracks.length} Tracks`;
        if (historyTracks.length === 0) {
            const t = dictionary[currentLang] || dictionary["en"];
            historyGrid.innerHTML = `<p class="text-xs text-slate-500 col-span-full py-4 text-center">${t.emptyHistory}</p>`;
            return;
        }

        historyGrid.innerHTML = "";
        historyTracks.forEach((item) => {
            const card = document.createElement("div");
            card.className = "bg-slate-950/70 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-3 hover:border-slate-700 transition";
            card.innerHTML = `
                <div>
                    <div class="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span>${item.genre} • ${item.lang.toUpperCase()}</span>
                        <span>${item.date}</span>
                    </div>
                    <h4 class="text-xs font-semibold text-white truncate">${item.title}</h4>
                </div>
                <audio src="${item.audioUrl}" controls class="w-full h-7"></audio>
                <div class="flex items-center justify-between pt-2 border-t border-slate-850 text-xs">
                    <a href="${item.audioUrl}" download="${item.title}.wav" class="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px]">
                        <i data-lucide="download" class="w-3 h-3"></i> WAV
                    </a>
                    <a href="${item.certUrl}" target="_blank" class="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-[11px]">
                        <i data-lucide="file-check" class="w-3 h-3"></i> License
                    </a>
                </div>
            `;
            historyGrid.appendChild(card);
        });
        if (window.lucide) { lucide.createIcons(); }
    }
    renderHistory();

    const langModalBtn = document.getElementById("langModalBtn");
    const langDropdown = document.getElementById("langDropdown");
    const langSearchInput = document.getElementById("langSearchInput");
    const langListContainer = document.getElementById("langListContainer");
    const currentLangDisplay = document.getElementById("currentLangDisplay");
    const songLangSelect = document.getElementById("songLangSelect");
    const btn = document.getElementById("submitBtn");
    const input = document.getElementById("promptInput");
    const genreSelect = document.getElementById("genreSelect");
    const genreSearch = document.getElementById("genreSearch");
    const genreCount = document.getElementById("genreCount");
    const outputType = document.getElementById("outputType");
    const statusBox = document.getElementById("statusBox");
    const badgeStatus = document.getElementById("badgeStatus");
    const playerSection = document.getElementById("playerSection");
    const audioPlayer = document.getElementById("audioPlayer");
    const downloadAudioLink = document.getElementById("downloadAudioLink");
    const downloadCertLink = document.getElementById("downloadCertLink");
    const trackTitle = document.getElementById("trackTitle");
    const trackMeta = document.getElementById("trackMeta");
    const licenseCode = document.getElementById("licenseCode");
    const canvas = document.getElementById("visualCanvas");
    const ctx = canvas.getContext("2d");

    // সোশ্যাল মিডিয়া শেয়ার বাটন হ্যান্ডলার
    const shareWhatsAppBtn = document.getElementById("shareWhatsAppBtn");
    const shareXBtn = document.getElementById("shareXBtn");
    const copyLinkBtn = document.getElementById("copyLinkBtn");
    const copyLinkText = document.getElementById("copyLinkText");

    shareWhatsAppBtn.onclick = () => {
        if (!lastGeneratedTrack) return;
        const msg = encodeURIComponent(`🎵 Listen to my AI generated song "${lastGeneratedTrack.title}" (${lastGeneratedTrack.genre}) created with MelodyAI Studio! 100% Royalty Free.`);
        window.open(`https://api.whatsapp.com/send?text=${msg}`, "_blank");
    };

    shareXBtn.onclick = () => {
        if (!lastGeneratedTrack) return;
        const msg = encodeURIComponent(`I just created an original AI song "${lastGeneratedTrack.title}" with @MelodyAI Studio! 🎶 Check out the track & license:`);
        window.open(`https://twitter.com/intent/tweet?text=${msg}&url=${encodeURIComponent(window.location.origin)}`, "_blank");
    };

    copyLinkBtn.onclick = () => {
        navigator.clipboard.writeText(window.location.href);
        copyLinkText.innerText = "Copied!";
        setTimeout(() => { copyLinkText.innerText = "Copy Link"; }, 2000);
    };

    function renderLanguageList(filterText = "") {
        langListContainer.innerHTML = "";
        const filtered = worldLanguages.filter(l => 
            l.name.toLowerCase().includes(filterText.toLowerCase()) || 
            l.native.toLowerCase().includes(filterText.toLowerCase())
        );

        filtered.forEach(l => {
            const item = document.createElement("button");
            item.className = "w-full text-left flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-slate-800 transition text-slate-300 hover:text-white";
            item.innerHTML = `<span>${l.flag} ${l.native}</span><span class="text-[10px] text-slate-500">${l.name}</span>`;
            item.onclick = () => {
                setLanguage(l.code);
                langDropdown.classList.add("hidden");
            };
            langListContainer.appendChild(item);
        });
    }

    renderLanguageList();

    langModalBtn.onclick = (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle("hidden");
        langSearchInput.focus();
    };

    document.onclick = (e) => {
        if (!langDropdown.contains(e.target) && !langModalBtn.contains(e.target)) {
            langDropdown.classList.add("hidden");
        }
    };

    langSearchInput.oninput = (e) => renderLanguageList(e.target.value.trim());

    songLangSelect.innerHTML = "";
    worldLanguages.forEach(l => {
        songLangSelect.appendChild(new Option(`${l.flag} ${l.native} (${l.name})`, l.code));
    });

    function setLanguage(lang) {
        currentLang = lang;
        const selectedLangObj = worldLanguages.find(l => l.code === lang) || worldLanguages[0];
        currentLangDisplay.innerText = `${selectedLangObj.flag} ${selectedLangObj.native}`;
        songLangSelect.value = lang;

        const t = dictionary[lang] || dictionary["en"];

        document.getElementById("subHeaderDesc").innerText = t.subHeader;
        document.getElementById("titleInputBox").innerHTML = `<i data-lucide="sparkles" class="w-4 h-4 text-indigo-400"></i> ${t.titleInput}`;
        input.placeholder = t.placeholder;
        document.getElementById("lblSongLang").innerText = t.songLang;
        document.getElementById("lblGenre").innerText = t.genreLbl;
        genreSearch.placeholder = t.genreSearchPlaceholder;
        document.getElementById("lblFormat").innerText = t.formatLbl;
        document.getElementById("btnCreateText").innerText = t.btnCreate;
        document.getElementById("titleStudioConsole").innerText = t.consoleTitle;
        document.getElementById("btnDownloadText").innerText = t.download;
        document.getElementById("lblLicenseNotice").innerText = t.license;
        document.getElementById("historyHeaderTitle").innerText = t.historyTitle;

        const prevFormat = outputType.value;
        outputType.innerHTML = `
            <option value="audio_video">${t.formats.audio_video}</option>
            <option value="audio_only">${t.formats.audio_only}</option>
        `;
        if (prevFormat) outputType.value = prevFormat;

        statusBox.innerText = t.readyMsg;

        renderGenres(genreSearch.value.trim());
        renderHistory();
        if (window.lucide) { lucide.createIcons(); }
    }

    function renderGenres(filterText = "") {
        genreSelect.innerHTML = "";
        let count = 0;

        genreCategories.forEach(cat => {
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

        if (genreCount) genreCount.innerText = `${count} Genres`;
    }

    genreSearch.oninput = (e) => renderGenres(e.target.value.trim());

    setLanguage("en");

    let animationId;
    function startVisualizer() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;

        function draw() {
            ctx.fillStyle = "rgba(2, 6, 23, 0.25)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const bars = 40;
            const w = canvas.width / bars;

            for (let i = 0; i < bars; i++) {
                const h = Math.random() * (canvas.height * 0.75) + 10;
                const x = i * w;
                const y = (canvas.height - h) / 2;

                const grad = ctx.createLinearGradient(0, y, 0, y + h);
                grad.addColorStop(0, "#ec4899");
                grad.addColorStop(0.5, "#6366f1");
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

    btn.onclick = async () => {
        const text = input.value.trim();
        const genre = genreSelect.value || "Modern Melody";
        const targetSongLang = songLangSelect.value;
        const format = outputType.value;

        if (!text) return alert("Please enter a prompt / অনুগ্রহ করে কিছু লিখুন।");
        if (credits <= 0) {
            pricingModal.classList.remove("hidden");
            return alert("You have 0 credits remaining! Please top-up to continue.");
        }

        btn.disabled = true;
        badgeStatus.innerText = "PROCESSING";
        badgeStatus.className = "text-[10px] bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded animate-pulse font-mono";
        playerSection.classList.add("hidden");

        statusBox.innerText = `[1/3] Generating lyrics in ${targetSongLang.toUpperCase()} (${genre})...\n`;

        try {
            const lyrRes = await fetch("/api/generate-lyrics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: text, genre, language: targetSongLang })
            });
            const lyrData = await lyrRes.json();

            statusBox.innerText += `[2/3] Synthesizing acoustic harmony & rhythm...\n`;

            const audRes = await fetch("/api/generate-audio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lyrics: lyrData.lyrics, genre, prompt: text })
            });
            const audData = await audRes.json();

            statusBox.innerText += `[3/3] Generating official commercial PDF license & video sync...\n`;

            const vidRes = await fetch("/api/generate-video", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    audioUrl: audData.audioUrl, 
                    style: genre, 
                    prompt: text, 
                    language: targetSongLang 
                })
            });
            const vidData = await vidRes.json();

            if (audData.success) {
                statusBox.innerText = `✨ Lyrics Generated:\n\n${lyrData.lyrics}\n\n[License Verified: ${vidData.licenseId}]`;
                
                trackTitle.innerText = text.slice(0, 24);
                trackMeta.innerText = `${genre} • Language: ${targetSongLang.toUpperCase()}`;
                audioPlayer.src = audData.audioUrl;
                downloadAudioLink.href = audData.audioUrl;
                downloadCertLink.href = vidData.licensePdfUrl;
                licenseCode.innerText = vidData.licenseId;
                
                lastGeneratedTrack = {
                    title: text.slice(0, 30),
                    genre: genre,
                    audioUrl: audData.audioUrl
                };

                playerSection.classList.remove("hidden");
                badgeStatus.innerText = "COMPLETED";
                badgeStatus.className = "text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-mono";

                updateCredits(credits - 1);

                historyTracks.unshift({
                    title: text.slice(0, 30),
                    genre: genre,
                    lang: targetSongLang,
                    audioUrl: audData.audioUrl,
                    certUrl: vidData.licensePdfUrl,
                    date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                });
                localStorage.setItem("melody_history", JSON.stringify(historyTracks));
                renderHistory();

                startVisualizer();
                audioPlayer.play().catch(() => {});
            }
        } catch(err) {
            statusBox.innerText += "\nError processing request. Please retry.";
            badgeStatus.innerText = "FAILED";
        } finally {
            btn.disabled = false;
        }
    };
});
