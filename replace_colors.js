const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Backgrounds
    content = content.replace(/\bbg-white\b/g, 'bg-background');
    content = content.replace(/\bbg-gray-50\b/g, 'bg-background-light');
    content = content.replace(/\bbg-gray-100\b/g, 'bg-background-light');
    content = content.replace(/\bbg-gray-200\b/g, 'bg-background-light/50');

    // Text colors
    content = content.replace(/\btext-gray-900\b/g, 'text-(--text)');
    content = content.replace(/\btext-gray-800\b/g, 'text-(--text)');
    content = content.replace(/\btext-gray-700\b/g, 'text-(--text)\/80');
    content = content.replace(/\btext-gray-600\b/g, 'text-(--text)\/70');
    content = content.replace(/\btext-gray-500\b/g, 'text-(--text)\/60');

    // Borders
    content = content.replace(/\bborder-gray-100\b/g, 'border-(--primary)\/10');
    content = content.replace(/\bborder-gray-200\b/g, 'border-(--primary)\/20');
    content = content.replace(/\bborder-gray-300\b/g, 'border-(--primary)\/30');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    
    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            processFile(fullPath);
        }
    }
}

console.log("Replacing hardcoded colors in app and components...");
processDirectory(path.join(__dirname, 'app'));
processDirectory(path.join(__dirname, 'components'));
console.log("Finished.");
