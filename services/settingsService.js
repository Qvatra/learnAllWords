angular.module('app').service('settingsService', ['$q', '$rootScope', function ($q, $rootScope) {
    console.log('settings');
    var vm = this;

    vm.settings = {};
    vm.radioBtn = 'direct';

    vm.initialize = function () {
        var savedSettings = JSON.parse(localStorage.getItem('settings'));
        if (savedSettings) {
            vm.radioBtn = savedSettings.direction;
        } 

        $rootScope.direction = vm.radioBtn;
        return vm.radioBtn;
    }



    vm.detectDirection = function (val) {
        vm.settings.direction = val;
        console.log('changed to ' + val);
        $rootScope.direction = val;
        localStorage.setItem('settings', JSON.stringify(vm.settings));
    }


}]);