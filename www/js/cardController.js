angular.module('controllers')

.controller('CardCtrl', ['$scope', '$rootScope', 'ioService', 'cardService', '$ionicPopup', '$state', function ($scope, $rootScope, ioService, cardService, $ionicPopup, $state) {
    //console.log('CardCtrl');
    var vm = $scope;

    vm.card;
    vm.progress;
    vm.mode;
    vm.currentDirection;
    vm.colorProgress;
    vm.progressBarStyle;
   

    if (!$rootScope.dictionary || $rootScope.dictionary.length == 0) ioService.initialize(); //dictionary, settings

    vm.repeatDelay = Math.floor($rootScope.dictionary.length / 2);


    vm.detectDirection = function () {
        if ($rootScope.settings.direction == 'direct') {
            vm.currentDirection = 'direct';
        } else if ($rootScope.settings.direction == 'reverse') {
            vm.currentDirection = 'reverse';
        } else if ($rootScope.settings.direction == 'both') {
            vm.currentDirection = (Math.random() > 0.5) ? 'direct' : 'reverse';
        }
    }



    vm.nextCard = function (w1, w2, w3, w4) { //50, 30, 15, 5
        console.log('nextCard: ' + w1 + ' ' + w2 + ' ' + w3 + ' ' + w4);
        //console.log('nextCardWieghts: ' + w1 + ' ' + (w1 + w2) + ' ' + (w1 + w2 + w3) + ' ' + (w1 + w2 + w3 + w4));
        var r = Math.random() * (w1 + w2 + w3 + w4);
        var w;

        console.log('r= ' + r + ' out of ' + (w1 + w2 + w3 + w4));

        if (r <= w1) w = 1;
        else if (r <= w1 + w2) w = 2;
        else if (r <= w1 + w2 + w3) w = 3;
        else w = 4;

        vm.detectDirection(); //sets vm.currentDirection

        if (w1 + w2 + w3 + w4 == 0) w = 0;

        var item = (vm.currentDirection == 'direct') ? vm.getDirect(w) : vm.getReverse(w);

        if (!item) {
            console.log('no item for star: ' + w);
            if (w == 1) w1 = 0;
            if (w == 2) w2 = 0;
            if (w == 3) w3 = 0;
            if (w == 4) w4 = 0;

            return vm.nextCard(w1, w2, w3, w4);
        } else {
            if ($rootScope.dictionary.length > vm.repeatDelay && (item.idx >= $rootScope.dictionary.length - vm.repeatDelay)) {
                console.log('rejected due to repeat rule: item name: ' + item.w);
                if (w == 1) w1 = 0;
                if (w == 2) w2 = 0;
                if (w == 3) w3 = 0;
                if (w == 4) w4 = 0;

                return vm.nextCard(w1, w2, w3, w4);
            } else {
                console.log('item with star: ' + w + ' selected');
                vm.progress = cardService.calculateProgress($rootScope.settings.direction);
                vm.colorProgress = { color: cardService.calculateColor($rootScope.settings.direction), fontFamily: 'cursive' };
                vm.progressBarStyle = { background: cardService.calculateColor($rootScope.settings.direction), width: vm.progress + '%' };

                return item;
            }
        }
    }



    vm.getDirect = function (w) {
        var result = null;
        var idx = 0;

        if (w == 0) {
            result = $rootScope.dictionary.splice(0, 1)[0];
            $rootScope.dictionary.push(result);
        } else {
            for (var i = 0; i < $rootScope.dictionary.length; i++) {
                if ($rootScope.dictionary[i].d == w) {
                    result = $rootScope.dictionary.splice(i, 1)[0];
                    $rootScope.dictionary.push(result);
                    idx = i;
                    break;
                }
            }
        }

        if (result) return { w: result.w, t: result.t, weight: result.d, dir: 'd', idx: idx };
        else return null;
    }



    vm.getReverse = function (w) {
        var result = null;
        var idx = 0;

        if (w == 0) {
            result = $rootScope.dictionary.splice(0, 1)[0];
            $rootScope.dictionary.push(result);
        } else {
            for (var i = 0; i < $rootScope.dictionary.length; i++) {
                if ($rootScope.dictionary[i].r == w) {
                    result = $rootScope.dictionary.splice(i, 1)[0];
                    $rootScope.dictionary.push(result);
                    idx = i;
                    break;
                }
            }
        }

        if (result) return { w: result.t, t: result.w, weight: result.r, dir: 'r', idx: idx };
        else return null;
    }


    vm.answer = function () {
        vm.mode = 'answer';
    }


    vm.correct = function () {
        vm.mode = 'question';
        vm.setWeightForCurrent(1);

        vm.card = vm.nextCard(parseInt($rootScope.settings.w1), parseInt($rootScope.settings.w2), parseInt($rootScope.settings.w3), parseInt($rootScope.settings.w4));

        if (vm.progress == 100) {
            if ($rootScope.settings.direction == 'both') {
                if (!$rootScope.winFlag) {
                    $ionicPopup.alert({ title: '<h3>Congratulations!</h3><img src="img/win.png" class="imgWin" /><br /><h5>You have learned all the words in this vocabulary!<br />Here is your diploma!</h5><br /><h6>You can start all over again by resetting <strong>progress</strong> in the settings section.</h6>' });
                    $rootScope.winFlag = true;
                }
            } else {
                if (!$rootScope.almostWinFlag) {
                    $ionicPopup.alert({ title: '<h3>Congratulations!</h3><h5>You are almost finished your education!<br /><br />To be able to graduate you need to change mode of the app to<br /><strong>W->T or T->W</strong>.</h5>' });
                    $rootScope.almostWinFlag = true;
                }
            }
        }
    }


    vm.wrong = function () {
        vm.mode = 'question';
        vm.setWeightForCurrent(-1);
        vm.card = vm.nextCard(parseInt($rootScope.settings.w1), parseInt($rootScope.settings.w2), parseInt($rootScope.settings.w3), parseInt($rootScope.settings.w4));
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


    if (!$rootScope.dictionary || $rootScope.dictionary.length == 0) {
        $state.go('tab.dash', {});
    } else {
        vm.card = vm.nextCard(parseInt($rootScope.settings.w1), parseInt($rootScope.settings.w2), parseInt($rootScope.settings.w3), parseInt($rootScope.settings.w4));
        vm.mode = 'question';
    }

}])