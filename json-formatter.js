// JSON Formatter JavaScript

// DOM Elements
const jsonInput = document.getElementById('json-input');
const jsonOutput = document.getElementById('json-output');
const formatBtn = document.getElementById('format-btn');
// const minifyBtn = document.getElementById('minify-btn');
const validateBtn = document.getElementById('validate-btn');
// const clearInputBtn = document.getElementById('clear-input-btn');
const copyBtn = document.getElementById('copy-json-btn');
// const clearOutputBtn = document.getElementById('clear-output-btn');
const errorMessage = document.getElementById('error-message');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.querySelector('.theme-icon');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners
    formatBtn.addEventListener('click', formatJSON);
    // minifyBtn.addEventListener('click', minifyJSON);
    validateBtn.addEventListener('click', validateJSON);
    // clearInputBtn.addEventListener('click', clearInput);
    copyBtn.addEventListener('click', copyToClipboard);
    // clearOutputBtn.addEventListener('click', clearOutput);
    themeToggle.addEventListener('click', toggleTheme);
    
    // Auto-validate on input change
    jsonInput.addEventListener('input', debounce(autoValidate, 500));

    // Initialize theme
    initializeTheme();
});

// Format JSON with pretty printing
function formatJSON() {
    const inputText = jsonInput.value.trim();
    
    if (!inputText) {
        showError('Please enter some JSON to format.');
        return;
    }
    
    try {
        const parsed = JSON.parse(inputText);
        const formatted = JSON.stringify(parsed, null, 2);
        jsonOutput.value = formatted;
        hideError();
        showMessage(formatBtn, 'Formatted!', 'success');
    } catch (error) {
        showError(`Invalid JSON: ${error.message}`);
        showMessage(formatBtn, 'Format failed', 'error');
    }
}

// Minify JSON by removing whitespace
// function minifyJSON() {
//     const inputText = jsonInput.value.trim();
    
//     if (!inputText) {
//         showError('Please enter some JSON to minify.');
//         return;
//     }
    
//     try {
//         const parsed = JSON.parse(inputText);
//         const minified = JSON.stringify(parsed);
//         jsonOutput.value = minified;
//         hideError();
//         showMessage(minifyBtn, 'Minified!', 'success');
//     } catch (error) {
//         showError(`Invalid JSON: ${error.message}`);
//         showMessage(minifyBtn, 'Minify failed', 'error');
//     }
// }

// Validate JSON without formatting
function validateJSON() {
    const inputText = jsonInput.value.trim();
    
    if (!inputText) {
        showError('Please enter some JSON to validate.');
        return;
    }
    
    try {
        JSON.parse(inputText);
        hideError();
        showMessage(validateBtn, 'Valid JSON!', 'success');
    } catch (error) {
        showError(`Invalid JSON: ${error.message}`);
        showMessage(validateBtn, 'Invalid JSON', 'error');
    }
}

// Auto-validate JSON as user types
function autoValidate() {
    const inputText = jsonInput.value.trim();
    
    if (!inputText) {
        hideError();
        return;
    }
    
    try {
        JSON.parse(inputText);
        hideError();
    } catch (error) {
        // Only show error for substantial input to avoid noise
        if (inputText.length > 10) {
            showError(`Syntax error: ${error.message}`);
        }
    }
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.className = 'error-message show';
}

// Hide error message
function hideError() {
    errorMessage.style.display = 'none';
    errorMessage.className = 'error-message';
}

// Clear input textarea
// function clearInput() {
//     jsonInput.value = '';
//     hideError();
//     showMessage(clearInputBtn, 'Cleared!', 'success');
// }

// Clear output textarea
// function clearOutput() {
//     jsonOutput.value = '';
//     showMessage(clearOutputBtn, 'Cleared!', 'success');
// }

// Copy formatted JSON to clipboard
async function copyToClipboard() {
    const text = jsonOutput.value;
    
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
            jsonOutput.select();
            document.execCommand('copy');
            showMessage(copyBtn, 'Copied!', 'success');
        } catch (fallbackErr) {
            showMessage(copyBtn, 'Copy failed', 'error');
        }
    }
}

// Show temporary message on button
function showMessage(button, message, type = 'success') {
    const originalText = button.textContent;
    const originalClass = button.className;
    
    button.textContent = message;
    
    if (type === 'success') {
        button.classList.add('copy-success');
    } else if (type === 'error') {
        button.classList.add('copy-error');
    } else if (type === 'warning') {
        button.classList.add('copy-warning');
    }
    
    setTimeout(() => {
        button.textContent = originalText;
        button.className = originalClass;
    }, 1500);
}

// Debounce function for auto-validation
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Dark Mode Functions
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
    // Ctrl/Cmd + Enter to format
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        formatJSON();
        e.preventDefault();
    }
    
    // Ctrl/Cmd + Shift + M to minify
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'M') {
        minifyJSON();
        e.preventDefault();
    }
    
    // Ctrl/Cmd + K to clear input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        clearInput();
        e.preventDefault();
    }
});
