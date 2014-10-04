angular.module('app').controller('mainController', ['$scope', 'settingsService', 'ioService', 'cardService', '$rootScope', function ($scope, settingsService, io, cardService, $rootScope) {
    console.log('main');
    console.log($rootScope.settings.direction);
    var vm = $scope;

    vm.settingsDirection;
    vm.w1, vm.w2, vm.w3, vm.w4;
    vm.w1p, vm.w2p, vm.w3p, vm.w4p;
    vm.mode = 'home';
    vm.current = null; //card to process
    vm.progress;
    vm.colorStyle;
    vm.progressBarStyle;


    vm.getSettings = function (settings) {
        vm.settingsDirection = settings.direction;
        vm.w1 = parseFloat(settings.w1);
        vm.w2 = parseFloat(settings.w2);
        vm.w3 = parseFloat(settings.w3);
        vm.w4 = parseFloat(settings.w4);
    }

    vm.getSettings(settingsService.initialize());



    cardService.initialize();


    vm.home = function () {
        //console.log('home');
        vm.mode = 'home';
        vm.progress = cardService.calculateProgress();
    };

    vm.card = function () {
        //console.log('card');
        vm.mode = 'card';
        vm.progress = cardService.calculateProgress();
        vm.colorStyle = { color: cardService.calculateColor() };
        vm.progressBarStyle = { background: cardService.calculateColor(), width: vm.progress + '%' }
    };

    vm.rate = function () {
        //console.log('rate');
        vm.mode = 'rate';
    };

    vm.settingsView = function () {
        //console.log('settings');
        vm.mode = 'settings';
    };

    vm.$watch('w1', function (newValue, oldValue) {
        if (isNaN(newValue)) {
            vm.w1 = oldValue;
            return;
        }
        settingsService.detectWeight(1, newValue);
        vm.recalcWeights();
    });

    vm.$watch('w2', function (newValue, oldValue) {
        if (isNaN(newValue)) {
            vm.w2 = oldValue;
            return;
        }
        settingsService.detectWeight(2, newValue);
        vm.recalcWeights();
    });

    vm.$watch('w3', function (newValue, oldValue) {
        if (isNaN(newValue)) {
            vm.w3 = oldValue;
            return;
        }
        settingsService.detectWeight(3, newValue);
        vm.recalcWeights();
    });

    vm.$watch('w4', function (newValue, oldValue) {
        if (isNaN(newValue)) {
            vm.w4 = oldValue;
            return;
        }
        settingsService.detectWeight(4, newValue);
        vm.recalcWeights();
    });

    vm.recalcWeights = function () {
        vm.w1p = 100 * vm.w1 / (vm.w1 + vm.w2 + vm.w3 + vm.w4);
        vm.w2p = 100 * vm.w2 / (vm.w1 + vm.w2 + vm.w3 + vm.w4);
        vm.w3p = 100 * vm.w3 / (vm.w1 + vm.w2 + vm.w3 + vm.w4);
        vm.w4p = 100 * vm.w4 / (vm.w1 + vm.w2 + vm.w3 + vm.w4);
    }

    vm.getNextItem = function () {
        vm.current = cardService.nextCard();
    };


    vm.wrong = function () {
        cardService.wrong(vm.current.dir);
        vm.current = null;
    }


    vm.correct = function () {
        cardService.correct(vm.current.dir);
        vm.current = null;
    }


    vm.directionClick = function (val) {
        settingsService.detectDirection(val);
    }


    vm.resetProgress = function () {
        cardService.resetProgress();
        vm.progress = 0;
    }


    vm.resetWeights = function () {
        vm.getSettings(settingsService.resetWeights());
    }

}]);