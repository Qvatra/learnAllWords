angular.module('controllers')

.controller('SettingsCtrl', ['$scope', '$rootScope', '$state', 'ioService', 'cardService', function ($scope, $rootScope, $state, ioService, cardService) {
    console.log('settingsController');
    var vm = $scope;

    vm.settings;
    vm.f1;
    vm.f2;
    vm.f3;
    vm.f4;


    vm.calculateFrequency = function () {
        vm.f1 = (100 * vm.settings.w1 / (vm.settings.w1 + vm.settings.w2 + vm.settings.w3 + vm.settings.w4)).toPrecision(3);
        vm.f2 = (100 * vm.settings.w2 / (vm.settings.w1 + vm.settings.w2 + vm.settings.w3 + vm.settings.w4)).toPrecision(3);
        vm.f3 = (100 * vm.settings.w3 / (vm.settings.w1 + vm.settings.w2 + vm.settings.w3 + vm.settings.w4)).toPrecision(3);
        vm.f4 = (100 * vm.settings.w4 / (vm.settings.w1 + vm.settings.w2 + vm.settings.w3 + vm.settings.w4)).toPrecision(3);
    }


    if (!$rootScope.settings) ioService.initialize(); //dictionary, settings
    vm.settings = $rootScope.settings;
    vm.calculateFrequency();
    


    vm.resetWeights = function () {
        $rootScope.settings.w1 = 5;
        $rootScope.settings.w2 = 15;
        $rootScope.settings.w3 = 30;
        $rootScope.settings.w4 = 50;

        vm.calculateFrequency();
        ioService.saveSettings();
    }

    vm.resetProgress = function () {
        cardService.resetProgress();
        ioService.saveDictionary($rootScope.dictionary);
    }



    vm.$watch('settings.w1', function (newValue, oldValue) {
        if (isNaN(newValue)) {
            vm.settings.w1 = oldValue;
            return;
        }

        vm.calculateFrequency();
        ioService.saveSettings();
    });

    vm.$watch('settings.w2', function (newValue, oldValue) {
        if (isNaN(newValue)) {
            vm.settings.w2 = oldValue;
            return;
        }

        vm.calculateFrequency();
        ioService.saveSettings();
    });

    vm.$watch('settings.w3', function (newValue, oldValue) {
        if (isNaN(newValue)) {
            vm.settings.w3 = oldValue;
            return;
        }

        vm.calculateFrequency();
        ioService.saveSettings();
    });

    vm.$watch('settings.w4', function (newValue, oldValue) {
        if (isNaN(newValue)) {
            vm.settings.w4 = oldValue;
            return;
        }

        vm.calculateFrequency();
        ioService.saveSettings();
    });

    vm.$watch('settings.direction', function (newValue, oldValue) {
        if (!newValue || newValue == oldValue) return;

        ioService.saveSettings();
    });


}]);