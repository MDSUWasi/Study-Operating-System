window.Modules = window.Modules || {};

Modules.Audio = {
    context: null,
    node: null,
    isPlaying: false,

    init() {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
    },

    toggle() {
        if (!this.context) this.init();

        if (this.isPlaying) {
            if (this.node) {
                this.node.disconnect();
                this.node = null;
            }
            this.isPlaying = false;
        } else {
            if (this.context.state === 'suspended') this.context.resume();
            
            const bufferSize = 4096;
            let lastOut = 0.0;
            this.node = this.context.createScriptProcessor(bufferSize, 1, 1);
            
            this.node.onaudioprocess = (e) => {
                const output = e.outputBuffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    const white = Math.random() * 2 - 1;
                    output[i] = (lastOut + (0.02 * white)) / 1.02;
                    lastOut = output[i];
                    output[i] *= 3.5; 
                }
            };

            this.node.connect(this.context.destination);
            this.isPlaying = true;
        }
        return this.isPlaying;
    }
};
