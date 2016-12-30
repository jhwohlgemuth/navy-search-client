module.exports = function(grunt) {
    'use strict';

    // Default Task
    grunt.registerTask('serve', 'Start a live-reload enabled browser (no tests)', [
        'compile',
        'express',
        'open:browser',
        'watch:browser'
    ]);
    grunt.registerTask('lint', 'Lint JSON, CSS, and JS code', [
        'jsonlint',
        'htmlhintplus',
        'csslint',
        'eslint:app'
    ]);
    grunt.registerTask('linting', 'Watch task for real-time linting', [
        'lint',
        'watch:lint'
    ]);
    grunt.registerTask('styling', 'Watch task for real-time styling', [
        'process-styles',
        'csslint',
        'watch:style'
    ]);
    grunt.registerTask('test', 'Run full test and validation battery', [
        'compile',
        'lint',
        'cover'
    ]);
    grunt.registerTask('cover', 'Generate code coverage report using Karma and Istanbul', [
        'clean:coverage',
        'clean:compile',
        'precompile-templates',
        'karma:coverage'
    ]);
    grunt.registerTask('covering', 'Watch task to write tests and see code coverage in real-time', [
        'clean:coverage',
        'clean:compile',
        'precompile-templates',
        'karma:covering'
    ]);
    grunt.registerTask('precompile-templates', [
        'handlebars:main'
    ]);
    grunt.registerTask('process-styles', [
        'sass:main',   /*pre-process */
        'postcss:dev', /*post-process*/
        'postcss:prod'
    ]);
    grunt.registerTask('bundle-scripts', [
        'browserify:bundle',
        'uglify:bundle'
    ]);
    grunt.registerTask('compile', [
        'clean:compile',
        'process-styles',
        'precompile-templates'
    ]);
    grunt.registerTask('build', [
        'clean:build',
        'compile',
        'bundle-scripts',
        'htmlmin',
        'replace:bundle-url',
        'imagemin:build',
        'copy:fonts',
        'copy:library'
    ]);
    grunt.registerTask('docs', 'Generate documentation with JSDoc3 and styleguide with mdcss', [
        'clean:docs',
        'jsdoc:app',
        'sass:main',/*pre-process */
        'postcss:styleguide'
    ]);
    grunt.registerTask('reports', 'Generate code coverage and plato report - then open both in browser', [
        'plato',
        'cover',
        'open:plato',
        'open:coverage'
    ]);
};
