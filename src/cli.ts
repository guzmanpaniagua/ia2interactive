#!/usr/bin/env node
import path from 'node:path';
import { build } from './core/build.js';

const args = process.argv.slice(2);
const command = args[0];
const inputDir = args[1] ? path.resolve(args[1]) : process.cwd();

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

if (command === 'build') {
  const outputDir = args[2] ? path.resolve(args[2]) : undefined;
  const start = Date.now();

  console.log('');
  console.log(`${BOLD}🔨 IA2Interactive Builder${RESET}`);
  console.log(`${DIM}   Input:  ${inputDir}${RESET}`);

  const result = build({ inputDir, outputDir });
  const elapsed = Date.now() - start;

  if (result.errors.length > 0) {
    console.log('');
    console.log(`${RED}❌ Build failed with ${result.errors.length} error(s):${RESET}`);
    result.errors.forEach((e) => console.log(`   ${RED}• ${e}${RESET}`));
    process.exit(1);
  }

  const chapters = result.pages.filter((p) => !p.filename.includes('-quiz') && p.filename !== 'index.html');
  const quizzes = result.pages.filter((p) => p.filename.includes('-quiz'));

  console.log(`${DIM}   Output: ${result.outputDir}${RESET}`);
  console.log('');
  console.log(`${GREEN}✅ Build completado en ${elapsed}ms${RESET}`);
  console.log('');
  console.log(`   ${CYAN}📄 Capítulos:${RESET}  ${chapters.length}`);
  console.log(`   ${CYAN}🧠 Quizzes:${RESET}    ${quizzes.length}`);
  console.log(`   ${CYAN}📦 Assets:${RESET}     ${result.assets.length}`);
  console.log(`   ${CYAN}📝 Total:${RESET}      ${result.pages.length} páginas`);
  console.log('');

  chapters.forEach((p) => console.log(`   ${DIM}├─ 📄 ${p.filename}${RESET}`));
  quizzes.forEach((p, i) => {
    const prefix = i === quizzes.length - 1 ? '└─' : '├─';
    console.log(`   ${DIM}${prefix} 🧠 ${p.filename}${RESET}`);
  });

  console.log('');
  console.log(`   ${DIM}Serve con: npx serve ${result.outputDir}${RESET}`);
  console.log('');

} else if (command === 'serve') {
  console.log(`${BOLD}🚀 serve${RESET} no está implementado aún.`);
  console.log(`   Ejecuta: ${CYAN}npx serve dist${RESET}`);
} else {
  console.log('');
  console.log(`${BOLD}IA2Interactive${RESET} — Convierte Markdown en quizzes interactivos`);
  console.log('');
  console.log('Uso:');
  console.log(`  ${CYAN}ia2interactive build${RESET} <curso-dir> [output-dir]`);
  console.log(`  ${CYAN}ia2interactive serve${RESET} <curso-dir>`);
  console.log('');
}
