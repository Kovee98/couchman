module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    parserOptions: {
        parser: 'babel-eslint'
    },
    rules: {
    // allow async-await
        'generator-star-spacing': 'off',
        // allow paren-less arrow functions
        'arrow-parens': 'off',
        'one-var': 'off',

        'import/first': 'off',
        'import/named': 'error',
        'import/namespace': 'error',
        'import/default': 'error',
        'import/export': 'error',
        'import/extensions': 'off',
        'import/no-unresolved': 'off',
        'import/no-extraneous-dependencies': 'off',
        'prefer-promise-reject-errors': 'off',
        'prefer-const': 'off',

        // allow console.log during development only
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        // allow debugger during development only
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        indent: ['error', 4],
        'vue/html-indent': ['error', 4],
        'vue/script-indent': ['error', 4],
        semi: ['error', 'always', { omitLastInOneLineBlock: false }]
    }
};
