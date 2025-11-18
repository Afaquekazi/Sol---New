#!/usr/bin/env node

// ========== SIMPLIFIED BUILD SCRIPT ==========
// This script creates a hybrid approach:
// - Uses modular code where extracted
// - Keeps original code for features not yet modularized
// - Ensures nothing breaks

const fs = require('fs');
const path = require('path');

console.log('🔨 Building Solthron Extension (Simple Build)...\n');

// Read original backup
const originalContent = fs.readFileSync('content.js.backup', 'utf8');

// Helper function to convert ES6 module to plain JS
function convertToPlainJS(content) {
    // Remove all import statements
    content = content.replace(/import\s+{[^}]*}\s+from\s+['"][^'"]+['"];?\s*/g, '');
    content = content.replace(/import\s+\*\s+as\s+\w+\s+from\s+['"][^'"]+['"];?\s*/g, '');
    content = content.replace(/import\s+\w+\s+from\s+['"][^'"]+['"];?\s*/g, '');

    // Remove export keywords but keep the declarations
    content = content.replace(/export\s+(const|let|var|function|async\s+function|class)\s+/g, '$1 ');
    content = content.replace(/export\s+default\s+/g, '');
    content = content.replace(/export\s+{[^}]*};?\s*/g, '');

    return content;
}

// Start building output
let output = '';

// Add header
output += `// ========== SOLTHRON EXTENSION ==========
// HYBRID BUILD - Modular + Original Code
// Build Date: ${new Date().toISOString()}
//
// This file combines:
// - Modular source from /src (already extracted)
// - Original code for features not yet modularized
//
// To rebuild: node build-simple.js
// ==========================================

`;

// Add all modular code
const modulePaths = [
    'src/core/constants.js',
    'src/core/state.js',
    'src/api/backend-auth.js',
    'src/analytics/tracker.js',
    'src/platform/detector.js',
    'src/platform/extractors.js',
    'src/utils/text-processing.js',
    'src/utils/code-detector.js',
    'src/utils/cursor.js',
    'src/ui/animations.js',
    'src/ui/notifications.js',
];

console.log('📦 Adding modular code...\n');

modulePaths.forEach(modulePath => {
    const fullPath = path.join(__dirname, modulePath);
    let content = fs.readFileSync(fullPath, 'utf8');

    console.log(`  ✓ ${modulePath}`);

    // Convert to plain JS
    content = convertToPlainJS(content);

    // Add to output
    output += `\n// ========== ${path.basename(modulePath).toUpperCase()} (MODULAR) ==========\n`;
    output += content + '\n';
});

console.log('\n📄 Adding remaining original code...\n');

// Now add the rest from original, but skip the sections we've modularized
const lines = originalContent.split('\n');
let skipSections = false;
let sectionName = '';
let inSkippedSection = false;

const sectionsToSkip = [
    'ANALYTICS TRACKING',
    'PLATFORM DETECTION',
    'EXTRACT LAST Q&A EXCHANGE',
    'GMAIL CONTEXT EXTRACTION',
    'CURSOR POSITION UTILITIES',
    'DETECT CODE IN TEXT',
    'DETECT PROGRAMMING LANGUAGE',
    'UNIVERSAL NOTIFICATION FUNCTION'
];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip header and initial variable declarations (first 40 lines are replaced by modular state)
    if (i < 40) continue;

    // Check if we're entering a section to skip
    const sectionMatch = line.match(/\/\/ ========== (.*) ==========/);
    if (sectionMatch) {
        sectionName = sectionMatch[1];
        inSkippedSection = sectionsToSkip.some(skipSection => sectionName.includes(skipSection));

        if (inSkippedSection) {
            console.log(`  ⊘ Skipping section: ${sectionName} (using modular version)`);
        }
    }

    // Skip lines in modularized sections
    if (inSkippedSection) {
        // Stop skipping when we hit the next section
        if (sectionMatch && !sectionsToSkip.some(s => sectionMatch[1].includes(s))) {
            inSkippedSection = false;
            output += line + '\n';
        }
        continue;
    }

    // Add line to output
    output += line + '\n';
}

// Write output
console.log('\n💾 Writing content-new.js...\n');
fs.writeFileSync('content-new.js', output);

// Get file sizes
const originalSize = fs.statSync('content.js.backup').size;
const newSize = fs.statSync('content-new.js').size;
const diff = newSize - originalSize;
const diffPercent = ((diff / originalSize) * 100).toFixed(1);

console.log('✅ Build Complete!\n');
console.log(`📊 Stats:`);
console.log(`   Original: ${(originalSize / 1024).toFixed(1)} KB`);
console.log(`   New:      ${(newSize / 1024).toFixed(1)} KB`);
console.log(`   Diff:     ${diff > 0 ? '+' : ''}${(diff / 1024).toFixed(1)} KB (${diffPercent}%)`);

console.log('\n📋 Next Steps:');
console.log('   1. Test extension with content-new.js');
console.log('   2. Load extension in Chrome and test all features');
console.log('   3. If everything works:');
console.log('      mv content.js content-old.js');
console.log('      mv content-new.js content.js');
console.log('\n');
