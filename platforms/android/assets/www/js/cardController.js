angular.module('controllers')

.controller('CardCtrl', ['$scope', '$rootScope', 'ioService', 'cardService', '$ionicPopup', '$state', function ($scope, $rootScope, ioService, cardService, $ionicPopup, $state) {
    console.log('CardCtrl');
    var vm = $scope;

    vm.nextCard = function () {
        var r = Math.random() * ($rootScope.settings.w1 + $rootScope.settings.w2 + $rootScope.settings.w3 + $rootScope.settings.w4);
        var w;
        var item;

        if (r <= $rootScope.settings.w1) w = 4;
        else if (r <= $rootScope.settings.w1 + $rootScope.settings.w2) w = 3;
        else if (r <= $rootScope.settings.w1 + $rootScope.settings.w2 + $rootScope.settings.w3) w = 2;
        else w = 1;

        console.log('r=' + r + ' w=' + w);

        if ($rootScope.settings.direction == 'direct') {
            item = vm.getDirect(w);
        } else if ($rootScope.settings.direction == 'reverse') {
            item = vm.getReverse(w);
        } else if ($rootScope.settings.direction == 'both') {
            item = (Math.random() > 0.5) ? vm.getDirect(w) : vm.getReverse(w);
        }

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
        var progress;

        if ($rootScope.settings.direction == 'direct') {
            progress = cardService.calculateProgress('direct');
        } else if ($rootScope.settings.direction == 'reverse') {
            progress = cardService.calculateProgress('reverse');
        } else if ($rootScope.settings.direction == 'both') {
            progress = (Math.random() > 0.5) ? cardService.calculateProgress('direct') : cardService.calculateProgress('reverse');
        }

        return progress;
    }


    vm.answer = function () {
        vm.mode = 'answer';
    }

    vm.correct = function () {
        vm.mode = 'question';
        vm.card = vm.nextCard();
        vm.progress = vm.getProgress();
    }

    vm.wrong = function () {
        vm.mode = 'question';
        vm.card = vm.nextCard();
        vm.progress = vm.getProgress();
    }


    vm.card = vm.nextCard();
    vm.progress = vm.getProgress();
    vm.mode = 'question';

}])