window.Modules = window.Modules || {};

Modules.Storage = {
    state: JSON.parse(localStorage.getItem('STUDY_OS_L10')) || {
        username: "Scholar",
        xp: 0,
        tasks: [],
        theme: 'dark',
        scratchpad: ""
    },

    save(shouldRender = true) {
        localStorage.setItem('STUDY_OS_L10', JSON.stringify(this.state));
        if (shouldRender && Modules.UI) Modules.UI.render();
    },

    clearAll() {
        if (confirm("Wipe all data? This cannot be undone.")) {
            localStorage.clear();
            location.reload();
        }
    }
};
