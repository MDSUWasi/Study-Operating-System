const loadState = () => {
    const d = localStorage.getItem('NEXUS_AERO');
    return d ? JSON.parse(d) : { routine: [], notes: [], tasks: [], diary: "", wall: null };
};
const saveState = (s) => localStorage.setItem('NEXUS_AERO', JSON.stringify(s));
