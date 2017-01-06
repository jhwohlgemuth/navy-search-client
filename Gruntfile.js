var config = require('config').grunt;
//Load external parameters using config node module
module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        package: grunt.file.readJSON('package.json'),
        ports: config.ports,
        folders: config.folders,
        files: config.files,
        deployed: {
            assets: config.folders.assets.split('/')[1],
            images: config.files.images.split('/')[0],
            fonts: config.files.fonts.split('/')[0]
        },
        /**
         * Clear files and folders
         * @see {@link https://github.com/gruntjs/grunt-contrib-clean}
        **/
        clean: {
            options: { force: true },
            docs: [
                '<%= folders.reports %>/<%= folders.docs %>/*',
                './styleguide'
            ],
            coverage: ['<%= folders.reports %>/<%= folders.coverage %>/'],
            compile: [
                '<%= folders.app %>/templates.js',
                '<%= folders.app %>/style.css',
                '<%= folders.app %>/style.css.map'
            ],
            build: [
                '<%= folders.dist %>/<%= folders.client %>',
                '<%= folders.dist %>/<%= deployed.assets %>'
            ]
        },
        /**
         * Copy files and folders (used here to copy font files to deployment directory)
         * @see {@link https://github.com/gruntjs/grunt-contrib-copy}
        **/
        copy: {
            fonts: {
                files: [{
                        expand: true,
                        flatten: true,
                        src: ['<%= folders.assets %>/<%= files.fonts %>'],
                        dest: '<%= folders.dist %>/<%= deployed.assets %>/<%= deployed.fonts %>',
                        filter: 'isFile'
                    }]
            },
            library: {
                files: [{
                        expand: true,
                        flatten: true,
                        src: ['<%= folders.assets %>/library/*.js'],
                        dest: '<%= folders.dist %>/<%= deployed.assets %>/library',
                        filter: 'isFile'
                    }]
            }
        },
        /**
         * Lint compiled CSS output file
         * @see {@link https://github.com/gruntjs/grunt-contrib-csslint}
        **/
        csslint: {
            options: { csslintrc: '<%= files.config.csslint %>' },
            src: ['<%= folders.app %>/style.css']
        },
        /**
         * Validate files with ESLint
         * @see {@link https://www.npmjs.com/package/grunt-eslint}
        **/
        eslint: {
            options: { configFile: '<%= files.config.eslint %>' },
            ing: {
                options: { fix: true },
                src: [
                    '<%= folders.app %>/<%= files.scripts %>',
                    '!<%= folders.app %>/templates.js'
                ]
            },
            app: {
                options: { fix: false },
                src: [
                    '<%= folders.app %>/<%= files.scripts %>',
                    '!<%= folders.app %>/templates.js'
                ]
            }
        },
        /**
         * Start an Express.js web server
         * @see {@link https://github.com/blai/grunt-express}
        **/
        express: {
            main: {
                options: {
                    bases: [__dirname],
                    port: '<%= ports.server %>',
                    hostname: '0.0.0.0',
                    livereload: '<%= ports.livereload %>'
                }
            },
            demo: {
                options: {
                    bases: [__dirname],
                    port: '<%= ports.server %>',
                    hostname: '0.0.0.0',
                    serverreload: true
                }
            }
        },
        /**
         * Generate documentation from JS comments using JSDoc3
         * @see {@link https://github.com/krampstudio/grunt-jsdoc}
        **/
        jsdoc: {
            app: {
                src: [
                    '<%= folders.app %>/<%= files.scripts %>',
                    '!<%= folders.app %>/templates.js'
                ],
                dest: '<%= folders.reports %>/<%= folders.docs %>',
                options: { readme: 'README.md' }
            }
        },
        /**
         * Lint project JSON files
         * @see {@link https://github.com/brandonramirez/grunt-jsonlint}
        **/
        jsonlint: {
            project: {
                src: [
                    './*.json',
                    '<%= files.config.csslint %>'
                ]
            }
        },
        /**
         * Run tests and generate code coverage with the Karma test runner
         * @see {@link https://github.com/karma-runner/grunt-karma}
        **/
        karma: {
            options: {
                configFile: '<%= files.config.karma %>',
                port: '<%= ports.karma %>'
            },
            watch: {
                background: true,
                singleRun: false,
                coverageReporter: {
                    dir: '<%= folders.reports %>/<%= folders.coverage %>/',
                    includeAllSources: true
                }
            },
            coverage: {
                autoWatch: false,
                browsers: ['PhantomJS'],
                reporters: [
                    'spec',
                    'coverage'
                ]
            },
            covering: {
                autoWatch: true,
                singleRun: false,
                browsers: ['Firefox'],
                reporters: [
                    'progress',
                    'coverage'
                ]
            }
        },
        /**
         * Open files in browsers for review
         * @see {@link https://github.com/jsoverson/grunt-open}
        **/
        open: {
            browser: { path: 'http://localhost:<%= ports.server %>/<%= folders.app %>' },
            demo: { path: 'http://localhost:<%= ports.server %>/<%= folders.dist %>/<%= folders.client %>' },
            coverage: { path: __dirname + '/<%= folders.reports %>/<%= folders.coverage %>/report-html/index.html' },
            plato: { path: __dirname + '/<%= folders.reports %>/plato/index.html' },
            docs: { path: __dirname + '/<%= folders.reports %>/<%= folders.docs %>/index.html' },
            styleguide: { path: __dirname + '/styleguide/index.html' }
        },
        /**
         * Generate persistent static analysis reports with plato
         * @see {@link https://github.com/jsoverson/grunt-plato}
        **/
        plato: {
            app: {
                src: [
                    '<%= folders.app %>/<%= files.scripts %>',
                    '!<%= folders.app %>/templates.js'
                ],
                dest: '<%= folders.reports %>/plato',
                options: { eslint: require(config.files.config.eslint) }
            }
        },
        /**
         * Optimize JS code into single file using r.js
         * @see {@link https://github.com/gruntjs/grunt-contrib-requirejs}
         * @see (@link https://github.com/jrburke/r.js/blob/master/build/example.build.js}
        **/
        requirejs: {
            bundle: {
                options: {
                    out: '<%= folders.dist %>/<%= folders.client %>/<%= files.configScript %>',
                    mainConfigFile: '<%= folders.app %>/<%= files.configScript %>',
                    baseUrl: '<%= folders.app %>',
                    include: ['<%= files.configScript %>'],
                    preserveLicenseComments: false,
                    findNestedDependencies: true,
                    optimize: 'uglify2',
                    uglify2: {
                        output: {
                            comments: false,
                            preamble: '/* <%= package.name %> - v<%= package.version %> - ' + '2016-02-07 */'
                        },
                        compress: {
                            drop_console: true    //discard calls to console.* functions
                        }
                    }
                }
            }
        },
        /**
         * Run predefined tasks whenever watched file patterns are added, changed or deleted
         * @see {@link https://github.com/gruntjs/grunt-contrib-watch}
        **/
        watch: {
            style: {
                files: ['<%= folders.assets %>/<%= files.styles %>'],
                tasks: [
                    'process-styles',
                    'csslint'
                ],
                options: { spawn: false }
            },
            eslint: {
                files: '<%= folders.app %>/<%= files.scripts %>',
                tasks: ['eslint:ing'],
                options: { spawn: false }
            },
            lint: {
                files: [
                    '<%= folders.app %>/style.css',
                    //CSS
                    '<%= folders.app %>/<%= files.scripts %>'    //Scripts
                ],
                tasks: ['lint'],
                options: { spawn: false }
            },
            browser: {
                files: [
                    '<%= folders.app %>/<%= files.index %>',
                    //index.html
                    '<%= folders.assets %>/css/*.css',
                    //CSS
                    '<%= folders.app %>/style.css',
                    //CSS (less/sass)
                    '<%= folders.app %>/<%= files.scripts %>',
                    //Scripts
                    '<%= folders.assets %>/<%= files.templates %>'    //Templates
                ],
                tasks: ['compile'],
                options: {
                    livereload: '<%= ports.livereload %>',
                    spawn: false
                }
            }
        },
        benchmark: {
            options: { displayResults: true },
            all: {
                src: ['<%= folders.test %>/benchmarks/*.js'],
                dest: '<%= folders.reports %>/benchmarks/results.csv'
            }
        },
        coveralls: {
            options: {
                // LCOV coverage file relevant to every target
                coverageDir: '<%= folders.reports %>/<%= folders.coverage %>/',
                recursive: true,
                force: true
            }
        },
        jsinspect: {
            app: { src: ['<%= folders.app %>/<%= files.scripts %>'] },
            models: { src: ['<%= folders.app %>/<%= files.models %>'] },
            views: { src: ['<%= folders.app %>/<%= files.views %>'] },
            controllers: { src: ['<%= folders.app %>/<%= files.controllers %>'] }
        },
        a11y: { index: { options: { urls: ['<%= folders.app %>/<%= files.index %>'] } } },
        accessibility: {
            index: {
                options: {
                    reportLevels: {
                        notice: false,
                        warning: true,
                        error: true
                    },
                    accessibilityLevel: 'WCAG2AAA',
                    ignore: ['WCAG2A.Principle2.Guideline2_4.2_4_2.H25.2']
                },
                src: ['<%= folders.app %>/<%= files.index %>']
            },
            templates: {
                options: {
                    accessibilityLevel: 'WCAG2AAA',
                    ignore: [
                        //Templates will tend to always violate these rules and need not be reported
                        'WCAG2A.Principle2.Guideline2_4.2_4_2.H25.2',
                        'WCAG2A.Principle2.Guideline2_4.2_4_2.H25.1.NoTitleEl',
                        'WCAG2A.Principle3.Guideline3_1.3_1_1.H57.2'
                    ]
                },
                src: ['<%= folders.assets %>/<%= files.templates %>']
            }
        },
        browserify: { bundle: { files: { '<%= folders.dist %>/<%= folders.client %>/bundle.js': ['<%= folders.app %>/main.js'] } } },
        replace: {
            'bundle-url': {
                options: {
                    patterns: [{
                            match: /<script.*<\/script>/g,
                            replacement: '<script src="bundle.min.js"></script>'
                        }]
                },
                files: [{
                        src: '<%= folders.dist %>/<%= folders.client %>/<%= files.index %>',
                        dest: '<%= folders.dist %>/<%= folders.client %>/<%= files.index %>'
                    }]
            }
        },
        uglify: {
            bundle: {
                options: {
                    mangle: true,
                    comments: false,
                    compress: {
                        drop_console: true    //discard calls to console.* functions
                    },
                    banner: '/* <%= package.name %> - v<%= package.version %> - 2016-02-07 */'
                },
                files: { '<%= folders.dist %>/<%= folders.client %>/bundle.min.js': ['<%= folders.dist %>/<%= folders.client %>/bundle.js'] }
            }
        },
        handlebars: {
            main: {
                options: {
                    amd: true,
                    //Use processName to name the template keys within the compiled templates.js file
                    //"assets/templates/example.hbs" --> "example"
                    processName: function (filePath) {
                        return filePath.replace(config.folders.assets, '').replace(/[\/]templates[\/]/, '').replace(/[.]hbs/, '');
                    }
                },
                files: { '<%= folders.app %>/templates.js': ['<%= folders.assets %>/<%= files.templates %>'] }
            }
        },
        imagemin: {
            build: {
                files: [{
                        expand: true,
                        flatten: false,
                        cwd: './',
                        src: ['<%= folders.assets %>/<%= files.images %>'],
                        dest: '<%= folders.dist %>'
                    }]
            }
        },
        sass: {
            main: {
                options: {
                    style: 'expanded',
                    sourcemap: 'inline'
                },
                files: { '<%= folders.app %>/style.css': '<%= folders.assets %>/sass/style.scss' }
            }
        },
        htmlhintplus: {
            app: {
                src: [
                    '<%= folders.assets %>/<%= files.templates %>',
                    '<%= folders.app %>/<%= files.index %>'
                ]
            }
        },
        htmlmin: {
            options: {
                removeComments: true,
                collapseWhitespace: true
            },
            build: {
                files: [{
                        src: '<%= folders.app %>/<%= files.index %>',
                        dest: '<%= folders.dist %>/<%= folders.client %>/<%= files.index %>'
                    }]
            }
        },
        postcss: {
            options: {
                parser: require('postcss-safe-parser'),
                processors: [
                    require('autoprefixer')({ browsers: 'last 2 versions' }),
                    require('cssnano')()
                ]
            },
            dev: {
                options: {
                    map: {
                        inline: false,
                        annotation: '<%= folders.app %>'
                    }
                },
                src: [
                    '<%= folders.app %>/*.css',
                    '<%= folders.assets %>/css/style.css'
                ],
                dest: '<%= folders.app %>/style.css'
            },
            prod: {
                src: '<%= folders.app %>/*.css',
                dest: '<%= folders.dist %>/<%= folders.client %>/style.css'
            },
            styleguide: {
                options: {
                    processors: [require('mdcss')({
                            examples: {
                                css: [
                                    '.././app/style.css',
                                    // '.././assets/css/style.css'
                                ]
                            }
                        })]
                },
                src: [
                    '<%= folders.app %>/*.css',
                    '<%= folders.assets %>/css/*.css'
                ]
            }
        }
    });
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);
    grunt.loadTasks(config.folders.tasks);
    grunt.registerTask('default', ['serve']);
    grunt.registerTask('eslinting', 'Watch task for real-time linting with ESLint', [
        'eslint:ing',
        'watch:eslint'
    ]);
    grunt.registerTask('aria-audit', [
        'accessibility',
        'a11y'
    ]);
};
