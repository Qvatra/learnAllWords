angular.module('app').controller('mainController', ['$scope', 'settingsService', 'ioService', 'cardService', '$rootScope', '$ionicScrollDelegate', function ($scope, settingsService, io, cardService, $rootScope, $ionicScrollDelegate) {
    console.log('main');
    var vm = $scope;

    vm.cardService = cardService;
    vm.ioService = io;
    vm.scroller = $ionicScrollDelegate;

    vm.settingsDirection;
    vm.w1, vm.w2, vm.w3, vm.w4;
    vm.w1p, vm.w2p, vm.w3p, vm.w4p;
    vm.mode = 'home';
    vm.current = null; //card to process

    vm.progress = 0; //total %
    vm.progressDir = 0;
    vm.progressRev = 0;
    vm.progressBoth = 0;
    vm.dirColorStyle;
    vm.revColorStyle;
    vm.bothColorStyle;
    vm.colorStyle; //color of the progress msg 
    vm.progressBarStyle; //color and width of the progress bar


    vm.home = function () {
        //console.log('home');
        vm.mode = 'home';
        vm.progress = cardService.calculateProgress($rootScope.settings.direction);
        vm.progressDir = cardService.calculateProgress('direct');
        vm.progressRev = cardService.calculateProgress('reverse');
        vm.progressBoth = cardService.calculateProgress('both');
        vm.dirColorStyle = { color: cardService.calculateColor('direct'), fontFamily: 'cursive' };
        vm.revColorStyle = { color: cardService.calculateColor('reverse'), fontFamily: 'cursive' };
        vm.bothColorStyle = { color: cardService.calculateColor('both'), fontFamily: 'cursive' };
    };
    vm.home();

    vm.getSettings = function (settings) {
        vm.settingsDirection = settings.direction;
        vm.w1 = parseFloat(settings.w1);
        vm.w2 = parseFloat(settings.w2);
        vm.w3 = parseFloat(settings.w3);
        vm.w4 = parseFloat(settings.w4);
    }


    vm.getSettings(settingsService.initialize());
    //cardService.initialize();


    vm.checkDictionary = function () {
        if (cardService.array.length != 0) {
            vm.card();
            vm.getNextItem();
        } else {
            cardService.needDictionary().then(function () {
                vm.settingsView();
            });
        }
    }


    vm.card = function () {
        //console.log('card');
        vm.mode = 'card';
        vm.progress = cardService.calculateProgress($rootScope.settings.direction);
        vm.colorStyle = { color: cardService.calculateColor($rootScope.settings.direction) };
        vm.progressBarStyle = { background: cardService.calculateColor($rootScope.settings.direction), width: vm.progress + '%' }
    };

    vm.rate = function () {
        //console.log('rate');
        vm.mode = 'rate';
    };

    vm.edit = function () {
        vm.mode = 'edit';
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

    vm.loadSourceFile = function () {
        cardService.loadSourceFile().then(function () {
            vm.progress = 0;
            vm.progressDir = 0;
            vm.progressRev = 0;
            vm.progressBoth = 0;
        });
    }


}]);