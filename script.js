// DOM Elements
const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const separatorSelect = document.getElementById('separator');
const quoteButtons = document.querySelectorAll('.quote-btn');
const trimCheckbox = document.getElementById('trim-whitespace');
const removeEmptyCheckbox = document.getElementById('remove-empty');
const copyBtn = document.getElementById('copy-btn');
const clearBtn = document.getElementById('clear-btn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners
    inputText.addEventListener('input', processText);
    separatorSelect.addEventListener('change', processText);
    quoteButtons.forEach(button => button.addEventListener('click', handleQuoteButtonClick));
    trimCheckbox.addEventListener('change', processText);
    removeEmptyCheckbox.addEventListener('change', processText);
    copyBtn.addEventListener('click', copyToClipboard);
    clearBtn.addEventListener('click', clearAll);

    // Set initial focus
    inputText.focus();
    
    // Load example if input is empty
    if (!inputText.value.trim()) {
        inputText.value = "apple\nbanana\norange\ngrape\nkiwi";
        processText();
    }
});

// Main text processing function
function processText() {
    const input = inputText.value;
    
    if (!input.trim()) {
        outputText.value = '';
        return;
    }

    // Split input into items
    let items = parseInput(input);
    
    // Apply options
    items = applyOptions(items);
    
    // Format output
    const output = formatOutput(items);
    
    outputText.value = output;
}

// Parse input text into array of items
function parseInput(input) {
    // First try to split by lines
    let items = input.split(/\r?\n/);
    
    // If we only have one line, try splitting by common delimiters
    if (items.length === 1 && items[0].trim()) {
        const singleLine = items[0];
        
        // Try comma first
        if (singleLine.includes(',')) {
            items = singleLine.split(',');
        }
        // Then semicolon
        else if (singleLine.includes(';')) {
            items = singleLine.split(';');
        }
        // Then pipe
        else if (singleLine.includes('|')) {
            items = singleLine.split('|');
        }
        // Then tab
        else if (singleLine.includes('\t')) {
            items = singleLine.split('\t');
        }
        // Finally try multiple spaces
        else if (singleLine.includes('  ')) {
            items = singleLine.split(/\s{2,}/);
        }
        // Last resort: split by single spaces
        else if (singleLine.includes(' ')) {
            items = singleLine.split(' ');
        }
    }
    
    return items;
}

// Apply user-selected options to the items array
function applyOptions(items) {
    // Trim whitespace if option is selected
    if (trimCheckbox.checked) {
        items = items.map(item => item.trim());
    }
    
    // Remove empty items if option is selected
    if (removeEmptyCheckbox.checked) {
        items = items.filter(item => item.length > 0);
    }
    
    return items;
}

// Format the output based on selected options
function formatOutput(items) {
    if (items.length === 0) {
        return '';
    }
    
    // Get selected quote style
    const quoteStyle = document.querySelector('.quote-btn.active').dataset.quote;
    
    // Apply quotes to each item
    const quotedItems = items.map(item => {
        switch (quoteStyle) {
            case 'single':
                return `'${item}'`;
            case 'double':
                return `"${item}"`;
            case 'none':
            default:
                return item;
        }
    });
    
    // Get selected separator
    let separator = separatorSelect.value;
    
    // Handle special separators
    switch (separator) {
        case '\\n':
            separator = '\n';
            break;
        case '\\t':
            separator = '\t';
            break;
    }
    
    return quotedItems.join(separator);
}

// Handle quote button clicks
function handleQuoteButtonClick(event) {
    // Remove active class from all buttons
    quoteButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Process text with new quote style
    processText();
}

// Copy output to clipboard
async function copyToClipboard() {
    const text = outputText.value;
    
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
            outputText.select();
            document.execCommand('copy');
            showMessage(copyBtn, 'Copied!', 'success');
        } catch (fallbackErr) {
            showMessage(copyBtn, 'Copy failed', 'error');
            console.error('Copy failed:', fallbackErr);
        }
    }
}

// Clear all inputs and outputs
function clearAll() {
    inputText.value = '';
    outputText.value = '';
    inputText.focus();
    
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

// Utility function to count items
function countItems(text) {
    if (!text.trim()) return 0;
    
    const items = parseInput(text);
    const processedItems = applyOptions(items);
    
    return processedItems.length;
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to process (focus output)
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        processText();
        outputText.focus();
        outputText.select();
        e.preventDefault();
    }
    
    // Ctrl/Cmd + K to clear
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        clearAll();
        e.preventDefault();
    }
    
    // Ctrl/Cmd + C when output is focused
    if ((e.ctrlKey || e.metaKey) && e.key === 'c' && document.activeElement === outputText) {
        copyToClipboard();
        e.preventDefault();
    }
});

// Add input validation and hints
inputText.addEventListener('paste', function(e) {
    // Small delay to allow paste to complete
    setTimeout(() => {
        processText();
        
        // Show hint about the processing
        const itemCount = countItems(inputText.value);
        if (itemCount > 0) {
            console.log(`Processed ${itemCount} items`);
        }
    }, 10);
});

// Auto-resize textareas based on content
function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.max(textarea.scrollHeight, 120) + 'px';
}

inputText.addEventListener('input', function() {
    autoResize(this);
});

// Add some example data functionality
function loadExample(type = 'default') {
    const examples = {
        default: "apple\nbanana\norange\ngrape\nkiwi",
        names: "John Doe\nJane Smith\nBob Johnson\nAlice Brown\nCharlie Wilson",
        emails: "john@example.com\njane@company.org\nbob@test.net\nalice@demo.io\ncharlie@sample.com",
        numbers: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10",
        mixed: "Item 1, Item 2; Item 3|Item 4\tItem 5"
    };
    
    inputText.value = examples[type] || examples.default;
    processText();
    inputText.focus();
}

// Initialize with example
// loadExample('default');
