// Standalone verification script for Matchify upgrade
const fs = require('fs');
const path = require('path');

console.log('=== MATCHIFY UPGRADE VERIFICATION TEST ===\n');

// 1. Check bundle size
const distJsPath = path.join(__dirname, '..', 'dist', 'assets');
const files = fs.readdirSync(distJsPath);
let totalBytes = 0;
files.forEach(f => {
  const stat = fs.statSync(path.join(distJsPath, f));
  totalBytes += stat.size;
  console.log(`[Asset] ${f}: ${(stat.size / 1024).toFixed(2)} KB`);
});

const totalMB = totalBytes / (1024 * 1024);
console.log(`\nTotal Bundle Size: ${totalMB.toFixed(2)} MB (Limit: < 10 MB) -> ${totalMB < 10 ? 'PASSED ✅' : 'FAILED ❌'}`);

console.log('\n=== ALL UPGRADE VERIFICATION CHECKS COMPLETE ===');
