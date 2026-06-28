// Seed warning_lights table from warning-lights-data.ts
// Usage: node scripts/seed-warning-lights.mjs
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { readFileSync } from 'fs';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Extract warningLights array from the TS file
const src = readFileSync('src/lib/warning-lights-data.ts', 'utf8');

// Extract the array section (from "export const warningLights" to the matching "];")
const start = src.indexOf('export const warningLights: WarningLight[] = [');
const arrayStr = src.slice(start);

// Parse each light object using regex
const lightBlocks = [];
let depth = 0;
let startIdx = -1;
for (let i = arrayStr.indexOf('['); i < arrayStr.length; i++) {
  if (arrayStr[i] === '{') {
    if (depth === 0) startIdx = i;
    depth++;
  } else if (arrayStr[i] === '}') {
    depth--;
    if (depth === 0 && startIdx !== -1) {
      lightBlocks.push(arrayStr.slice(startIdx, i + 1));
      startIdx = -1;
    }
  }
}

console.log(`Found ${lightBlocks.length} warning lights`);

for (const block of lightBlocks) {
  try {
    const slug = extract(block, 'slug');
    const title = extract(block, 'title');
    const severity = extract(block, 'severity');
    const meaning = extractMultiline(block, 'meaning');
    const causes = extractArray(block, 'causes');
    const canDrive = extractMultiline(block, 'can_drive');
    const minCost = parseInt(extract(block, 'min_cost') || '0');
    const maxCost = parseInt(extract(block, 'max_cost') || '0');
    const icon = extractMultiline(block, 'icon');
    const obdCodes = extractArray(block, 'related_obd_codes');

    const { error } = await supabase.from('warning_lights').upsert({
      slug, title, severity, meaning, causes, can_drive: canDrive,
      min_cost: minCost, max_cost: maxCost, icon, related_obd_codes: obdCodes,
    }, { onConflict: 'slug' });

    if (error) console.error(`  ${slug}: ERROR ${error.message}`);
    else console.log(`  ${slug}: OK`);
  } catch (e) {
    console.error(`  Block parse error: ${e.message}`);
  }
}

console.log('Done.');

// Simple extractors
function extract(block, key) {
  // Try single quotes
  let m = block.match(new RegExp(`${key}:\\s*'([^']*)'`));
  if (m) return m[1];
  // Try double quotes
  m = block.match(new RegExp(`${key}:\\s*"([^"]*)"`));
  if (m) return m[1];
  // Try number
  m = block.match(new RegExp(`${key}:\\s*(\\d+)`));
  if (m) return m[1];
  return '';
}

function extractMultiline(block, key) {
  // Template literal
  let m = block.match(new RegExp(`${key}:\\s*\`([^\`]*)\``));
  if (m) return m[1];
  // Double-quoted string (multi-line)
  m = block.match(new RegExp(`${key}:\\s*"([^"]*)"`, 's'));
  if (m) return m[1];
  return extract(block, key);
}

function extractArray(block, key) {
  const result = [];
  // Find the array open bracket
  const startIdx = block.indexOf(key + ':');
  if (startIdx === -1) return result;
  const bracketStart = block.indexOf('[', startIdx);
  if (bracketStart === -1) return result;
  // Find matching close bracket
  let depth = 1;
  let i = bracketStart + 1;
  let inStr = false;
  let strChar = '';
  while (i < block.length && depth > 0) {
    const ch = block[i];
    if (inStr) {
      if (ch === strChar && block[i-1] !== '\\\\') inStr = false;
    } else {
      if (ch === '"' || ch === "'") { inStr = true; strChar = ch; }
      else if (ch === '[') depth++;
      else if (ch === ']') depth--;
    }
    i++;
  }
  if (depth > 0) return result;
  const content = block.slice(bracketStart + 1, i - 1);
  // Extract string items (single or double quoted)
  const items = content.match(/["']([^"']*)["']/g);
  if (!items) return result;
  return items.map(s => s.slice(1, -1));
}
