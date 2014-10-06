angular.module('app').service('cardService', ['$q', 'ioService', '$rootScope', '$ionicPopup', function ($q, io, $rootScope, $ionicPopup) {
    console.log('card');
    console.log($rootScope.settings.direction);
    var vm = this;

    vm.array = [];

    vm.array = io.loadDictionary();

    vm.loadSourceFile = function () {
        return io.parseDictionary('/dutch.js').then(function (result) {
            vm.array = result;

        });
    }

    vm.resetProgress = function () {
        vm.array.forEach(function (item) {
            item.r = 1;
            item.d = 1;
        });
        io.saveDictionary(vm.array);
    }


    vm.calculateProgress = function (dir) {
        var progress = 0;

        if (dir == 'direct') {
            vm.array.forEach(function (item) {
                progress += parseInt(item.d);
            });
            progress = progress / vm.array.length;
        } else if (dir == 'reverse') {
            vm.array.forEach(function (item) {
                progress += parseInt(item.r);
            });
            progress = progress / vm.array.length;
        } else if (dir == 'both') {
            vm.array.forEach(function (item) {
                progress += (parseInt(item.d) + parseInt(item.r));
            });
            progress = progress / (2 * vm.array.length);
        }

        progress = (progress - 1) * 100 / 3;

        return progress;
    }



    vm.checkProgress = function () {
        var dir = $rootScope.settings.direction;
        if (vm.calculateProgress(dir) == 100) {
            var direction = (dir == 'direct') ? 'W -> T' : ((dir == 'reserve') ? 'T -> W' : 'T -> W & W -> T');
            $ionicPopup.alert({
                title: 'Congratulations!', // String. The title of the popup.
                subTitle: direction, // String (optional). The sub-title of the popup.
                template: 'have been learned', // String (optional). The html template to place in the popup body.
                templateUrl: '', // String (optional). The URL of an html template to place in the popup   body.
                okText: '', // String (default: 'OK'). The text of the OK button.
                okType: '', // String (default: 'button-positive'). The type of the OK button.
            });
        }
    }



    vm.calculateColor = function (dir) {
        var delta = vm.calculateProgress(dir) * 5.1;
        if (delta <= 255) return 'rgb(255,' + Math.floor(delta) + ',0)';
        else return 'rgb(' + Math.floor(510 - delta) + ',255,0)';
    }



    vm.printArray = function () {
        console.log('printing array --------------------------------');
        vm.array.forEach(function (item) {
            console.log('w: ' + item.w + ', t: ' + item.t + ', d: ' + item.d + ', r: ' + item.r);
        });
    }



    vm.nextCard = function () {
        var r = Math.random() * ($rootScope.settings.w1 + $rootScope.settings.w2 + $rootScope.settings.w3 + $rootScope.settings.w4);
        var w;

        if (r <= $rootScope.settings.w1) w = 4;
        else if (r <= $rootScope.settings.w1 + $rootScope.settings.w2) w = 3;
        else if (r <= $rootScope.settings.w1 + $rootScope.settings.w2 + $rootScope.settings.w3) w = 2;
        else w = 1;

        console.log('r=' + r + ' w=' + w);

        if ($rootScope.settings.direction == 'direct') {
            var item = vm.getDirect(w);
        } else if ($rootScope.settings.direction == 'reverse') {
            var item = vm.getReverse(w);
        } else if ($rootScope.settings.direction == 'both') {
            var item = (Math.random() > 0.5) ? vm.getDirect(w) : vm.getReverse(w);
        }

        if (!item) {
            return vm.nextCard();
        } else {
            console.log('random = ' + r + '%, weight = ' + w + ', dir: ' + item.dir);
            vm.printArray();
            return item;
        }
    }



    vm.getDirect = function (w) {
        var result = null;

        for (var i = 0; i < vm.array.length; i++) {
            if (vm.array[i].d == w) {
                result = vm.array.splice(i, 1)[0];
                vm.array.push(result);
                break;
            }
        }

        if (result) return { w: result.w, t: result.t, weight: result.d, dir: 'd' };
        else return null;
    }



    vm.getReverse = function (w) {
        var result = null;

        for (var i = 0; i < vm.array.length; i++) {
            if (vm.array[i].r == w) {
                result = vm.array.splice(i, 1)[0];
                vm.array.push(result);
                break;
            }
        }
        if (result) return { w: result.t, t: result.w, weight: result.r, dir: 'r' };
        else return null;
    }



    vm.correct = function (dir) {
        if (dir == 'd') {
            if (vm.array[vm.array.length - 1].d < 4) vm.array[vm.array.length - 1].d++;
        } else if (dir == 'r') {
            if (vm.array[vm.array.length - 1].r < 4) vm.array[vm.array.length - 1].r++;
        }
        io.saveDictionary(vm.array);
    }



    vm.wrong = function (dir) {
        if (dir == 'd') {
            if (vm.array[vm.array.length - 1].d > 1) vm.array[vm.array.length - 1].d--;
        } else if (dir == 'r') {
            if (vm.array[vm.array.length - 1].r > 1) vm.array[vm.array.length - 1].r--;
        }
        io.saveDictionary(vm.array);
    }

    vm.deleteItem = function (idx) {
        vm.array.splice(idx, 1);
    }

    vm.deleteAll = function () {
        vm.array = [];
    }

    vm.addItem = function () {
        vm.array.push({ w: '', t: '', d: 1, r: 1 });
    }


}]);