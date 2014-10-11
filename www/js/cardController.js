angular.module('controllers')

.controller('CardCtrl', ['$scope', '$rootScope', 'ioService', 'cardService', '$ionicPopup', '$state', function ($scope, $rootScope, ioService, cardService, $ionicPopup, $state) {
    console.log('CardCtrl');
    var vm = $scope;

    vm.card;
    vm.progress;
    vm.mode;
    vm.currentDirection;

    if (!$rootScope.dictionary) ioService.initialize(); //dictionary, settings

    vm.detectDirection = function () {
        if ($rootScope.settings.direction == 'direct') {
            vm.currentDirection = 'direct';
        } else if ($rootScope.settings.direction == 'reverse') {
            vm.currentDirection = 'reverse';
        } else if ($rootScope.settings.direction == 'both') {
            vm.currentDirection = (Math.random() > 0.5) ? 'direct' : 'reverse';
        }
    }

    vm.nextCard = function () {
        var r = Math.random() * ($rootScope.settings.w1 + $rootScope.settings.w2 + $rootScope.settings.w3 + $rootScope.settings.w4);
        var w;
        

        if (r <= $rootScope.settings.w1) w = 4;
        else if (r <= $rootScope.settings.w1 + $rootScope.settings.w2) w = 3;
        else if (r <= $rootScope.settings.w1 + $rootScope.settings.w2 + $rootScope.settings.w3) w = 2;
        else w = 1;

        console.log('r=' + r + ' w=' + w);

        vm.detectDirection();

        var item = (vm.currentDirection == 'direct') ? vm.getDirect(w) : vm.getReverse(w);

        if (!item) {
            return vm.nextCard();
        } else {
            console.log('printing array --------------------------------');
            console.log('random = ' + r + '%, weight = ' + w + ', dir: ' + item.dir);
            $rootScope.dictionary.forEach(function (item) {
                console.log('w: ' + item.w + ', t: ' + item.t + ', d: ' + item.d + ', r: ' + item.r);
            });
            return item;
        }
    }


    vm.getDirect = function (w) {
        var result = null;

        for (var i = 0; i < $rootScope.dictionary.length; i++) {
            if ($rootScope.dictionary[i].d == w) {
                result = $rootScope.dictionary.splice(i, 1)[0];
                $rootScope.dictionary.push(result);
                break;
            }
        }

        if (result) return { w: result.w, t: result.t, weight: result.d, dir: 'd' };
        else return null;
    }


    vm.getReverse = function (w) {
        var result = null;

        for (var i = 0; i < $rootScope.dictionary.length; i++) {
            if ($rootScope.dictionary[i].r == w) {
                result = $rootScope.dictionary.splice(i, 1)[0];
                $rootScope.dictionary.push(result);
                break;
            }
        }
        if (result) return { w: result.t, t: result.w, weight: result.r, dir: 'r' };
        else return null;
    }

    vm.getProgress = function () {
        return progress = (vm.currentDirection == 'direct') ? cardService.calculateProgress('direct') : cardService.calculateProgress('reverse');
    }

    vm.answer = function () {
        vm.mode = 'answer';
    }

    vm.correct = function () {
        vm.mode = 'question';
        vm.setWeightForCurrent(1);
        vm.card = vm.nextCard();
        vm.progress = vm.getProgress();
    }

    vm.wrong = function () {
        vm.mode = 'question';
        vm.setWeightForCurrent(-1);
        vm.card = vm.nextCard();
        vm.progress = vm.getProgress();
    }

    vm.setWeightForCurrent = function (dw) {
        var current = $rootScope.dictionary[$rootScope.dictionary.length - 1];

        if (vm.currentDirection == 'direct') {
            if (current.d + dw < 5 && current.d + dw > 0) current.d += dw;
        } else if (vm.currentDirection == 'reverse') {
            if (current.r + dw < 5 && current.r + dw > 0) current.r += dw;
        }

        $rootScope.dictionary[$rootScope.dictionary.length - 1] = current;
        ioService.saveDictionary($rootScope.dictionary);
    }


    vm.card = vm.nextCard();
    vm.progress = vm.getProgress();
    vm.mode = 'question';

}])