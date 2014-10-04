angular.module('app').service('settingsService', ['$q', '$rootScope', function ($q, $rootScope) {
    console.log('settings');
    var vm = this;

    $rootScope.settings = { direction: 'direct', w1: '5', w2: '15', w3: '30', w4: '50' }; //initial feed

    vm.initialize = function () {
        var savedSettings = JSON.parse(localStorage.getItem('settings'));
        if (savedSettings.direction) $rootScope.settings.direction = savedSettings.direction;
        if (savedSettings.w1) $rootScope.settings.w1 = savedSettings.w1;
        if (savedSettings.w2) $rootScope.settings.w2 = savedSettings.w2;
        if (savedSettings.w3) $rootScope.settings.w3 = savedSettings.w3;
        if (savedSettings.w4) $rootScope.settings.w4 = savedSettings.w4;

        return $rootScope.settings;
    }



    vm.detectDirection = function (val) {
        $rootScope.settings.direction = val;
        console.log('direction changed to ' + val);

        vm.save();
    }



    vm.detectWeight = function (w, val) {
        if (w == 1) {
            $rootScope.settings.w1 = val;
        } else if (w == 2) {
            $rootScope.settings.w2 = val;
        } else if (w == 3) {
            $rootScope.settings.w3 = val;
        } else if (w == 4) {
            $rootScope.settings.w4 = val;
        }

        console.log('weight changed to ' + val);

        vm.save();
    }


    vm.save = function () {
        localStorage.setItem('settings', JSON.stringify($rootScope.settings));
    }


}]);