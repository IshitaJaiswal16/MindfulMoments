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