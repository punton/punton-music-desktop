module.exports = {
    extends: ['standard', 'prettier', 'react-app', 'plugin:jsx-a11y/recommended' ],
    plugins: ['prettier', 'react', 'jsx-a11y' ],
    rules: {
        semi: [ 'error', 'never' ]
    },
    env: {
        browser: true,
        node: true
    }
}
