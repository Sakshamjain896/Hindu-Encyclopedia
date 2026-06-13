const fs = require('fs');
const path = require('path');
const cssPath = path.join(__dirname, 'src', 'styles.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Insert root vars right after :root {
css = css.replace(':root {', ':root {\n  --font-heading: \'Cinzel Decorative\', serif;\n  --font-body: \'Oswald\', sans-serif;');

// Add theme overrides at the bottom
const overrides = 

/* ================= THEME FONTS ================= */
body.light-theme {
  --font-heading: 'Cinzel', serif;
  --font-body: 'Lora', serif;
}

body.light-theme.kalki-mode {
  --font-heading: 'Jura', sans-serif;
  --font-body: 'Inter', sans-serif;
}

body.kali-mode {
  --font-heading: 'Special Elite', monospace;
  --font-body: 'Special Elite', monospace;
}
;

css += overrides;

// Now, globally replace the hardcoded fonts with the CSS variables
// Replace 'Cinzel Decorative' or 'Cinzel' with var(--font-heading)
css = css.replace(/font-family:\s*['"]Cinzel(\sDecorative)?['"][^;]*;/g, 'font-family: var(--font-heading);');

// Replace 'Inter', 'Garamond', 'Rajdhani', 'Montserrat', 'Courier New', sans-serif, etc where appropriate.
// Standard body font is usually Inter or sans-serif
css = css.replace(/font-family:\s*['"]Inter['"][^;]*;/g, 'font-family: var(--font-body);');
css = css.replace(/font-family:\s*['"]Garamond['"][^;]*;/g, 'font-family: var(--font-body);');
css = css.replace(/font-family:\s*['"]Montserrat['"][^;]*;/g, 'font-family: var(--font-body);');
css = css.replace(/font-family:\s*['"]Rajdhani['"][^;]*;/g, 'font-family: var(--font-heading);');
css = css.replace(/font-family:\s*['"]Courier New['"][^;]*;/g, 'font-family: var(--font-heading);');

fs.writeFileSync(cssPath, css);
console.log('Fonts updated successfully!');
