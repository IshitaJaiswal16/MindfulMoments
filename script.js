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

// --- MOOD LOGGING ---
function logMood(emoji, label) {
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ":" + 
                    now.getMinutes().toString().padStart(2, '0');
    
    const entry = { emoji, label, time: timeStr };
    saveMoodToHistory(entry);
}

function logCustomMood() {
    const input = document.getElementById('custom-input');
    if (input.value.trim() !== "") {
        logMood('✨', input.value);
        input.value = "";
    }
}

function saveMoodToHistory(entry) {
    let history = JSON.parse(localStorage.getItem('moodHistory')) || [];
    history.unshift(entry); 
    localStorage.setItem('moodHistory', JSON.stringify(history));
    renderMoodHistory();
}

function renderMoodHistory() {
    const list = document.getElementById('mood-history');
    const history = JSON.parse(localStorage.getItem('moodHistory')) || [];
    list.innerHTML = history.slice(0, 10).map(item => 
        `<li><strong>${item.time}</strong> - ${item.emoji} ${item.label}</li>`
    ).join('');
}

// --- JOURNAL LOGIC ---
function saveJournal() {
    const text = document.getElementById('journal-input').value;
    const status = document.getElementById('save-status');
    localStorage.setItem('savedJournal', text);
    status.innerText = "Entry saved! ✨";
    setTimeout(() => { status.innerText = ""; }, 3000);
}

// --- BREATHING LOGIC ---
let isBreathing = false;
let interval;
function toggleBreathing() {
    const circle = document.getElementById('breathing-circle');
    const instruction = document.getElementById('instruction');
    if (!isBreathing) {
        isBreathing = true;
        circle.classList.add('expand');
        instruction.innerText = "Breathe in...";
        interval = setInterval(() => {
            circle.classList.toggle('expand');
            instruction.innerText = circle.classList.contains('expand') ? "Breathe in..." : "Breathe out...";
        }, 4000);
    } else {
        isBreathing = false;
        clearInterval(interval);
        circle.classList.remove('expand');
        instruction.innerText = "Exercise stopped.";
    }
}

// --- INITIAL LOAD ---
window.onload = () => {
    renderMoodHistory();
    const savedText = localStorage.getItem('savedJournal');
    if (savedText) document.getElementById('journal-input').value = savedText;
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