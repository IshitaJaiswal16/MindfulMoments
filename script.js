// --- UPDATED THEME LOGIC ---
function toggleDarkMode() {
    const body = document.documentElement;
    const isDark = document.getElementById('checkbox').checked;
    const modeText = document.getElementById('mode-text');
    const icon = document.querySelector('.icon');

    if (isDark) {
        body.setAttribute('data-theme', 'dark');
        modeText.innerText = "Dark Mode";
        icon.innerText = "🌙";
    } else {
        body.setAttribute('data-theme', 'light');
        modeText.innerText = "Light Mode";
        icon.innerText = "☀️";
    }
}
// --- MOOD LOGGING (Updated with Date Grouping) ---
function logMood(emoji, label) {
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ":" + 
                    now.getMinutes().toString().padStart(2, '0');
    // Save the date in a readable format
    const dateStr = now.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    
    const entry = { emoji, label, time: timeStr, date: dateStr };
    let history = JSON.parse(localStorage.getItem('moodHistory')) || [];
    history.unshift(entry); 
    localStorage.setItem('moodHistory', JSON.stringify(history));
    renderMoodHistory();
}

function logCustomMood() {
    const input = document.getElementById('custom-input');
    if (input.value.trim() !== "") {
        logMood('✨', input.value);
        input.value = "";
    }
}

function renderMoodHistory() {
    const list = document.getElementById('mood-history');
    const history = JSON.parse(localStorage.getItem('moodHistory')) || [];
    
    let html = "";
    let lastDate = "";

    history.forEach(item => {
        // Only show the date header if it's different from the previous item
        const currentDate = item.date || "Past Entry";
        if (currentDate !== lastDate) {
            html += `<li style="font-weight: bold; color: var(--accent-color); margin-top: 12px; border-bottom: none; list-style: none;">📅 ${currentDate}</li>`;
            lastDate = currentDate;
        }
        html += `<li><strong>${item.time}</strong> - ${item.emoji} ${item.label}</li>`;
    });

    list.innerHTML = html;
}

// --- JOURNAL LOGIC (Updated to save History List) ---
function saveJournal() {
    const input = document.getElementById('journal-input');
    const text = input.value.trim();
    
    if (!text) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const timeStr = now.getHours().toString().padStart(2, '0') + ":" + 
                    now.getMinutes().toString().padStart(2, '0');

    const entry = { text, date: dateStr, time: timeStr };
    
    let journalHistory = JSON.parse(localStorage.getItem('journalHistory')) || [];
    journalHistory.unshift(entry);
    localStorage.setItem('journalHistory', JSON.stringify(journalHistory));
    
    input.value = ""; // Clear the box after saving
    renderJournalHistory();
}

function renderJournalHistory() {
    const list = document.getElementById('journal-history');
    const history = JSON.parse(localStorage.getItem('journalHistory')) || [];
    
    list.innerHTML = history.map(item => `
        <li style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee; list-style: none;">
            <small style="color: var(--accent-color); font-weight: bold;">${item.date} @ ${item.time}</small>
            <p style="margin: 5px 0; line-height: 1.4;">${item.text}</p>
        </li>
    `).join('');
}

// --- BREATHING LOGIC (Fixed Toggle) ---
let isBreathing = false;
let breathInterval;

function toggleBreathing() {
    const circle = document.getElementById('breathing-circle');
    const instruction = document.getElementById('instruction');
    const btn = document.querySelector('.breathing-card .primary-btn'); 
    
    if (!isBreathing) {
        isBreathing = true;
        btn.innerText = "Stop"; 
        btn.style.background = "#e74c3c"; 
        
        circle.classList.add('expand');
        instruction.innerText = "Breathe in...";
        
        breathInterval = setInterval(() => {
            circle.classList.toggle('expand');
            instruction.innerText = circle.classList.contains('expand') ? "Breathe in..." : "Breathe out...";
        }, 4000);
    } else {
        isBreathing = false;
        btn.innerText = "Start";
        btn.style.background = "var(--button-bg)"; 
        
        clearInterval(breathInterval);
        circle.classList.remove('expand');
        instruction.innerText = "Ready to start again?";
    }
}

// --- INITIAL LOAD (Updated) ---
window.onload = () => {
    renderMoodHistory();
    renderJournalHistory();
    // If you have these functions, keep them active:
    if (typeof updateSleep === "function") updateSleep();
    if (typeof updateWaterUI === "function") updateWaterUI();
};

// --- SLEEP TRACKER LOGIC ---
function updateSleep() {
    const val = document.getElementById('sleep-slider').value;
    const emoji = document.getElementById('sleep-emoji');
    const display = document.getElementById('sleep-display');
    const status = document.getElementById('sleep-status');
    const slider = document.getElementById('sleep-slider');

    display.innerText = `${val} Hours Slept`;

    if (val < 5) {
        emoji.innerText = "💀";
        status.innerText = "Critically low sleep. Take it easy today.";
        slider.style.accentColor = "#e74c3c"; // Red
    } else if (val < 8) {
        emoji.innerText = "🥱";
        status.innerText = "Getting there, but a bit more would be better.";
        slider.style.accentColor = "#f1c40f"; // Yellow/Orange
    } else {
        emoji.innerText = "🔋";
        status.innerText = "Fully charged! You're ready for anything.";
        slider.style.accentColor = "#2ecc71"; // Green
    }
}

// --- SOUND MIXER LOGIC ---
// --- IMPROVED SOUND MIXER LOGIC ---
let audioUnlocked = false;

function unlockAudio() {
    const audios = document.querySelectorAll('audio');
    const mixer = document.getElementById('mixer-controls');
    const unlockBtn = document.getElementById('audio-unlock');
    const sliders = document.querySelectorAll('.volume-slider');
    const icons = document.querySelectorAll('.sound-icon');

    // IF ALREADY ACTIVE: This turns into a "Master Stop"
    if (audioUnlocked) {
        audios.forEach(track => {
            track.pause();
            track.currentTime = 0;
        });
        sliders.forEach(s => s.value = 0); // Reset sliders to 0
        icons.forEach(i => i.classList.remove('sound-active')); // Remove glows
        
        audioUnlocked = false; // Relock the logic
        mixer.style.opacity = "0.5";
        mixer.style.pointerEvents = "none";
        unlockBtn.innerText = "🔈 Enable Sound Mixer";
        unlockBtn.style.background = "var(--button-bg)";
        return;
    }

    // IF NOT ACTIVE: This runs the "Enable" logic
    const playPromises = [];
    audios.forEach(track => {
        track.volume = 0;
        playPromises.push(track.play());
    });

    Promise.all(playPromises).then(() => {
        audios.forEach(track => {
            track.pause();
            track.currentTime = 0;
        });
        
        audioUnlocked = true;
        mixer.style.opacity = "1";
        mixer.style.pointerEvents = "auto";
        unlockBtn.innerText = "🔇 Disable Sound Mixer";
        unlockBtn.style.background = "#e74c3c"; // Turn it Red to show "Stop"
    }).catch(err => {
        console.error("Unlock failed:", err);
    });
}

function adjustVolume(type, volume) {
    if (!audioUnlocked) return;

    const audio = document.getElementById(`audio-${type}`);
    const icon = document.getElementById(`icon-${type}`);
    
    audio.volume = volume;

    if (volume > 0) {
        if (audio.paused) {
            audio.play().catch(e => console.log("Playback error:", e));
        }
        icon.classList.add('sound-active');
    } else {
        audio.pause();
        icon.classList.remove('sound-active');
    }
}

// Ensure the initial state of the Sleep Slider is rendered
window.addEventListener('load', () => {
    updateSleep();
});