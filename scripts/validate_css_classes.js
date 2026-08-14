const fs = require('fs');
const path = require('path');
const glob = require('glob');

function readFiles(pattern) {
  return glob.sync(pattern, { nodir: true }).map(f => ({ path: f, content: fs.readFileSync(f, 'utf8') }));
}

function extractClassesFromView(content) {
  const classes = new Set();
  const regex = /class\s*=\s*"([^"]+)"/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    m[1].split(/\s+/).filter(Boolean).forEach(c => classes.add(c.trim()));
  }
  const regex2 = /class\s*=\s*'([^']+)'/g;
  while ((m = regex2.exec(content)) !== null) {
    m[1].split(/\s+/).filter(Boolean).forEach(c => classes.add(c.trim()));
  }
  return classes;
}

function extractSelectorsFromCss(content) {
  const classes = new Set();
  const regex = /\.([A-Za-z0-9_-]+)/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    classes.add(m[1]);
  }
  return classes;
}

function main() {
  const viewFiles = readFiles('src/views/**/*.ejs');
  const cssFiles = readFiles('src/public/css/**/*.css');

  const usedByFile = {};
  const allUsed = new Set();
  for (const f of viewFiles) {
    const classes = extractClassesFromView(f.content);
    usedByFile[f.path] = Array.from(classes).sort();
    classes.forEach(c => allUsed.add(c));
  }

  const defined = new Set();
  for (const f of cssFiles) {
    extractSelectorsFromCss(f.content).forEach(c => defined.add(c));
  }

  const missingOverall = Array.from([...allUsed].filter(c => !defined.has(c))).sort();

  console.log('Views scanned:', viewFiles.length);
  console.log('CSS files scanned:', cssFiles.length);
  console.log('Unique classes used in views:', allUsed.size);
  console.log('Unique class selectors defined in CSS:', defined.size);
  console.log('\n=== Missing classes (used in views but NOT defined in CSS) ===\n');
  if (missingOverall.length === 0) {
    console.log('None — all classes used in views have corresponding CSS selectors (or are third-party such as Bootstrap/FontAwesome).');
  } else {
    missingOverall.forEach(c => console.log(c));
  }

  console.log('\n=== Missing by view file ===\n');
  for (const [file, classes] of Object.entries(usedByFile)) {
    const missing = classes.filter(c => !defined.has(c));
    if (missing.length) {
      console.log(file + ':');
      missing.forEach(m => console.log('  - ' + m));
      console.log('');
    }
  }

  // Exit code 0 if no missing, 2 otherwise
  process.exit(missingOverall.length === 0 ? 0 : 2);
}

main();
