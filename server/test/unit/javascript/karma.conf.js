// Karma configuration
// Generated on Fri May 29 2015 21:48:48 GMT+0200 (CEST)

module.exports = function (config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',
        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],
        // list of files / patterns to load in the browser
        files: [
            'https://code.jquery.com/jquery-1.11.1.min.js',
            '../../../grails-app/assets/javascripts/vendor/moment-with-locales.min.js',
            '../../../grails-app/assets/javascripts/vendor/moment-range.min.js',
            '../../../grails-app/assets/javascripts/vendor/bootstrap.min.js',
            '../../../grails-app/assets/javascripts/vendor/jquery-ui.min.js',
            '../../../grails-app/assets/javascripts/vendor/jquery.inputmask.js',
            '../../../grails-app/assets/javascripts/vendor/bootstrap-datetimepicker.min.js',
            '../../../grails-app/assets/javascripts/vendor/bootflat/icheck.min.js',
            '../../../grails-app/assets/javascripts/vendor/bootstrap-select/bootstrap-select.min.js',
            '../../../grails-app/assets/javascripts/*.js',
            '../../../test/unit/javascript/specs/*.specs.js'
        ],
        // list of files to exclude
        exclude: [],
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
        },
        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],
        remoteReporter: {
            host: 'localhost',
            port: '5000'
        },
        // web server port
        port: 9876,
        // enable / disable colors in the output (reporters and logs)
        colors: true,
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,
        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS', 'Chrome', 'Firefox'],
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,
        plugins: [
            'karma-jasmine',
            'karma-firefox-launcher',
            'karma-chrome-launcher',
            'karma-phantomjs-launcher'
        ]
    })
}
