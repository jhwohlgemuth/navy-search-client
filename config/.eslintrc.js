var ALLOWED_MAGIC_NUMBERS  = [-1, 0, 1, 2, 3, 10, 100, 1000];
module.exports = {
    env: {
        amd: true,
        browser: true,
        jquery: true,
        es6: true
    },
    plugins: [
        'backbone'
    ],
    rules: {
        'backbone/collection-model': ['warn'],
        'backbone/defaults-on-top': ['warn'],
        'backbone/model-defaults': ['warn'],
        'backbone/no-collection-models': ['warn'],
        'backbone/no-model-attributes': ['warn'],
        'no-magic-numbers': ['warn', {ignore: ALLOWED_MAGIC_NUMBERS}]
    },
    extends: 'omaha-prime-grade'
}
