Modules.Engine = {
    timer: { 
        seconds: 1500, 
        active: false, 
        interval: null,
        continuousWorkMinutes: 0 
    },
    
    toggleTimer() {
        const btn = document.getElementById('pomo-toggle');
        const body = document.body;
        
        if(this.timer.active) {
            this.stopTimer();
            btn.innerText = "START";
            body.classList.remove('timer-active');
        } else {
            // Burnout Protection Check (2 hour limit)
            if (this.timer.continuousWorkMinutes >= 120) {
                alert("Burnout Protection Active: Please take a 15-minute break.");
                return;
            }

            body.classList.add('timer-active');
            this.timer.interval = setInterval(() => {
                this.timer.seconds--;
                
                // Track Focus Time every minute
                if (this.timer.seconds % 60 === 0) {
                    Modules.Storage.state.focusTime += 1;
                    Modules.Storage.state.totalFocusMinutes += 1;
                    this.timer.continuousWorkMinutes += 1;
                    Modules.UI.updateFocusRing(Modules.Storage.state.focusTime);
                    Modules.Storage.save(false); // Silent save
                }

                Modules.UI.syncTimer(this.timer.seconds);
                
                if(this.timer.seconds <= 0) {
                    this.completeSession();
                }
            }, 1000);
            
            btn.innerText = "PAUSE";
        }
        this.timer.active = !this.timer.active;
    },

    stopTimer() {
        clearInterval(this.timer.interval);
        this.timer.active = false;
    },
    
    completeSession() {
        this.stopTimer();
        const body = document.body;
        body.classList.remove('timer-active');
        
        // Level 10 Rewards
        const bonusXP = 200;
        Modules.Storage.state.xp += bonusXP;
        
        // Log to history
        Modules.Storage.state.history.push({
            text: "Deep Work Session Complete",
            category: "SYSTEM",
            timestamp: new Date().toLocaleString()
        });

        this.timer.seconds = 1500;
        Modules.Storage.save();
        
        // Update UI
        document.getElementById('pomo-toggle').innerText = "START";
        alert(`Session complete! +${bonusXP} XP earned.`);
    },

    resetContinuousWork() {
        // Call this when user takes a long break
        this.timer.continuousWorkMinutes = 0;
        document.getElementById('burnout-timer').classList.add('hidden');
    }
};
