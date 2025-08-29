#!/usr/bin/env node

/**
 * Script to merge domain-8-additional.json into domain-8-cache.json
 * Run from CISSP project root: node merge-domain-8.js
 */

const fs = require('fs');
const path = require('path');

function mergeQuestions() {
  try {
    // Read the additional questions
    const additionalPath = path.join(__dirname, 'public/data/domain-8-additional.json');
    const additionalData = JSON.parse(fs.readFileSync(additionalPath, 'utf8'));
    
    // Read the current cache
    const cachePath = path.join(__dirname, 'public/data/domain-8-cache.json');
    const cacheData = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    
    console.log('📊 Current Status:');
    console.log(`   Cache has ${cacheData.questions.length} questions`);
    console.log(`   Adding ${additionalData.length} new questions`);
    
    // Merge the questions
    const mergedData = {
      ...cacheData,
      total_questions: cacheData.questions.length + additionalData.length,
      generated_at: new Date().toISOString(),
      questions: [...cacheData.questions, ...additionalData]
    };
    
    // Verify no duplicate IDs
    const ids = new Set(mergedData.questions.map(q => q.id));
    if (ids.size !== mergedData.questions.length) {
      console.warn('⚠️  Warning: Duplicate question IDs detected!');
    }
    
    // Write the merged data back
    fs.writeFileSync(cachePath, JSON.stringify(mergedData, null, 2));
    
    console.log('\n✅ Success!');
    console.log(`   Total questions: ${mergedData.total_questions}`);
    console.log(`   Question IDs: ${mergedData.questions[0].id} to ${mergedData.questions[mergedData.questions.length - 1].id}`);
    console.log(`   File updated: ${cachePath}`);
    
    // Optionally delete the additional file after merge
    console.log('\n🗑️  Removing additional file...');
    fs.unlinkSync(additionalPath);
    console.log('   domain-8-additional.json removed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the merge
mergeQuestions();
