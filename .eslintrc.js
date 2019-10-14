module.exports = {
	'env': {
		'commonjs': true,
		'es6': true,
		'node': true
	},
	'extends': 'airbnb-base',
	'globals': {
		'Atomics': 'readonly',
		'SharedArrayBuffer': 'readonly'
	},
	'parserOptions': {
		'ecmaVersion': 2018
	},
	'rules': {
		'max-len': 'off',
		'no-unused-vars': 'warn',
		'no-else-return': 'off',
		'consistent-return': 'warn'
	}
};