document.addEventListener("DOMContentLoaded", async () => {
    if (window.lucide) { lucide.createIcons(); }

    let userCredits = parseInt(localStorage.getItem("melody_credits") || "10");
    let savedCreations = JSON.parse(localStorage.getItem("melody_creations") || "[]");

    const creditBalanceEl = document.getElementById("creditBalance");
    const topCreationsCount = document.getElementById("topCreationsCount");
    const modalCreationsGrid = document.getElementById("modalCreationsGrid");
    const creationsModal = document.getElementById("creationsModal");
    const btnOpenCreations = document.getElementById("btnOpenCreations");
    const btnCloseCreations = document.getElementById("btnCloseCreations");

    function updateCredits(count) {
        userCredits = count;
        localStorage.setItem("melody_credits", userCredits);
        creditBalanceEl.innerText = userCredits;
    }

    // লাইভ এডমিন কনটেন্ট ও প্রাইসিং ফেচিং
    try {
        const setRes = await fetch("/api/admin/site-settings");
        const setData = await setRes.json();
        if (setData.success) {
            if (setData.settings.bannerNotice) {
                document.getElementById("liveBanner").innerText = setData.settings.bannerNotice;
            }
            if (setData.settings.starterPrice) {
                document.getElementById("dispStarterPrice").innerText = `₹${setData.settings.starterPrice}`;
            }
            if (setData.settings.creatorPrice) {
                document.getElementById("dispCreatorPrice").innerText = `₹${setData.settings.creatorPrice}`;
            }
            const trendingCont = document.getElementById("trendingContainer");
            if (setData.settings.trendingChips && setData.settings.trendingChips.length > 0) {
                trendingCont.innerHTML = setData.settings.trendingChips.map(c => `
                    <button class="trend-chip text-[11px] bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg text-slate-300 hover:border-indigo-500 transition" data-text="${c}">
                        💡 ${c.slice(0, 30)}...
                    </button>
                `).join("");
                document.querySelectorAll(".trend-chip").forEach(chip => {
                    chip.addEventListener("click", () => {
                        document.getElementById("promptInput").value = chip.dataset.text;
                    });
                });
            }
        }
    } catch (e) { console.error(e); }

    function renderCreations() {
        topCreationsCount.innerText = savedCreations.length;
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

    btnOpenCreations.addEventListener("click", () => {
        renderCreations();
        creationsModal.classList.remove("hidden");
    });
    btnCloseCreations.addEventListener("click", () => creationsModal.classList.add("hidden"));

    const pricingModal = document.getElementById("pricingModal");
    document.getElementById("btnPricing").addEventListener("click", () => pricingModal.classList.remove("hidden"));
    document.getElementById("btnCloseModal").addEventListener("click", () => pricingModal.classList.add("hidden"));

    document.querySelectorAll(".buy-plan-btn").forEach(b => {
        b.addEventListener("click", () => {
            const added = parseInt(b.dataset.credits);
            updateCredits(userCredits + added);
            alert(`🎉 পেমেন্ট সফল! ${added} টি ক্রেডিট অ্যাকাউন্টে যুক্ত হয়েছে।`);
            pricingModal.classList.add("hidden");
        });
    });

    updateCredits(userCredits);
    renderCreations();

    // Studio Engine
    const btn = document.getElementById("submitBtn");
    const input = document.getElementById("promptInput");
    const genreSelect = document.getElementById("genreSelect");
    const songLangSelect = document.getElementById("songLangSelect");
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

    function startVisualizer() {
        canvas.width = canvas.parentElement.clientWidth || 360;
        canvas.height = canvas.parentElement.clientHeight || 200;
        function draw() {
            ctx.fillStyle = "rgba(2, 6, 23, 0.25)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < 30; i++) {
                const h = Math.random() * (canvas.height * 0.7) + 10;
                const w = canvas.width / 30;
                ctx.fillStyle = "#8b5cf6";
                ctx.fillRect(i * w + 2, (canvas.height - h)/2, w - 4, h);
            }
            requestAnimationFrame(draw);
        }
        draw();
    }

    btn.addEventListener("click", async () => {
        if (userCredits <= 0) {
            pricingModal.classList.remove("hidden");
            return alert("আপনার ক্রেডিট শেষ! অনুগ্রহ করে ক্রেডিট রিচার্জ করুন।");
        }
        const text = input.value.trim();
        if (!text) return alert("অনুগ্রহ করে গানের কথা বা ভাবনা লিখুন।");

        updateCredits(userCredits - 1);
        btn.disabled = true;
        badgeStatus.innerText = "GENERATING";
        playerSection.classList.add("hidden");
        statusBox.innerText = `[১/২] এআই সুর ও লিরিক্স প্রস্তুত হচ্ছে...\n`;

        try {
            const lyrRes = await fetch("/api/generate-lyrics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: text, genre: genreSelect.value, language: songLangSelect.value })
            });
            const lyrData = await lyrRes.json();

            statusBox.innerText += `[২/২] অডিও মাস্টার এনকোড সম্পন্ন হচ্ছে...\n`;
            const audRes = await fetch("/api/generate-audio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lyrics: lyrData.lyrics, genre: genreSelect.value, prompt: text })
            });
            const audData = await audRes.json();

            statusBox.innerText = `✨ সম্পূর্ণ গান ও লিরিক্স প্রস্তুত:\n\n${lyrData.lyrics}`;
            trackTitle.innerText = text.slice(0, 24);
            trackMeta.innerText = `${genreSelect.value} • ${songLangSelect.value.toUpperCase()}`;
            audioPlayer.src = audData.audioUrl;
            downloadAudioLink.href = audData.audioUrl;
            licenseCode.innerText = audData.licenseId;

            playerSection.classList.remove("hidden");
            badgeStatus.innerText = "READY";

            savedCreations.unshift({
                title: text.slice(0, 30),
                genre: genreSelect.value,
                lyrics: lyrData.lyrics,
                audioUrl: audData.audioUrl,
                licenseId: audData.licenseId,
                date: new Date().toLocaleDateString()
            });
            localStorage.setItem("melody_creations", JSON.stringify(savedCreations));
            renderCreations();

            startVisualizer();
            audioPlayer.play().catch(() => {});
        } catch (e) {
            statusBox.innerText += "\nত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
            badgeStatus.innerText = "FAILED";
        } finally {
            btn.disabled = false;
        }
    });
});
