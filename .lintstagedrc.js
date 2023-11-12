module.exports = {
  '*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint --fix'],
  '*.{ts,tsx}': [() => 'tsc --project tsconfig.json'],
}
