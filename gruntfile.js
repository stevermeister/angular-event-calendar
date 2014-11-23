module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  var targetPath = 'build/target/',
    sourcePath = 'src/';

  grunt.initConfig({
    express: {
      source: {
        options: {
          server: 'server.js',
          livereload: true
        }
      }
    },
    copy: {
      index: {
        files: [
          { src: 'src/index.src.html', dest: 'src/index.html' }
        ]
      },
      dev: {
        files:
          [{src: 'bower_components/jquery/dist/jquery.min.js', dest: sourcePath + 'javascript/libs/jquery.min.js'},
          {src: 'bower_components/angular/angular.min.js', dest: sourcePath + 'javascript/libs/angular.min.js'},
          {src: 'bower_components/angular-mocks/angular-mocks.js', dest: sourcePath + 'javascript/libs/angular-mocks.js'},
          {src: 'bower_components/index.src.html', dest: sourcePath + 'index.html'}]
      },
      dist: {
        files: [
          { src: 'src/index.src.html', dest: 'build/target/index.html' },
        ]
      }
    },
    jslinker: {
      dev: {
        options: {
          target: sourcePath + 'index.html',
          relative_to: 'src/'
        },
        src: ['src/javascript/libs/jquery.min.js',
              'src/javascript/libs/angular.min.js',
              '!src/javascript/libs/angular-mocks.js',
              'src/javascript/app/templates.js',
              'src/javascript/app/**/*.js']
      }
    },
    clean: {
      bower: ['bower_components'],
      target: ['build/target/**']
    },
    html2js: {
      options: {
        base: 'src/javascript/app/',
        module: 'app-templates'
      },
      templates: {
        src: [sourcePath + 'javascript/app/**/views/*.html'],
        dest: sourcePath + 'javascript/app/templates.js'
      }
    },
    json: {
      main: {
        options: {
          namespace: 'mocks'
        },
        src: [sourcePath + 'javascript/app/calendar/resources/*.json'],
        dest: sourcePath + 'javascript/app/mocks.js'
      }
    },
    watch: {
      index: {
        files: ['src/index.src.html'],
        tasks: ['copy:index', 'jslinker:dev']
      },
      templates: {
        files: ['src/javascript/app/**/views/**/*.html'],
        tasks: ['html2js']
      },
      js: {
        files: ['src/javascript/app/**/*.js', targetPath + 'javascript/app/templates.js', targetPath + 'javascript/app/mocks.js'],
        tasks: ['ngAnnotate'],
        options: {
          livereload: true
        }
      },
      json: {
        files: ['src/javascript/app/calendar/resourses/*.json'],
        tasks: ['json']
      }
    },
    ngAnnotate: {
      dist: {
        files: {
          'build/target/javascript/app.js': [
              sourcePath + '/javascript/app/**/*.js',
              sourcePath + '/javascript/app/templates.js',
              sourcePath + '/javascript/app/mocks.js',
            '!src/javascript/app/**/*Spec.js',
          ]
        }
      }
    },
    jshint: {
      all: {
        src: ['src/javascript/app/**/*.js',
          '!src/javascript/app/templates.js',
          '!src/javascript/app/mocks.js'],
        options: {
          jshintrc: true
        }
      }
    },
    complexity: {
      generic: {
        src: ['src/javascript/app/**/*.js'],
        exclude: [
          'src/javascript/app/templates.js',
          'src/javascript/app/mocks.js'
        ],
        options: {
          breakOnErrors: true,
          errorsOnly: false,
          maintainability: 100,
          hideComplexFunctions: true
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },
    uglify: {
      dist: {
        files: {
          'build/target/javascript/app.min.js': ['build/target/javascript/app.js']
        }
      }
    },
    cssmin: {
      prod: {
        files: {
          'build/target/css/main.min.css': [sourcePath + 'css/main.css']
        }
      }
    },
    replace: {
      css_path: {
        options: {
          patterns: [
            { match: /css\/main\.css/, replacement: 'css/main.min.css'}
          ]
        },
        files: [
          {expand: true, flatten: true, src: [targetPath + '/index.html'], dest: 'build/target/'}
        ]
      }
    }
  });

  grunt.registerTask('default', ['start']);

  grunt.registerTask('start', 'Starting server...', function(targetOption) {
    var target = ['source', 'dist'].indexOf(targetOption) !== -1 ? targetOption : 'source';

    grunt.task.run(['express:' + target, 'watch', 'express-keepalive']);
  });

  grunt.registerTask('test', ['jshint', 'complexity', 'karma:unit']);
  grunt.registerTask('coverage', ['karma:unit', 'express', 'open:report', 'express-keepalive']);
  grunt.registerTask('install', ['copy:dev', 'clean:bower', 'html2js', 'json', 'jslinker:dev']);
  grunt.registerTask('build', ['clean:target', 'copy:dist', 'clean:bower', 'html2js', 'json', 'ngAnnotate:dist', 'uglify:dist','cssmin', 'replace:css_path']);

};