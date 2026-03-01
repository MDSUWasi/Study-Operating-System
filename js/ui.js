Modules.UI = {
    init() {
        const s = Modules.Storage.state;
        
        // Restore Name & Setup Persistence
        const nameEl = document.getElementById('username');
        if(nameEl) {
            nameEl.innerText = s.username || "Scholar";
            nameEl.onblur = () => {
                Modules.Storage.state.username = nameEl.innerText;
                Modules.Storage.save(false);
            };
        }

        // Restore Scratchpad
        const scratch = document.getElementById('scratchpad');
        if(scratch) {
            scratch.value = s.scratchpad || "";
            scratch.oninput = (e) => {
                Modules.Storage.state.scratchpad = e.target.value;
                Modules.Storage.save(false);
            };
        }

        document.documentElement.setAttribute('data-theme', s.theme || 'dark');
        
        // Enter key for tasks
        const taskInput = document.getElementById('task-input');
        if(taskInput) {
            taskInput.onkeydown = (e) => { if(e.key === 'Enter') Modules.Tasks.add(); };
        }

        this.render();
    },

    openUtility(tab) {
        document.getElementById('utility-window').classList.remove('hidden');
        this.switchUtility(tab);
    },

    closeUtility() {
        document.getElementById('utility-window').classList.add('hidden');
    },

    switchUtility(tab) {
        const container = document.getElementById('utility-content');
        if (tab === 'writer') {
            container.innerHTML = `
                <div class="writer-standalone">
                    <div class="writer-toolbar-pro">
                        <button onclick="Modules.Writer.exec('bold')">B</button>
                        <button onclick="Modules.Writer.exec('italic')">I</button>
                        <button onclick="Modules.Writer.exportAs('docx')" class="btn-docx">Save .DOCX</button>
                    </div>
                    <div id="pro-editor" contenteditable="true"></div>
                </div>`;
            Modules.Writer.initEditor();
        } else {
            container.innerHTML = `<div style="padding:100px; color:white;"><h1>Stats</h1><p>XP: ${Modules.Storage.state.xp}</p></div>`;
        }
    },

    toggleTheme() {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        document.getElementById('theme-icon').innerText = next === 'dark' ? '🌓' : '☀️';
        Modules.Storage.state.theme = next;
        Modules.Storage.save(false);
    },

    render() {
        const s = Modules.Storage.state;
        
        // Update Counters
        document.getElementById('stat-pending').innerText = s.tasks.filter(t => !t.done).length;
        document.getElementById('stat-done').innerText = s.tasks.filter(t => t.done).length;
        
        // Update XP
        document.getElementById('lvl-display').innerText = `Level ${Math.floor(s.xp/1000) + 1}`;
        document.getElementById('xp-fill').style.width = (s.xp % 1000 / 10) + "%";

        // Render Tasks
        const list = document.getElementById('task-list');
        list.innerHTML = '';
        s.tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.done ? 'is-done' : ''}`;
            li.innerHTML = `
                <input type="checkbox" ${task.done ? 'checked' : ''} onchange="Modules.Tasks.toggle(${index})">
                <span>${task.text}</span>
                <button onclick="Modules.Tasks.remove(${index})">✕</button>
            `;
            list.appendChild(li);
        });
    }
};

Modules.Tasks = {
    add() {
        const input = document.getElementById('task-input');
        if(!input.value.trim()) return;
        Modules.Storage.state.tasks.push({ text: input.value, done: false });
        input.value = '';
        Modules.Storage.save();
    },
    toggle(index) {
        const t = Modules.Storage.state.tasks[index];
        t.done = !t.done;
        Modules.Storage.state.xp += t.done ? 50 : -50;
        Modules.Storage.save();
    },
    remove(index) {
        Modules.Storage.state.tasks.splice(index, 1);
        Modules.Storage.save();
    }
};

window.onload = () => Modules.UI.init();
