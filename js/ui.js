/**
 * NEXUS OS: NEURAL ENGINE (v3.0)
 * Core Logic for Windowing, Chronos, and Deep-Work Logging
 */

// 1. GLOBAL STATE INITIALIZATION
// We pull the data from storage.js immediately so the OS "remembers" the user
let state = loadState(); 
let activeFocusTimer = null; 
let activeDayKey = null; // Tracks which date is being edited in Chronos

/**
 * WINDOW MANAGEMENT SYSTEM
 * Handles the "Booting" and "Shutting Down" of full-screen modules
 */
window.openApp = (appId) => {
    const app = document.getElementById(appId);
    
    // Remove 'hidden' class to trigger the CSS 'bootUp' animation
    app.classList.remove('hidden');
    
    // Contextual Refresh: Update specific data based on which app opened
    if (appId === 'app-stats') refreshStats();
    if (appId === 'app-chronos') renderCalendar();
    if (appId === 'app-profile') syncProfileUI();
    
    console.log(`System: ${appId} initialized.`);
};

window.closeApp = (appId) => {
    document.getElementById(appId).classList.add('hidden');
    saveState(state); // Auto-save whenever a window is closed
};

/**
 * IDENTITY & PROFILE MODULE
 * Handles Social-style interactions and Image uploads
 */
function syncProfileUI() {
    document.getElementById('user-name-display').innerText = state.userName || "SCHOLAR_01";
    document.getElementById('user-bio-display').innerText = state.bio || "Neural Mapping | Study Core";
    if (state.pfp) document.getElementById('display-pfp').src = state.pfp;
    if (state.banner) document.getElementById('profile-banner').style.backgroundImage = `url(${state.banner})`;
}

// Event Listeners for Media Uploads (PFP and Banner)
document.getElementById('pfp-upload').onchange = (e) => handleImageUpload(e, 'pfp');
document.getElementById('banner-upload').onchange = (e) => handleImageUpload(e, 'banner');

function handleImageUpload(event, type) {
    const reader = new FileReader();
    reader.onload = (e) => {
        state[type] = e.target.result; // Store base64 string in state
        syncProfileUI(); // Update UI immediately
        saveState(state);
    };
    reader.readAsDataURL(event.target.files[0]);
}

/**
 * CHRONOS HUB: TEMPORAL MAPPING
 * Logic for the dynamic calendar and date-specific database
 */
let navDate = new Date(); // Current viewing month

window.renderCalendar = () => {
    const grid = document.getElementById('calendar-grid');
    const label = document.getElementById('month-label');
    grid.innerHTML = '';

    const year = navDate.getFullYear();
    const month = navDate.getMonth();
    label.innerText = navDate.toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMo = new Date(year, month + 1, 0).getDate();

    // Fill empty slots
    for (let i = 0; i < firstDay; i++) grid.appendChild(document.createElement('div'));

    // Generate Day Squares
    for (let d = 1; d <= daysInMo; d++) {
        const dayBtn = document.createElement('div');
        dayBtn.className = 'cal-day glass';
        const dateKey = `${year}-${month + 1}-${d}`;
        
        dayBtn.innerHTML = `<span>${d}</span>`;
        
        // Show indicator if data exists for this day
        if (state.chronosData?.[dateKey]) {
            dayBtn.innerHTML += `<div class="day-indicator" style="width:6px; height:6px; background:var(--accent); border-radius:50%; margin:auto;"></div>`;
        }

        dayBtn.onclick = () => openDayInspector(dateKey);
        grid.appendChild(dayBtn);
    }
};

window.changeMonth = (dir) => {
    navDate.setMonth(navDate.getMonth() + dir);
    renderCalendar();
};

function openDayInspector(key) {
    activeDayKey = key;
    document.getElementById('day-inspector').classList.remove('hidden');
    
    // Initialize data for new days
    if (!state.chronosData) state.chronosData = {};
    if (!state.chronosData[key]) state.chronosData[key] = { routine: [], tasks: [] };
    
    renderDayData();
}

