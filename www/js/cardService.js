angular.module('services').service('cardService', ['$rootScope', '$q', '$http', '$timeout', function ($rootScope, $q, $http, $timeout) {
    //console.log('cardService');
    var vm = this;

    vm.calculateProgress = function (direction) {
        if ($rootScope.dictionary.length == 0) return 0;
        var progress = 0;

        if (direction == 'direct') {
            $rootScope.dictionary.forEach(function (item) {
                progress += parseInt(item.d);
            });
            progress = progress / $rootScope.dictionary.length;
        } else if (direction == 'reverse') {
            $rootScope.dictionary.forEach(function (item) {
                progress += parseInt(item.r);
            });
            progress = progress / $rootScope.dictionary.length;
        } else if (direction == 'both') {
            $rootScope.dictionary.forEach(function (item) {
                progress += (parseInt(item.d) + parseInt(item.r));
            });
            progress = progress / (2 * $rootScope.dictionary.length);
        }

        return ((progress - 1) * 100 / 3).toPrecision(3);
    }



    vm.calculateColor = function (direction) {
        var delta = vm.calculateProgress(direction) * 5.1;
        if (delta <= 255) return 'rgb(255,' + Math.floor(delta) + ',0)';
        else return 'rgb(' + Math.floor(510 - delta) + ',255,0)';
    }



    vm.resetProgress = function () {
        if ($rootScope.dictionary.length == 0) return;

        $rootScope.dictionary.forEach(function (item) {
            item.r = 1;
            item.d = 1;
        });
    }


    vm.wordsToLearn = function (dir) { //amount of words with les than 4 stars
        var count = 0;

        $rootScope.dictionary.forEach(function (item) {
            if (dir == 'direct') {
                if (item.d < 4) count++;
            } else if(dir =='reverse'){
                if (item.r < 4) count++;
            }
        });

        return count;
    }



}]);