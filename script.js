// --- 1. LIVE DESKTOP CLOCK ---
function updateClock() {
    const now = new Date();
    document.getElementById('clock-widget').textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// --- 2. DESKTOP SEARCH BAR ---
document.getElementById('desktop-search').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = e.target.value.trim();
        if (query) {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
            e.target.value = '';
        }
    }
});

// --- 3. WINDOW DRAGGING & Z-INDEX ---
const windows = document.querySelectorAll('.window');

windows.forEach(windowEl => {
    const header = windowEl.querySelector('.title-bar');
    let isDragging = false;
    let offsetX, offsetY;

    // Bring window to front on click
    windowEl.addEventListener('mousedown', () => {
        windows.forEach(el => el.classList.remove('active'));
        windowEl.classList.add('active');
    });

    // Start dragging
    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        const rect = windowEl.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
    });

    // Move the window
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        windowEl.style.left = (e.clientX - offsetX) + 'px';
        windowEl.style.top = (e.clientY - offsetY) + 'px';
    });

    // Stop dragging
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Close button functionality
    windowEl.querySelector('.close-btn').addEventListener('click', () => {
        windowEl.classList.remove('active');
    });
});

// --- 4. OPEN APPS VIA DESKTOP ICONS ---
document.querySelectorAll('.desktop-icon').forEach(icon => {
    icon.addEventListener('click', () => {
        const appId = icon.dataset.app;
        const targetWindow = document.getElementById(`window-${appId}`);
        if (targetWindow) {
            windows.forEach(el => el.classList.remove('active'));
            targetWindow.classList.add('active');
        }
    });
});

// --- 5. SETTINGS TRIGGER ---
document.getElementById('settings-trigger').addEventListener('click', () => {
    const settingsWin = document.getElementById('window-settings');
    windows.forEach(el => el.classList.remove('active'));
    settingsWin.classList.add('active');
});

// --- 6. SETTINGS: BACKGROUND CHANGER ---
// Preset colors
document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Get the exact background from the button's inline CSS via computed style
        const bgStyle = window.getComputedStyle(btn).backgroundImage || window.getComputedStyle(btn).backgroundColor;
        if (bgStyle && bgStyle !== 'none') {
            document.body.style.background = bgStyle;
        }
    });
});

// Custom color picker
const colorPicker = document.querySelector('input[type="color"]');
if (colorPicker) {
    colorPicker.addEventListener('input', (e) => {
        document.body.style.background = e.target.value;
    });
}

// --- 7. CALCULATOR LOGIC ---
const calcScreen = document.getElementById('calc-screen');
let currentInput = '0';

document.querySelectorAll('.calc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const value = btn.textContent;

        if (value === 'C') {
            currentInput = '0';
        } else if (value === '=') {
            try {
                // Handle division by zero safely
                if (currentInput.includes('/0') && !currentInput.includes('/0.')) throw new Error('Math error');
                currentInput = eval(currentInput).toString();
                if (currentInput === 'NaN' || currentInput === 'undefined') currentInput = 'Error';
            } catch {
                currentInput = 'Error';
            }
        } else {
            // Prevent leading zeros unless it's a decimal
            if (currentInput === '0' && value !== '.') {
                currentInput = value;
            } else if (currentInput === 'Error') {
                currentInput = value;
            } else {
                currentInput += value;
            }
        }
        calcScreen.textContent = currentInput;
    });
});

// --- 8. TASK HUB ---
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;

    const li = document.createElement('li');
    li.className = 'task-item';
    
    const span = document.createElement('span');
    span.textContent = text;

    const delBtn = document.createElement('button');
    delBtn.className = 'del-btn';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => li.remove());

    li.appendChild(span);
    li.appendChild(delBtn);
    taskList.appendChild(li);

    taskInput.value = '';
    taskInput.focus();
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});