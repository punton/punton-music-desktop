module.exports = {
    extends: [ 'standard', 'prettier' ],
    plugins: [ 'prettier' ],
    rules: {
        semi: [ 'error', 'never' ]
    },
    env: {
        browser: true,
        node: true
    }
}
