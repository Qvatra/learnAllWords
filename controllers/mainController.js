angular.module('app').controller('mainController', ['$scope', 'settingsService', 'ioService', 'cardService', function ($scope, settings, io, cardService) {
    var vm = $scope;

    vm.settingsDirection;
    vm.mode = 'home';
    vm.current = null; //card to process

    vm.settingsDirection = settings.initialize();
    cardService.initialize();


    vm.home = function () {
        //console.log('home');
        vm.mode = 'home';
    };

    vm.card = function () {
        //console.log('card');
        vm.mode = 'card';
    };

    vm.rate = function () {
        //console.log('rate');
        vm.mode = 'rate';
    };

    vm.settings = function () {
        //console.log('settings');
        vm.mode = 'settings';
    };







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



    vm.settingsClick = function () {
        settings.detectDirection(vm.settingsDirection);
    }
}]);