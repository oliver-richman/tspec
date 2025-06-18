#!/bin/bash

echo "🚀 Setting up TSpec Publishing System..."

# Install all dependencies
echo "📦 Installing dependencies..."
npm install

# Setup Husky
echo "🪝 Setting up Git hooks..."
npx husky install
npx husky add .husky/pre-commit "npm run build && npx lint-staged"
npx husky add .husky/commit-msg "npx --no-install commitlint --edit \$1"

# Make scripts executable
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
chmod +x scripts/sync-versions.cjs

# Build all packages
echo "🔨 Building all packages..."
npm run build

# Sync versions
echo "🔄 Synchronizing package versions..."
npm run version:sync

echo "✅ Publishing system setup complete!"
echo ""
echo "Next steps:"
echo "1. Create npm organization: npm org:create tspec"
echo "2. Create npm automation token: npm token create --type=automation --read-and-publish"
echo "3. Add NPM_TOKEN to GitHub repository secrets"
echo "4. Enable GitHub Pages for documentation"
echo "5. Configure branch protection rules for 'main' branch"
echo ""
echo "Usage:"
echo "- Commit with: npm run commit (interactive conventional commits)"
echo "- Test release: npm run release:dry" 
echo "- Check version: npm run version:check"
echo "- Sync versions: npm run version:sync" 