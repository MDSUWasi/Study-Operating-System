window.onload = function() {
    let state = loadState();
    let currentNavDate = new Date();

    // --- NAVIGATION ENGINE ---
    const navButtons = document.querySelectorAll('.menu-item[data-view]');
    const views = document.querySelectorAll('.content-view');

    navButtons.forEach(btn => {
        btn.onclick = () => {
            const target = btn.getAttribute('data-view');
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            views.forEach(v => v.classList.add('hidden'));
            const targetView = document.getElementById(target);
            targetView.classList.remove('hidden');
            
            if(target === 'view-calendar') renderCalendar();
            if(target === 'view-notes') renderNotesGrid();
        };
    });

    // --- KNOWLEDGE BASE & PRO-WRITER ---
    function renderNotesGrid() {
        const grid = document.getElementById('docs-grid');
        grid.innerHTML = '';
        state.pages.forEach(p => {
            const card = document.createElement('div');
            card.className = 'card glass';
            card.innerHTML = `
                <h3 style="margin-bottom:12px">${p.title || 'New Module'}</h3>
                <button class="btn-primary" onclick="openNote('${p.id}')">Open Module</button>
            `;
            grid.appendChild(card);
        });
    }

    window.openNote = (id) => {
        const p = state.pages.find(x => x.id === id);
        state.currentPageId = id;
        document.getElementById('doc-title-input').value = p.title;
        document.getElementById('editor').innerHTML = p.content;
        document.getElementById('writer-overlay').classList.remove('hidden');
        updateWordCount();
    };

    function updateWordCount() {
        const text = document.getElementById('editor').innerText;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        document.getElementById('word-count').innerText = `${words} words`;
    }

    document.getElementById('add-doc').onclick = () => {
        const id = 'p' + Date.now();
        state.pages.push({ id: id, title: 'New Module', content: '' });
        saveState(state);
        renderNotesGrid();
        openNote(id);
    };

    // Auto-Save Listeners
    document.getElementById('editor').oninput = () => {
        const p = state.pages.find(x => x.id === state.currentPageId);
        if(p) { p.content = document.getElementById('editor').innerHTML; saveState(state); updateWordCount(); }
    };

    document.getElementById('doc-title-input').oninput = (e) => {
        const p = state.pages.find(x => x.id === state.currentPageId);
        if(p) { p.title = e.target.value; saveState(state); }
    };

    // Export to Doc
    document.getElementById('export-doc').onclick = () => {
        const content = document.getElementById('editor').innerText;
        const title = document.getElementById('doc-title-input').value || "Module";
        const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title}.doc`;
        link.click();
    };

    document.getElementById('close-writer').onclick = () => {
        document.getElementById('writer-overlay').classList.add('hidden');
        renderNotesGrid(); // Refresh dashboard
    };

    // --- CHRONOS CALENDAR ---
    function renderCalendar() {
        const grid = document.getElementById('calendar-days');
        const label = document.getElementById('month-year');
        grid.innerHTML = '';
        const y = currentNavDate.getFullYear();
        const m = currentNavDate.getMonth();
        label.innerText = currentNavDate.toLocaleString('default', { month: 'long', year: 'numeric' });

        const first = new Date(y, m, 1).getDay();
        const days = new Date(y, m + 1, 0).getDate();

        for (let i = 0; i < first; i++) grid.appendChild(document.createElement('div'));
        for (let i = 1; i <= days; i++) {
            const d = document.createElement('div');
            d.className = 'calendar-day';
            const key = `${y}-${m+1}-${i}`;
            if(state.calendarTasks[key]) d.style.borderColor = "var(--accent)";
            if(i === new Date().getDate() && m === new Date().getMonth()) d.classList.add('today');
            d.innerText = i;
            d.onclick = () => {
                const t = prompt("Daily Mission:", state.calendarTasks[key] || "");
                if(t !== null) { state.calendarTasks[key] = t; saveState(state); renderCalendar(); }
            };
            grid.appendChild(d);
        }
    }

    document.getElementById('prev-month').onclick = () => { currentNavDate.setMonth(currentNavDate.getMonth()-1); renderCalendar(); };
    document.getElementById('next-month').onclick = () => { currentNavDate.setMonth(currentNavDate.getMonth()+1); renderCalendar(); };

    // --- UI SYNC ---
    function updateUI() {
        document.getElementById('side-name').innerText = state.userName;
        document.getElementById('xp-current').innerText = state.xp;
        document.getElementById('xp-fill').style.width = (state.xp/500*100) + "%";
        document.getElementById('prof-level').innerText = state.level;
        document.getElementById('prof-xp').innerText = state.xp;
        renderTasks();
    }

    function renderTasks() {
        const list = document.getElementById('task-list');
        list.innerHTML = '';
        state.tasks.forEach((t, i) => {
            const li = document.createElement('li');
            li.style.display = "flex"; li.style.gap = "10px"; li.style.marginBottom = "10px";
            li.innerHTML = `<input type="checkbox" ${t.done?'checked':''} onchange="toggleT(${i})"> <span style="${t.done?'opacity:0.5;text-decoration:line-through':''}">${t.text}</span>`;
            list.appendChild(li);
        });
    }

    window.toggleT = (i) => {
        state.tasks[i].done = !state.tasks[i].done;
        if(state.tasks[i].done) {
            state.xp += 50;
            if(state.xp >= 500) { state.level++; state.xp = 0; }
        }
        saveState(state); updateUI();
    };

    document.getElementById('add-task').onclick = () => {
        const inp = document.getElementById('task-input');
        if(inp.value) { state.tasks.push({text: inp.value, done: false}); inp.value=''; saveState(state); updateUI(); }
    };

    document.getElementById('save-profile').onclick = () => {
        state.userName = document.getElementById('user-name-input').value;
        saveState(state); updateUI(); alert("Neural Identity Updated.");
    };

    document.getElementById('reset-data').onclick = () => { if(confirm("Initiate Factory Reset? All data will be lost.")) { localStorage.clear(); location.reload(); } };

    document.getElementById('scratchpad').oninput = (e) => { state.scratchpad = e.target.value; saveState(state); };
    document.getElementById('scratchpad').value = state.scratchpad;

    updateUI();
};
