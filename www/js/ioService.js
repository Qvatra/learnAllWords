angular.module('services').service('ioService', ['$rootScope', '$q', '$http', '$timeout', function ($rootScope, $q, $http, $timeout) {
    //console.log('io');
    var vm = this;

    vm.initialize = function () {
        if (localStorage.getItem('dictionary') && localStorage.getItem('dictionary') != "undefined") {
            $rootScope.dictionary = JSON.parse(localStorage.getItem('dictionary'));
            $rootScope.dictionary = $rootScope.dictionary.map(function (item) {
                return { w: item.w, t: item.t, d: parseFloat(item.d), r: parseFloat(item.r) };
            });
        } else {
            $rootScope.dictionary = [];
            vm.saveDictionary();
        }

        if (localStorage.getItem('settings') && localStorage.getItem('settings') != "undefined") {
            $rootScope.settings = JSON.parse(localStorage.getItem('settings'));
            $rootScope.settings = vm.parseFloatSettings($rootScope.settings);
        } else {
            $rootScope.settings = { direction: 'both', w1: 5, w2: 15, w3: 30, w4: 50 };
            vm.saveSettings();
        }
    }


    vm.parseFloatSettings = function (settings) {
        settings.w1 = parseFloat(settings.w1);
        settings.w2 = parseFloat(settings.w2);
        settings.w3 = parseFloat(settings.w3);
        settings.w4 = parseFloat(settings.w4);
        return settings;
    }

    vm.saveDictionary = function (arr) {
        $timeout(function () {
            localStorage.setItem('dictionary', JSON.stringify(arr));
        });
    }


    vm.saveSettings = function () {
        $timeout(function () {
            localStorage.setItem('settings', JSON.stringify($rootScope.settings));
        });
    }

}]);