#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Paths to the files
const additionalPath = path.join(__dirname, '../public/data/domain-8-additional.json');
const cachePath = path.join(__dirname, '../public/data/domain-8-cache.json');

// Read the files
const additionalData = JSON.parse(fs.readFileSync(additionalPath, 'utf8'));
const cacheData = JSON.parse(fs.readFileSync(cachePath, 'utf8'));

console.log(`Current cache has ${cacheData.questions.length} questions`);
console.log(`Adding ${additionalData.length} new questions`);

// Merge the questions
const mergedData = {
  ...cacheData,
  total_questions: cacheData.questions.length + additionalData.length,
  generated_at: new Date().toISOString(),
  questions: [...cacheData.questions, ...additionalData]
};

console.log(`Merged total: ${mergedData.total_questions} questions`);

// Write the merged data back to cache
fs.writeFileSync(cachePath, JSON.stringify(mergedData, null, 2));

console.log('✅ Successfully merged domain-8 questions!');
console.log(`Updated ${cachePath}`);
