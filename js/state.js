window.Modules = window.Modules || {};

Modules.State = {
    data: JSON.parse(localStorage.getItem('STUDY_PRO_V3')) || {
        profile: { name: "Elite Scholar", xp: 0, lvl: 1 },
        tasks: [],
        history: [], // For charts
        theme: 'dark'
    },

    save() {
        localStorage.setItem('STUDY_PRO_V3', JSON.stringify(this.data));
    },

    addXP(amt) {
        this.data.profile.xp += amt;
        if(this.data.profile.xp >= (this.data.profile.lvl * 500)) {
            this.data.profile.lvl++;
            this.data.profile.xp = 0;
            Modules.Engine.celebrate();
        }
        this.save();
    },

    exportData() {
        const blob = new Blob([JSON.stringify(this.data)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'study_backup.json';
        a.click();
    }
};
