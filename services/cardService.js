angular.module('app').service('cardService', ['$q', 'ioService', '$rootScope', function ($q, io, $rootScope) {
    console.log('card');
    var vm = this;

    vm.array = [];
    vm.w1 = 5;
    vm.w2 = 15;
    vm.w3 = 30;
    vm.w4 = 50; //don't really use it

    
    vm.initialize = function () {
        io.parseDictionary('/dutch.js').then(function (result) {
            vm.array = result;
            console.log('loading array --------------------------------');
            console.log(result);
        });
    }



    vm.printArray = function () {
        console.log('printing array --------------------------------');
        vm.array.forEach(function (item) {
            console.log('w: ' + item.w + ', t: ' + item.t + ', d: ' + item.d + ', r: ' + item.r);
        });
    }



    vm.nextCard = function () {
        var r = Math.random() * 100; //[0,100)
        var w;

        if (r <= vm.w1) w = 4;
        else if (r <= vm.w1 + vm.w2) w = 3;
        else if (r <= vm.w1 + vm.w2 + vm.w3) w = 2;
        else w = 1;


        if ($rootScope.direction == 'direct') {
            var item = vm.getDirect(w);
        } else if ($rootScope.direction == 'reverse') {
            var item = vm.getReverse(w);
        } else if ($rootScope.direction == 'both') {
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
        if (dir == 'd'){
            if (vm.array[vm.array.length - 1].d < 4) vm.array[vm.array.length - 1].d++;
        } else if (dir == 'r'){
            if (vm.array[vm.array.length - 1].r < 4) vm.array[vm.array.length - 1].r++;
        }
    }



    vm.wrong = function (dir) {
        if (dir == 'd') {
            if (vm.array[vm.array.length - 1].d > 1) vm.array[vm.array.length - 1].d--;
        } else if (dir == 'r') {
            if (vm.array[vm.array.length - 1].r > 1) vm.array[vm.array.length - 1].r--;
        }
    }



}]);