angular.module('controllers')

.controller('SettingsCtrl', ['$scope', '$rootScope', '$state', 'ioService', 'cardService', '$ionicPopup', function ($scope, $rootScope, $state, ioService, cardService, $ionicPopup) {
    //console.log('settingsController');
    var vm = $scope;

    vm.progress;
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
    vm.settings = JSON.parse(JSON.stringify($rootScope.settings)); //pass-by-value
    vm.settings = ioService.parseFloatSettings(vm.settings);


    vm.calculateFrequency();
    vm.progress = cardService.calculateProgress(vm.settings.direction);



    vm.resetWeights = function () {
        vm.settings.w1 = 5;
        vm.settings.w2 = 15;
        vm.settings.w3 = 30;
        vm.settings.w4 = 50;

        vm.calculateFrequency();
        $rootScope.settings = vm.settings;
        ioService.saveSettings();
    }


    vm.saveWeights = function () {
        if (vm.f1 < 5 || vm.f2 < 5 || vm.f3 < 5 || vm.f4 < 5) {
            $ionicPopup.alert({ title: 'Can not Save!', template: 'Frequency values can not be less then 5 %.' });
        } else {
            $rootScope.settings = vm.settings;
            ioService.saveSettings();

            $ionicPopup.alert({ title: 'Saved!' });
        }
    }


    vm.resetProgress = function () {
        cardService.resetProgress();
        vm.progress = cardService.calculateProgress(vm.settings.direction);
        ioService.saveDictionary($rootScope.dictionary);
    }



    vm.$watch('settings.w1', function (newValue, oldValue) {
        if (isNaN(newValue)) {
            vm.settings.w1 = oldValue;
            return;
        }

        vm.calculateFrequency();
    });

    vm.$watch('settings.w2', function (newValue, oldValue) {
        if (isNaN(newValue)) {
            vm.settings.w2 = oldValue;
            return;
        }

        vm.calculateFrequency();
    });

    vm.$watch('settings.w3', function (newValue, oldValue) {
        if (isNaN(newValue)) {
            vm.settings.w3 = oldValue;
            return;
        }

        vm.calculateFrequency();
    });

    vm.$watch('settings.w4', function (newValue, oldValue) {
        if (isNaN(newValue)) {
            vm.settings.w4 = oldValue;
            return;
        }

        vm.calculateFrequency();
    });

    vm.$watch('settings.direction', function (newValue, oldValue) {
        if (!newValue || newValue == oldValue) return;

        ioService.saveSettings();
    });


}]);