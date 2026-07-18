/**
 * Build script to inject Speed Insights into HTML files
 * This script adds the Vercel Speed Insights tracking code to all HTML pages
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Speed Insights initialization code for vanilla JS
const speedInsightsScript = `
<!-- Vercel Speed Insights -->
<script>
  window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
</script>
<script defer src="/_vercel/speed-insights/script.js"></script>
`;

// Get all HTML files in the root directory
const htmlFiles = readdirSync('.').filter(file => file.endsWith('.html'));

console.log('📊 Injecting Vercel Speed Insights into HTML files...\n');

htmlFiles.forEach(file => {
  try {
    const content = readFileSync(file, 'utf-8');
    
    // Check if Speed Insights is already added
    if (content.includes('speed-insights') || content.includes('window.si')) {
      console.log(`✓ ${file} - Already has Speed Insights`);
      return;
    }
    
    // Inject before closing </head> tag
    const updatedContent = content.replace('</head>', `${speedInsightsScript}</head>`);
    
    if (updatedContent === content) {
      console.log(`⚠ ${file} - No </head> tag found`);
      return;
    }
    
    writeFileSync(file, updatedContent, 'utf-8');
    console.log(`✓ ${file} - Speed Insights added`);
  } catch (error) {
    console.error(`✗ ${file} - Error: ${error.message}`);
  }
});

console.log('\n✅ Speed Insights injection complete!');
console.log('📝 Note: Speed Insights will only work when deployed to Vercel.');
