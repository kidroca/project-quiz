'use strict';

module.exports = function (grunt) {

    var devPort = 9578;
    var reloadPort = 35729;

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // =======================
        // DEV VARIABLES =========
        // =======================
        dev: {
            scripts: ['dev/scripts/**/*.js'],
            css: ['dev/styles/**/*.css']
        },
        // =======================
        // JADE CONFIG ===========
        // =======================
        jade: {
            dev: {
                options: {
                    pretty: true
                },
                files: [{
                    expand: true,
                    cwd: 'app/',
                    src: ['index.jade', 'views/**/*.jade'],
                    dest: 'dev/',
                    ext: '.html'
                }]
            }
        },
        // =======================
        // LESS CONFIG ===========
        // =======================
        less: {
            dev: {
                options: {
                    compress: false
                },
                files: [{
                    expand: true,
                    cwd: 'app/less',
                    src: ['**/*.less'],
                    dest: 'dev/styles',
                    ext: '.css'
                }]
            }
        },
        // =======================
        // CSS-LINT CONFIG ========
        // =======================
        csslint: {
            lint: {
                src: ['dev/styles/**/*.css']
            }
        },
        // =======================
        // COPY CONFIG ===========
        // =======================
        copy: {
            dev: {
                files: [{
                    expand: true,
                    cwd: 'app/',
                    src: ['images/**'],
                    dest: 'dev/'
                }]
            },
            scripts: {
                files: [{
                    expand: true,
                    cwd: 'app/',
                    src: ['scripts/**/*.js'],
                    dest: 'dev/'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dev/',
                    src: ['images/**', '**/*.html', '!views/shared/**'],
                    dest: 'dist/'
                }]
            }
        },
        // =======================
        // JSHINT CONFIG =========
        // =======================
        jshint: {
            lint: {
                options: {
                    jshintrc: './jshintrc',
                    reporter: require('jshint-stylish')
                },
                src: 'app/scripts/**/*.js'
            },
        },
        // =======================
        // CONNECT CONFIG ========
        // =======================
        connect: {
            dev: {
                options: {
                    port: devPort,
                    livereload: reloadPort,
                    hostname: 'localhost',
                    base: 'dev/'
                },
                livereload: {
                    options: {
                        open: true,
                        base: ['app']
                    }
                }
            }
        },
        // =======================
        // WATCH CONFIG ==========
        // =======================
        watch: {
            options: {
                livereload: reloadPort
            },
            livereload: {
                options: {
                    livereload: true
                },
                files: [
                    'dev/**/*.html',
                    'dev/styles/**/*.css',
                    'dev/scripts/**/*.js'
                ]
            },
            // change
            js: {
                files: ['app/scripts/**/*.js'],
                // the created js files linting is done here
                tasks: ['newer:copy:scripts', 'newer:jshint']
            },
            stylus: {
                files: ['app/stylus/**/*.styl'],
                tasks: ['newer:stylus:dev']
            },
            views: {
                files: ['app/**/*.jade'],
                tasks: ['jade:dev'] // removed newer: because changes to layout are not reflection
            },
            includeSource: {
                files: ['dev/scripts/**/*.js', 'dev/styles/**/*.js'],
                tasks: ['includeSource:singlePage'],
                options: {
                    event: ['added', 'deleted']
                }
            }
        },
        // =======================
        // AUTO-INCLUDE CONFIG ===
        // =======================
        includeSource: {
            options: {
                ordering: 'top-down',
                templates: {
                    jade: {
                        js: 'script(src="{filePath}", type="text/javascript")',
                        css: 'link(href="{filePath}", rel="stylesheet", type="text/css")'
                    }
                },
                // Removes the 'dev/' prefix of the path
                rename: function (dest, matched) {
                    return matched.substr('dev/'.length);
                }
            },
            targets: {
                // this main template hold all the style and script references and is applied to all pages
                files: {'app/views/shared/layout.jade': 'app/views/shared/layout.jade'}
            },
            singlePage: {
                // used in a single page application
                files: {'dev/index.html': 'dev/index.html'}
            }
        },
        // =======================
        // PROCESS-HTML CONFIG ===
        // FOR DISTRIBUTION ======
        // =======================
        processhtml: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dev/',
                    src: ['**/*.html'],
                    dest: 'dist/',
                    ext: '.html'
                }]
            }
        },
        // =======================
        // CONCAT CONFIG =========
        // =======================
        concat: {
            js: {
                src: 'dev/scripts/**/*.js',
                dest: 'temp/js/scripts.js'
            },
            css: {
                src: 'dev/styles/**/*.css',
                dest: 'temp/css/style.css'
            }
        },
        // =======================
        // MIN CONFIG ============
        // =======================
        uglify: {
            js: {
                src: 'temp/js/scripts.js',
                dest: 'dist/scripts/scripts.min.js'
            }
        },
        cssmin: {
            css: {
                src: 'temp/css/style.css',
                dest: 'dist/styles/style.min.css'
            }
        },
        // =======================
        // CLEAN CONFIG ==========
        // =======================
        clean: {
            temp: {
                src: ['temp']
            },
            dev: {
                src: ['dev']
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('compile', [
        'jshint',
        'clean:dev',
        'copy:scripts',
        'copy:dev',
        'less:dev',
        'jade:dev',
        'includeSource:singlePage',
    ]);

    grunt.registerTask('serve', [
        'compile',
        'connect:dev',
        'watch']);

    grunt.registerTask('build', [
        'compile',
        // 'csslint',
        'concat:js',
        'concat:css',
        'copy:dist',
        'uglify:js',
        'cssmin:css',
        'processhtml:dist',
        'clean:temp'
    ]);

    grunt.registerTask('default', ['serve']);
};