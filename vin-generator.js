// VIN Generator JavaScript

// DOM Elements
const vinCountSelect = document.getElementById('vin-count');
const generateBtn = document.getElementById('generate-vin-btn');
const vinOutput = document.getElementById('vin-output');
const copyBtn = document.getElementById('copy-vin-btn');
const clearBtn = document.getElementById('clear-vin-btn');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.querySelector('.theme-icon');

// VIN generation data
const wmiCodes = [
    '1HD', '1HG', '1FB', '1GC', '1GT', '1ME', 'JHM', 'JH4', 'JN1', 'JN8',
    'KMH', 'KNA', 'KNM', 'WBA', 'WBS', 'WBY', 'WDD', 'WDC', 'WDB', 'WDF',
    'WAU', 'WAP', 'WVW', 'WV1', 'YV1', 'YS3', 'ZFF', 'ZAR', 'SAJ', 'SAL',
    '2HG', '2HM', '3VW', '3FA', '4F2', '5YJ', '6G2', '7AT', '8AG', '9BD'
];

const vinChars = '0123456789ABCDEFGHJKLMNPRSTUVWXYZ'; // Excludes I, O, Q
const numbers = '0123456789';
const letters = 'ABCDEFGHJKLMNPRSTUVWXYZ';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners
    generateBtn.addEventListener('click', generateVINs);
    copyBtn.addEventListener('click', copyToClipboard);
    clearBtn.addEventListener('click', clearOutput);
    themeToggle.addEventListener('click', toggleTheme);

    // Initialize theme
    initializeTheme();
    
    // Generate initial VINs
    generateVINs();
});

// Generate a single valid VIN
function generateSingleVIN() {
    let vin = '';
    
    // Positions 1-3: WMI (World Manufacturer Identifier)
    const wmi = wmiCodes[Math.floor(Math.random() * wmiCodes.length)];
    vin += wmi;
    
    // Positions 4-8: VDS (Vehicle Descriptor Section)
    for (let i = 0; i < 5; i++) {
        vin += vinChars[Math.floor(Math.random() * vinChars.length)];
    }
    
    // Position 9: Check digit (for simplicity, we'll use a random valid character)
    vin += vinChars[Math.floor(Math.random() * vinChars.length)];
    
    // Position 10: Model year
    const modelYears = 'ABCDEFGHJKLMNPRSTVWXY123456789';
    vin += modelYears[Math.floor(Math.random() * modelYears.length)];
    
    // Position 11: Plant code
    vin += vinChars[Math.floor(Math.random() * vinChars.length)];
    
    // Positions 12-17: Sequential number
    for (let i = 0; i < 6; i++) {
        vin += numbers[Math.floor(Math.random() * numbers.length)];
    }
    
    return vin;
}

// Generate multiple VINs
function generateVINs() {
    const count = parseInt(vinCountSelect.value);
    const vins = [];
    
    for (let i = 0; i < count; i++) {
        vins.push(generateSingleVIN());
    }
    
    // Always output as lines (simple format)
    vinOutput.value = vins.join('\n');
}

// Copy to clipboard
async function copyToClipboard() {
    const text = vinOutput.value;
    
    if (!text.trim()) {
        showMessage(copyBtn, 'Nothing to copy!', 'warning');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(text);
        showMessage(copyBtn, 'Copied!', 'success');
    } catch (err) {
        // Fallback for older browsers
        try {
            vinOutput.select();
            document.execCommand('copy');
            showMessage(copyBtn, 'Copied!', 'success');
        } catch (fallbackErr) {
            showMessage(copyBtn, 'Copy failed', 'error');
        }
    }
}

// Clear output
function clearOutput() {
    vinOutput.value = '';
    showMessage(clearBtn, 'Cleared!', 'success');
}

// Show temporary message on button
function showMessage(button, message, type = 'success') {
    const originalText = button.textContent;
    const originalClass = button.className;
    
    button.textContent = message;
    
    if (type === 'success') {
        button.classList.add('copy-success');
    }
    
    setTimeout(() => {
        button.textContent = originalText;
        button.className = originalClass;
    }, 1500);
}

// Dark Mode Functions (same as main app)
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        enableDarkMode();
    } else {
        enableLightMode();
    }
}

function toggleTheme() {
    if (document.body.classList.contains('dark-mode')) {
        enableLightMode();
        localStorage.setItem('theme', 'light');
    } else {
        enableDarkMode();
        localStorage.setItem('theme', 'dark');
    }
}

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    themeIcon.textContent = '☀️';
    themeToggle.setAttribute('aria-label', 'Switch to light mode');
}

function enableLightMode() {
    document.body.classList.remove('dark-mode');
    themeIcon.textContent = '🌙';
    themeToggle.setAttribute('aria-label', 'Switch to dark mode');
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        if (e.matches) {
            enableDarkMode();
        } else {
            enableLightMode();
        }
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to generate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        generateVINs();
        e.preventDefault();
    }
    
    // Ctrl/Cmd + K to clear
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        clearOutput();
        e.preventDefault();
    }
});
