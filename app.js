/**
 * Focus Hub - App Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Icons
    lucide.createIcons();

    // 2. Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme based on preference
    if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcon('light');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            updateThemeIcon('dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            updateThemeIcon('light');
        }
        lucide.createIcons(); // Refresh icon
    });

    function updateThemeIcon(mode) {
        themeToggleBtn.innerHTML = mode === 'light' ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
    }

    // 3. Frictionless Brain Dump (Park It Pad)
    const parkItInput = document.getElementById('park-it-input');
    const stickyContainer = document.getElementById('sticky-notes-container');

    parkItInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && parkItInput.value.trim() !== '') {
            createStickyNote(parkItInput.value.trim());
            parkItInput.value = '';
        }
    });

    function createStickyNote(text) {
        const note = document.createElement('div');
        note.className = 'sticky-note';
        
        // Randomly assign slight tilt for organic feel
        const tilt = Math.floor(Math.random() * 6) - 3; // -3deg to 3deg
        note.style.transform = `rotate(${tilt}deg)`;

        const textSpan = document.createElement('span');
        textSpan.textContent = text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i data-lucide="x" style="width: 14px; height: 14px;"></i>';
        
        deleteBtn.addEventListener('click', () => {
            note.style.animation = 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) reverse forwards';
            setTimeout(() => note.remove(), 300);
        });

        note.appendChild(textSpan);
        note.appendChild(deleteBtn);
        stickyContainer.prepend(note);
        lucide.createIcons();
    }

    // 4. Task Breakdown Logic
    const bigTaskInput = document.getElementById('big-task-input');
    const breakdownBtn = document.getElementById('breakdown-btn');
    const microTasksList = document.getElementById('micro-tasks-list');

    // Rule-based mock breakdown since we don't have an AI API configured
    breakdownBtn.addEventListener('click', handleBreakdown);
    bigTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleBreakdown();
    });

    function handleBreakdown() {
        const task = bigTaskInput.value.trim().toLowerCase();
        if (!task) return;

        microTasksList.innerHTML = ''; // clear existing
        
        let steps = [];
        if (task.includes('clean') || task.includes('tidy')) {
            steps = ["Grab a trash bag and throw away visible garbage", "Gather all dishes and put in sink", "Put away 5 items that are out of place", "Wipe down one surface"];
        } else if (task.includes('study') || task.includes('homework')) {
            steps = ["Open the textbook or document", "Read the first heading or paragraph", "Write down one key concept", "Take a 2-minute stretch break"];
        } else if (task.includes('email') || task.includes('message')) {
            steps = ["Open the email app", "Draft the first sentence", "Add the recipient", "Hit send"];
        } else {
            steps = ["Stand up and take a deep breath", "Gather necessary materials", "Do the very first step for 2 minutes", "Reward yourself with a sip of water"];
        }

        steps.forEach((step, index) => {
            setTimeout(() => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <input type="checkbox" id="task-${index}">
                    <label for="task-${index}">${step}</label>
                `;
                li.querySelector('input').addEventListener('change', (e) => {
                    if(e.target.checked) li.classList.add('completed');
                    else li.classList.remove('completed');
                });
                microTasksList.appendChild(li);
            }, index * 150); // Staggered entrance
        });

        bigTaskInput.value = '';
    }

    // 5. Decision Roulette
    const rouletteInput = document.getElementById('roulette-option-input');
    const addRouletteBtn = document.getElementById('add-roulette-option');
    const rouletteOptionsContainer = document.getElementById('roulette-options');
    const spinBtn = document.getElementById('spin-btn');
    const rouletteResult = document.getElementById('roulette-result');

    let rouletteOptions = ['Do homework', 'Play games', 'Clean room'];

    function renderRouletteOptions() {
        rouletteOptionsContainer.innerHTML = '';
        rouletteOptions.forEach((opt, idx) => {
            const badge = document.createElement('span');
            badge.className = 'badge';
            badge.innerHTML = `${opt} <i data-lucide="x" class="remove-option" data-idx="${idx}"></i>`;
            rouletteOptionsContainer.appendChild(badge);
        });
        lucide.createIcons();

        // Add remove listeners
        document.querySelectorAll('.remove-option').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-idx');
                rouletteOptions.splice(index, 1);
                renderRouletteOptions();
            });
        });
    }

    renderRouletteOptions();

    addRouletteBtn.addEventListener('click', addOption);
    rouletteInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') addOption();
    });

    function addOption() {
        const val = rouletteInput.value.trim();
        if (val) {
            rouletteOptions.push(val);
            rouletteInput.value = '';
            renderRouletteOptions();
        }
    }

    spinBtn.addEventListener('click', () => {
        if (rouletteOptions.length === 0) return;
        
        spinBtn.disabled = true;
        rouletteResult.textContent = 'Deciding...';
        rouletteResult.classList.add('spinning');
        
        // Mock spinning effect
        let counter = 0;
        const interval = setInterval(() => {
            rouletteResult.textContent = rouletteOptions[Math.floor(Math.random() * rouletteOptions.length)];
            counter++;
            if (counter > 15) {
                clearInterval(interval);
                rouletteResult.classList.remove('spinning');
                rouletteResult.textContent = `🎯 ${rouletteOptions[Math.floor(Math.random() * rouletteOptions.length)]}`;
                spinBtn.disabled = false;
            }
        }, 100);
    });


    // 6. Visual Breath Pacer
    const breathCircle = document.getElementById('breath-circle');
    const breathInstruction = document.getElementById('breath-instruction');
    const breathToggle = document.getElementById('breath-toggle');
    
    let isBreathing = false;
    let breathInterval;
    let phase = 0; // 0: Inhale, 1: Hold, 2: Exhale

    breathToggle.addEventListener('click', () => {
        isBreathing = !isBreathing;
        if (isBreathing) {
            breathToggle.textContent = 'Stop';
            startBreathingCycle();
        } else {
            breathToggle.textContent = 'Start';
            stopBreathingCycle();
        }
    });

    function startBreathingCycle() {
        runPhase();
    }

    function runPhase() {
        if (!isBreathing) return;
        
        if (phase === 0) {
            breathInstruction.textContent = "Breathe in...";
            breathCircle.className = 'breath-circle inhale';
            breathInterval = setTimeout(() => {
                phase = 1;
                runPhase();
            }, 4000); // 4s inhale
        } else if (phase === 1) {
            breathInstruction.textContent = "Hold...";
            breathInterval = setTimeout(() => {
                phase = 2;
                runPhase();
            }, 4000); // 4s hold
        } else if (phase === 2) {
            breathInstruction.textContent = "Breathe out...";
            breathCircle.className = 'breath-circle exhale';
            breathInterval = setTimeout(() => {
                phase = 0;
                runPhase();
            }, 4000); // 4s exhale
        }
    }

    function stopBreathingCycle() {
        clearTimeout(breathInterval);
        breathCircle.className = 'breath-circle';
        breathInstruction.textContent = "Click to start breathing exercise";
        phase = 0;
    }


    // 7. Flow State Timer (25min Pomodoro logic)
    const timeDisplay = document.getElementById('time-display');
    const timerStartBtn = document.getElementById('timer-start');
    const timerPauseBtn = document.getElementById('timer-pause');
    const timerCircle = document.querySelector('.timer-circle');

    let timerInterval;
    let timeLeft = 25 * 60; // 25 mins in seconds
    let isTimerRunning = false;
    const totalTime = 25 * 60;

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    function updateTimerUI() {
        timeDisplay.textContent = formatTime(timeLeft);
        const percentage = ((totalTime - timeLeft) / totalTime) * 100;
        timerCircle.style.background = `conic-gradient(var(--bg-tertiary) ${percentage}%, var(--accent-primary) ${percentage}%)`;
    }

    timerStartBtn.addEventListener('click', () => {
        if (!isTimerRunning) {
            isTimerRunning = true;
            timerInterval = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateTimerUI();
                } else {
                    clearInterval(timerInterval);
                    isTimerRunning = false;
                    // Visual notification instead of loud audio
                    document.body.style.animation = 'pulseBg 2s infinite alternate';
                }
            }, 1000);
        }
    });

    timerPauseBtn.addEventListener('click', () => {
        isTimerRunning = false;
        clearInterval(timerInterval);
    });

    updateTimerUI();


    // 8. Dopamine Menu Population
    const dopamineMenu = document.getElementById('dopamine-menu');
    const activities = [
        { title: "Drink a glass of cold water", icon: "droplets", desc: "Hydration boost" },
        { title: "Stretch arms & back", icon: "activity", desc: "Get blood flowing" },
        { title: "Listen to 1 hype song", icon: "music", desc: "Instant mood lift" },
        { title: "Look out a window", icon: "sun", desc: "Rest your eyes for 60s" }
    ];

    activities.forEach(act => {
        const card = document.createElement('div');
        card.className = 'dopamine-card';
        card.innerHTML = `
            <i data-lucide="${act.icon}"></i>
            <h3>${act.title}</h3>
            <p>${act.desc}</p>
        `;
        dopamineMenu.appendChild(card);
    });
    lucide.createIcons();

    // 9. Stim Sandbox (Pop-it Grid)
    const popItGrid = document.getElementById('pop-it-grid');
    // Create 40 bubbles
    if (popItGrid) {
        for (let i = 0; i < 40; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'pop-it-bubble';
            
            bubble.addEventListener('click', () => {
                bubble.classList.toggle('popped');
            });
            
            popItGrid.appendChild(bubble);
        }
    }
});