function renderDayData() {
    const data = state.chronosData[activeDayKey];
    
    // Render Routine
    document.getElementById('routine-editor').innerHTML = data.routine.map((r, i) => `
        <div class="editable-row">
            <input type="text" value="${r.time}" onchange="updateDayData('routine', ${i}, 'time', this.value)" style="width:70px">
            <input type="text" value="${r.act}" onchange="updateDayData('routine', ${i}, 'act', this.value)" style="flex:1">
        </div>
    `).join('');

    // Render Tasks
    document.getElementById('task-editor').innerHTML = data.tasks.map((t, i) => `
        <div class="editable-row">
            <input type="checkbox" ${t.done ? 'checked' : ''} onclick="toggleDayTask(${i})">
            <span style="flex:1">${t.text}</span>
        </div>
    `).join('');
}

window.updateDayData = (type, index, field, value) => {
    state.chronosData[activeDayKey][type][index][field] = value;
    saveState(state);
};

window.addRoutineItem = () => {
    state.chronosData[activeDayKey].routine.push({ time: "00:00", act: "New Pulse" });
    renderDayData();
};

window.addNewTask = () => {
    const inp = document.getElementById('new-task-input');
    if (!inp.value) return;
    state.chronosData[activeDayKey].tasks.push({ text: inp.value, done: false });
    inp.value = '';
    renderDayData();
};

window.closeInspector = () => document.getElementById('day-inspector').classList.add('hidden');

/**
 * NEURAL WRITER & FOCUS TIMER
 */
window.startFocusSession = () => {
    let mins = document.getElementById('user-timer-input').value;
    let seconds = mins * 60;
    const display = document.getElementById('active-timer');
    
    if (activeFocusTimer) clearInterval(activeFocusTimer);

    activeFocusTimer = setInterval(() => {
        seconds--;
        let m = Math.floor(seconds / 60);
        let s = seconds % 60;
        display.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;

        if (seconds <= 0) {
            clearInterval(activeFocusTimer);
            logStudySession(mins);
            alert("Focus Session Terminated. Data Logged.");
        }
    }, 1000);
};

function logStudySession(mins) {
    const subject = document.getElementById('study-subject').value || "General";
    if (!state.studyDatabase) state.studyDatabase = [];
    state.studyDatabase.push({
        date: new Date().toLocaleDateString(),
        subject: subject,
        minutes: mins
    });
    saveState(state);
}

/**
 * INTELLIGENCE: STATS VISUALIZER
 */
function refreshStats() {
    const db = state.studyDatabase || [];
    let totalMins = db.reduce((acc, curr) => acc + parseInt(curr.minutes), 0);
    
    document.getElementById('stat-total-time').innerText = `${(totalMins / 60).toFixed(1)} HRS`;
    document.getElementById('stat-total-notes').innerText = db.length;

    document.getElementById('session-log-list').innerHTML = db.slice().reverse().map(s => `
        <div class="log-item glass" style="margin-bottom:10px; padding:15px; display:flex; justify-content:space-between;">
            <span>${s.date} - ${s.subject}</span>
            <span style="color:var(--accent)">${s.minutes} Mins</span>
        </div>
    `).join('');
}

/**
 * SYSTEM CONFIG
 */
window.saveSystemConfig = () => {
    state.userName = document.getElementById('config-username').value;
    const color = document.getElementById('config-color').value;
    document.documentElement.style.setProperty('--accent', color);
    saveState(state);
    syncProfileUI();
    alert("System Calibration Applied.");
};

window.factoryReset = () => {
    if (confirm("DANGER: This will wipe all neural data. Proceed?")) {
        localStorage.clear();
        location.reload();
    }
};

// Start the OS Clock
setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString();
}, 1000);

// Initialize OS
window.onload = () => {
    syncProfileUI();
    console.log("Nexus OS: Ready.");
};
/**
 * DATA PERSISTENCE: BACKUP & RECOVERY
 */

// EXPORT: Converts your state object into a downloadable .json file
window.exportNeuralData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "nexus_backup_" + new Date().toLocaleDateString() + ".json");
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    console.log("System: Neural backup generated.");
};

// IMPORT: Reads a .json file and overwrites the current state
window.importNeuralData = (event) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedState = JSON.parse(e.target.result);
            state = importedState;
            saveState(state);
            alert("Neural Link Restored. Reloading System...");
            location.reload(); 
        } catch (err) {
            alert("ERROR: Corrupted data fragment. Import failed.");
        }
    };
    reader.readAsText(event.target.files[0]);
};
