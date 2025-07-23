module.exports = {
	root: true,
	env: {
		browser: true,
		es2020: true,
	},
	extends: [
		'eslint:recommended',
		'@typescript-eslint/recommended',
		'plugin:solid/typescript',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
	plugins: ['@typescript-eslint', 'solid'],
	rules: {
		'@typescript-eslint/no-unused-vars': 'error',
		'solid/reactivity': 'error',
		'solid/no-destructure': 'error',
	},
};
