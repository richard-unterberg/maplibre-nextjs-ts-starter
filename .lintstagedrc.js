module.exports = {
  '*.{js,jsx,ts,tsx}': 'prettier --write --ignore-unknown --no-error-on-unmatched-pattern',
  '*.{ts,tsx}': [() => 'tsc --project tsconfig.json'],
}
