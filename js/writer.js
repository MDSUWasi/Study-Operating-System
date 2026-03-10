Modules.Writer = {
    state: { currentDoc: localStorage.getItem('SF_WRITER_DOC') || "<h1>New Notes</h1>" },
    initEditor() {
        const editor = document.getElementById('pro-editor');
        if (!editor) return;
        editor.innerHTML = this.state.currentDoc;
        editor.oninput = () => {
            this.state.currentDoc = editor.innerHTML;
            localStorage.setItem('SF_WRITER_DOC', this.state.currentDoc);
        };
    },
    exec(cmd) { document.execCommand(cmd, false, null); },
    exportAs(format) {
        const content = document.getElementById('pro-editor').innerHTML;
        const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = "Notes.doc"; a.click();
    }
};
