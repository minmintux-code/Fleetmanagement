const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Backgrounds
  content = content.replace(/bg-white(?!\sdark:)/g, 'bg-white dark:bg-slate-800');
  content = content.replace(/bg-\[\#F8FAFC\](?!\sdark:)/g, 'bg-[#F8FAFC] dark:bg-slate-900');
  content = content.replace(/bg-slate-50(?!\sdark:)/g, 'bg-slate-50 dark:bg-slate-900/50');
  content = content.replace(/bg-slate-100(?!\sdark:)/g, 'bg-slate-100 dark:bg-slate-800');

  // Sidebar / Navbar (Make light in light mode, dark in dark mode)
  content = content.replace(/bg-\[\#1E293B\](?!\sdark:)/g, 'bg-white dark:bg-[#1E293B]');
  content = content.replace(/bg-\[\#0F172A\](?!\sdark:)/g, 'bg-slate-50 dark:bg-[#0F172A]');
  content = content.replace(/border-\[\#334155\](?!\sdark:)/g, 'border-slate-200 dark:border-[#334155]');
  content = content.replace(/hover:bg-\[\#334155\](?!\sdark:)/g, 'hover:bg-slate-100 dark:hover:bg-[#334155]');
  content = content.replace(/hover:text-\[\#F8FAFC\](?!\sdark:)/g, 'hover:text-slate-900 dark:hover:text-[#F8FAFC]');

  // Text colors
  content = content.replace(/text-\[\#111827\](?!\sdark:)/g, 'text-[#111827] dark:text-slate-100');
  content = content.replace(/text-slate-900(?!\sdark:)/g, 'text-slate-900 dark:text-slate-100');
  content = content.replace(/text-slate-800(?!\sdark:)/g, 'text-slate-800 dark:text-slate-100');
  content = content.replace(/text-slate-700(?!\sdark:)/g, 'text-slate-700 dark:text-slate-300');
  content = content.replace(/text-slate-600(?!\sdark:)/g, 'text-slate-600 dark:text-slate-400');
  content = content.replace(/text-slate-500(?!\sdark:)/g, 'text-slate-500 dark:text-slate-400');
  content = content.replace(/text-\[\#F8FAFC\](?!\sdark:)/g, 'text-slate-800 dark:text-[#F8FAFC]');
  content = content.replace(/text-\[\#94A3B8\](?!\sdark:)/g, 'text-slate-500 dark:text-[#94A3B8]');

  // Borders
  content = content.replace(/border-\[\#E5E7EB\](?!\sdark:)/g, 'border-[#E5E7EB] dark:border-slate-700');
  content = content.replace(/border-slate-200(?!\sdark:)/g, 'border-slate-200 dark:border-slate-700');
  content = content.replace(/border-slate-100(?!\sdark:)/g, 'border-slate-100 dark:border-slate-700/50');
  content = content.replace(/border-b(?!\sborder|dark:)/g, 'border-b border-slate-200 dark:border-slate-700');

  // Inputs
  content = content.replace(/focus:ring-\[\#2563EB\](?!\sdark:)/g, 'focus:ring-[#2563EB] dark:focus:ring-blue-500');
  content = content.replace(/focus:border-\[\#2563EB\](?!\sdark:)/g, 'focus:border-[#2563EB] dark:focus:border-blue-500');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walkDir(path.join(__dirname, 'src'));
console.log('Dark mode classes applied.');
