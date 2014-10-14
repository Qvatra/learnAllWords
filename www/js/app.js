// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'ioService' is found in ioService.js
// 'controllers' is found in controllers.js
angular.module('app', ['ionic', 'controllers', 'services', 'ngCordova'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });

    //document.addEventListener("deviceready", onDeviceReady, false);
    //function onDeviceReady() {
    //    alert('1');
    //    window.webkitRequestFileSystem(LocalFileSystem.PERSISTENT, 0, success, fail);
    //}
})

.config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      // setup an abstract state for the tabs directive
      .state('tab', {
          url: "/tab",
          abstract: true,
          templateUrl: "templates/tabs.html"
      })

      // Each tab has its own nav history stack:

      .state('tab.dash', {
          url: '/dash',
          views: {
              'tab-dash': {
                  templateUrl: 'templates/tab-dash.html',
                  controller: 'DashCtrl'
              }
          }
      })

      .state('tab.card', {
          url: '/card',
          views: {
              'tab-card': {
                  templateUrl: 'templates/tab-card.html',
                  controller: 'CardCtrl'
              }
          }
      })

      .state('tab.settings', {
          url: '/settings',
          views: {
              'tab-settings': {
                  templateUrl: 'templates/tab-settings.html',
                  controller: 'SettingsCtrl'
              }
          }
      })

    .state('tab.edit', {
        url: '/edit',
        views: {
            'tab-edit': {
                templateUrl: 'templates/tab-edit.html',
                controller: 'EditCtrl'
            }
        }
    })

    .state('tab.explorer', {
        url: '/explorer?mode',
        views: {
            'tab-edit': {
                templateUrl: 'templates/edit-explorer.html',
                controller: 'ExplorerCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/dash');

});


//initializing modules
angular.module('controllers', []);
angular.module('services', []);


