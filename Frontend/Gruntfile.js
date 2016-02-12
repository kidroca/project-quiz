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
            libs: [
                // !Order matters!
                'dev/libs/**/*.js', // include
                '!dev/libs/**/src/**',
                '!dev/libs/**/demo/**',
                '!dev/libs/**/js/**',
                '!dev/libs/**/grunt/**',

                'dev/libs/**/dist/js/*.js',// include
                '!dev/libs/**/*.min.js',
                '!dev/libs/**/*index.js',
                '!dev/libs/**/*package.js',
                '!dev/libs/**/*npm.js',
                '!dev/libs/**/*Gruntfile.js',
                '!dev/libs/jquery/dist/jquery.js', // jquery is declared manually to be on top
                '!dev/libs/angular/angular.js' // angular is declared manually to be on top
            ],
            scripts: [
                'dev/scripts/**/*.js',
                '!dev/scripts/libs/**'
            ],
            css: [
                'dev/libs/**/*.css',
                '!dev/libs/**/demo/**',
                '!dev/libs/**/*.min.css',
                'dev/styles/**/*.css']
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
                    src: ['index.jade', 'views/**/*.jade', '!views/**/shared/**'],
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
                    src: ['index.less'],
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
                    src: [
                        'images/**',
                        'fonts/**',
                        'libs/**',
                        'views/**/*.html'
                    ],
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
                    src: ['images/**', '**/*.html', 'fonts/**'],
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
                    jshintrc: '.jshintrc',
                    reporter: require('jshint-stylish'),
                    force: true
                },
                src: ['app/scripts/**/*.js', '!app/scripts/libs/**']
            }
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
            js: {
                files: ['app/scripts/**/*.js', 'app/libs/**/*.js'],
                // the created js files linting is done here
                tasks: ['newer:copy:scripts', 'newer:jshint']
            },
            less: {
                files: ['app/less/**/*.less'],
                tasks: ['less:dev']
            },
            views: {
                files: ['app/views/**/*.jade', 'app/index.jade'],
                // no newer for jade because if the change is in a template
                // a file using the template won't be considered newer
                tasks: ['jade:dev', 'newer:copy:dev']
            },
            includeSource: {
                files: ['dev/scripts/**/*.js', 'dev/styles/**/*.css '],
                tasks: ['includeSource'],
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
                files: {
                    'app/views/shared/main/scripts.jade': 'app/views/shared/main/scripts.jade',
                    'app/views/shared/main/stylesheets.jade': 'app/views/shared/main/stylesheets.jade'
                }
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
        'includeSource',
        'jade:dev'
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