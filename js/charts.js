Modules.Charts = {
    drawFlow() {
        const canvas = document.getElementById('flow-chart');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,canvas.width, canvas.height);
        
        ctx.beginPath();
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 4;
        ctx.moveTo(0, 100);
        
        for(let i=0; i<canvas.width; i+=20) {
            ctx.lineTo(i, 100 + (Math.random() - 0.5) * 80);
        }
        ctx.stroke();
    }
};
