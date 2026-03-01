const STORAGE_KEY = 'studyflow_master_v5';

function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
        userName: 'Scholar',
        xp: 0,
        level: 1,
        tasks: [],
        scratchpad: '',
        pages: [],
        calendarTasks: {}
    };
}
