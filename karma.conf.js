module.exports = function(config) {
  config.set({

    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],

    files: [
      'src/javascript/libs/jquery.js',
      'src/javascript/libs/angular.js',
      'src/javascript/libs/*.js',
      'src/javascript/app/mocks.js',
      'src/javascript/app/templates.js',
      'src/javascript/app/**/*Spec.js'
    ],

    preprocessors: {
      'src/javascript/app/!(test)/!(*Spec|*Mock|mock).js': ['coverage']
    },

    reporters: ['progress', 'coverage'],

    coverageReporter: {
      type : 'html',
      dir : 'build/coverage/'
    },

    port: 9876,
    colors: true,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: true
  });
};