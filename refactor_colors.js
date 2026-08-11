const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Remove dark: classes related to zinc (e.g. dark:text-zinc-50, dark:bg-zinc-900, dark:border-zinc-800, etc)
  content = content.replace(/dark:(text|bg|border|ring|divide)-zinc-\d+\/?\d*\s*/g, '');

  // Replace light mode zinc classes with foreground
  const mappings = {
    '950': 'foreground',
    '900': 'foreground',
    '800': 'foreground/90',
    '700': 'foreground/80',
    '600': 'foreground/70',
    '500': 'foreground/60',
    '400': 'foreground/50',
    '300': 'foreground/30',
    '200': 'foreground/20',
    '100': 'foreground/10',
    '50': 'foreground/5',
  };

  for (const [zincWeight, replacement] of Object.entries(mappings)) {
    // Replace classes globally, ensuring we are replacing exact matches
    content = content.replace(new RegExp(`text-zinc-${zincWeight}(?![\\w-])`, 'g'), `text-${replacement}`);
    content = content.replace(new RegExp(`bg-zinc-${zincWeight}(?![\\w-])`, 'g'), `bg-${replacement}`);
    content = content.replace(new RegExp(`border-zinc-${zincWeight}(?![\\w-])`, 'g'), `border-${replacement}`);
    content = content.replace(new RegExp(`ring-zinc-${zincWeight}(?![\\w-])`, 'g'), `ring-${replacement}`);
    content = content.replace(new RegExp(`divide-zinc-${zincWeight}(?![\\w-])`, 'g'), `divide-${replacement}`);
  }
  
  // Also clean up stray quotes if dark classes left multiple spaces or empty spaces
  // This is safer: replace two spaces with one space, but don't touch newlines!
  content = content.replace(/ {2,}/g, ' ');
  content = content.replace(/ \}/g, '}').replace(/ "/g, '"').replace(/" /g, '"');

  fs.writeFileSync(file, content, 'utf8');
});

console.log('Done refactoring colors.');
