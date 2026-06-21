// Stardance Calculator Pro - Complete JS Implementation

// DOM Elements
const display = document.getElementById('display');
const historyList = document.getElementById('historyList');
const themeToggle = document.getElementById('themeToggle');
const clearHistoryBtn = document.getElementById('clearHistory');

// Calculator State
let currentValue = '0';
let previousValue = '';
let operation = null;
let newNumberRequired = true;
let history = [];

// Update Display
function updateDisplay() {
    display.innerText = currentValue.length > 12 ? currentValue.slice(0, 12) : currentValue;
}

// Input Number
function inputNumber(num) {
    if (newNumberRequired) {
        currentValue = num.toString();
        newNumberRequired = false;
    } else {
        if (currentValue === '0') {
            currentValue = num.toString();
        } else {
            currentValue += num.toString();
        }
    }
    updateDisplay();
}

// Input Decimal
function inputDecimal() {
    if (newNumberRequired) {
        currentValue = '0.';
        newNumberRequired = false;
    } else if (!currentValue.includes('.')) {
        currentValue += '.';
    }
    updateDisplay();
}

// Set Operation
function setOperation(op) {
    if (operation !== null && !newNumberRequired) {
        performCalculation();
    }
    previousValue = currentValue;
    operation = op;
    newNumberRequired = true;
    updateDisplay();
}

// Perform Calculation
function performCalculation() {
    if (operation === null || newNumberRequired) return;
    
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);
    let result;
    
    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '×':
            result = prev * current;
            break;
        case '÷':
            if (current === 0) {
                display.innerText = 'ERROR: Div by 0';
                setTimeout(clearCalculator, 1500);
                return;
            }
            result = prev / current;
            break;
        case '^':
            result = Math.pow(prev, current);
            break;
        default:
            return;
    }
    
    addToHistory(`${previousValue} ${operation} ${currentValue} = ${result}`);
    currentValue = String(result);
    operation = null;
    previousValue = '';
    newNumberRequired = true;
    updateDisplay();
}

// Scientific Functions
function applyScientific(func) {
    const num = parseFloat(currentValue);
    let result;
    
    switch (func) {
        case 'sin':
            result = Math.sin(num * Math.PI / 180);
            break;
        case 'cos':
            result = Math.cos(num * Math.PI / 180);
            break;
        case 'tan':
            result = Math.tan(num * Math.PI / 180);
            break;
        case 'sqrt':
            if (num < 0) {
                display.innerText = 'ERROR: Neg sqrt';
                setTimeout(clearCalculator, 1500);
                return;
            }
            result = Math.sqrt(num);
            break;
        case 'pi':
            currentValue = String(Math.PI);
            newNumberRequired = true;
            updateDisplay();
            return;
        case 'power':
            previousValue = currentValue;
            operation = '^';
            newNumberRequired = true;
            updateDisplay();
            return;
        default:
            return;
    }
    
    currentValue = String(result);
    newNumberRequired = true;
    updateDisplay();
}

// Clear Calculator
function clearCalculator() {
    currentValue = '0';
    previousValue = '';
    operation = null;
    newNumberRequired = true;
    updateDisplay();
}

// Delete Last Character
function deleteLast() {
    if (newNumberRequired || currentValue === '0') return;
    
    currentValue = currentValue.slice(0, -1);
    if (currentValue === '' || currentValue === '-') {
        currentValue = '0';
    }
    updateDisplay();
}

// History Management
function addToHistory(entry) {
    history.push(entry);
    if (history.length > 20) history.shift();
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    for (let i = history.length - 1; i >= 0; i--) {
        const li = document.createElement('li');
        li.innerText = history[i];
        historyList.appendChild(li);
    }
}

function clearHistoryFunc() {
    history = [];
    renderHistory();
}

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    themeToggle.innerText = isLight ? '☀️' : '🌙';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

// Load Theme Preference
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.innerText = '☀️';
    }
}

// Event Listeners - Button Clicks
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            const text = this.innerText;
            
            if (action === 'number') {
                inputNumber(text);
            } else if (action === 'decimal') {
                inputDecimal();
            } else if (action === 'operator') {
                setOperation(text);
            } else if (action === 'equals') {
                performCalculation();
            } else if (action === 'clear') {
                clearCalculator();
            } else if (action === 'delete') {
                deleteLast();
            } else if (action === 'sin' || action === 'cos' || action === 'tan' || action === 'sqrt' || action === 'power' || action === 'pi') {
                applyScientific(action);
            }
        });
    });
    
    clearHistoryBtn.addEventListener('click', clearHistoryFunc);
    themeToggle.addEventListener('click', toggleTheme);
    
    loadTheme();
    updateDisplay();
});

// Keyboard Support
document.addEventListener('keydown', function(e) {
    if (e.key >= '0' && e.key <= '9') inputNumber(e.key);
    if (e.key === '.') inputDecimal();
    if (e.key === 'Enter' || e.key === '=') performCalculation();
    if (e.key === 'Backspace') deleteLast();
    if (e.key === 'Escape') clearCalculator();
    if (e.key === '+') setOperation('+');
    if (e.key === '-') setOperation('-');
    if (e.key === '*') setOperation('×');
    if (e.key === '/') {
        e.preventDefault();
        setOperation('÷');
    }
});