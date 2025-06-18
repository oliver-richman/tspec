#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function updatePackageVersion(packagePath, version) {
  const pkgPath = path.join(packagePath, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  
  pkg.version = version;
  
  // Update internal dependencies
  if (pkg.dependencies) {
    Object.keys(pkg.dependencies).forEach(dep => {
      if (dep.startsWith('@tspec/')) {
        pkg.dependencies[dep] = `^${version}`;
      }
    });
  }
  
  // Update dev dependencies
  if (pkg.devDependencies) {
    Object.keys(pkg.devDependencies).forEach(dep => {
      if (dep.startsWith('@tspec/')) {
        pkg.devDependencies[dep] = `^${version}`;
      }
    });
  }
  
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`Updated ${packagePath} to version ${version}`);
}

function syncVersions() {
  const rootPkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const version = rootPkg.version;
  
  const packages = [
    'packages/core',
    'packages/assert', 
    'packages/mock',
    'packages/cli'
  ];
  
  packages.forEach(pkg => updatePackageVersion(pkg, version));
  
  console.log(`All packages synchronized to version ${version}`);
}

function bumpVersion(type = 'patch') {
  const rootPkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const currentVersion = rootPkg.version;
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  
  let newVersion;
  switch (type) {
    case 'major':
      newVersion = `${major + 1}.0.0`;
      break;
    case 'minor':
      newVersion = `${major}.${minor + 1}.0`;
      break;
    case 'patch':
    default:
      newVersion = `${major}.${minor}.${patch + 1}`;
      break;
  }
  
  rootPkg.version = newVersion;
  fs.writeFileSync('package.json', JSON.stringify(rootPkg, null, 2) + '\n');
  
  syncVersions();
  
  console.log(`Version bumped from ${currentVersion} to ${newVersion}`);
  return newVersion;
}

function getCurrentVersion() {
  const rootPkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  return rootPkg.version;
}

if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'sync':
      syncVersions();
      break;
    case 'bump':
      const type = process.argv[3] || 'patch';
      bumpVersion(type);
      break;
    case 'version':
      console.log(getCurrentVersion());
      break;
    default:
      console.log('Usage:');
      console.log('  node sync-versions.js sync         # Sync all package versions');
      console.log('  node sync-versions.js bump [type]  # Bump version (patch|minor|major)');
      console.log('  node sync-versions.js version      # Show current version');
  }
}

module.exports = { 
  syncVersions, 
  updatePackageVersion, 
  bumpVersion, 
  getCurrentVersion 
}; 