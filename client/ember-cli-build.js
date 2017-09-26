/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.

  // В порядке объявления по документации метроника
  
  // Plugins CSS
  app.import("vendor/plugins/simple-line-icons/simple-line-icons.css");
  app.import("vendor/plugins/bootstrap/css/bootstrap.css");
  app.import("vendor/plugins/bootstrap-switch/css/bootstrap-switch.css");
  app.import("vendor/plugins/fullcalendar/fullcalendar.css");
  app.import("vendor/plugins/pickadate/lib/themes/classic.css");
  app.import("vendor/plugins/pickadate/lib/themes/classic.date.css");
  app.import("vendor/plugins/pickadate/lib/themes/classic.time.css");

  // Plugins Fonts
  // Simple Line Icons
  app.import("vendor/plugins/simple-line-icons/fonts/Simple-Line-Icons.eot", { destDir: 'fonts' });
  app.import("vendor/plugins/simple-line-icons/fonts/Simple-Line-Icons.dev.svg", { destDir: 'fonts' });
  app.import("vendor/plugins/simple-line-icons/fonts/Simple-Line-Icons.ttf", { destDir: 'fonts' });
  app.import("vendor/plugins/simple-line-icons/fonts/Simple-Line-Icons.woff", { destDir: 'fonts' });
  app.import("vendor/plugins/simple-line-icons/fonts/Simple-Line-Icons.woff2", { destDir: 'fonts' });

  // Plugins JS
  app.import("vendor/plugins/jquery-ui/jquery-ui.min.js");
  app.import("vendor/plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.js");
  app.import("vendor/plugins/jquery-slimscroll/jquery.slimscroll.js");
  app.import("vendor/plugins/jquery.blockui.min.js");
  app.import("vendor/plugins/bootstrap-switch/js/bootstrap-switch.js");
  app.import("vendor/plugins/backstretch/jquery.backstretch.js");
  app.import("vendor/plugins/pickadate/lib/picker.js");
  app.import("vendor/plugins/pickadate/lib/picker.date.js");
  app.import("vendor/plugins/pickadate/lib/picker.time.js");
  app.import("vendor/plugins/pickadate/lib/translations/ru_RU.js");
  app.import("vendor/plugins/pickadate/translations/ru_RU.js");

  // Layout JS
  app.import("vendor/scripts/app.js");
  app.import("vendor/scripts/layout/layout.js");
  app.import("vendor/scripts/quick-sidebar.js");

  // Pages JS

  // Bower libs
  app.import("bower_components/jquery-validation/dist/jquery.validate.js");
  app.import("bower_components/jquery-validation/src/localization/messages_ru.js");

  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
